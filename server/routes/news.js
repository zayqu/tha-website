const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { body, param, query, validationResult } = require('express-validator');
const { news } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { generateCloudflareDraft } = require('../cloudflare-ai');
const { persistArticleImages } = require('../media-storage');
const { contentImportSecret } = require('../runtime-secrets');

// ── Constants ─────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return false; }
  return true;
}

const newsBodyValidators = [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('excerpt').trim().notEmpty().isLength({ max: 500 }),
  body('content').trim().notEmpty().isLength({ max: 50000 }),
  body('image').trim().notEmpty().isLength({ max: 2_000_000 }),
  body('category').trim().notEmpty().isLength({ max: 80 })
    .withMessage('Category is required and must be 80 characters or fewer'),
  body('author').trim().notEmpty().isLength({ max: 100 }),
  body('date').trim().notEmpty().withMessage('Date is required'),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().isString().isLength({ max: 50 }).trim(),
  body('inline_images').optional().isArray({ max: 2 }),
  body('inline_images.*.src').optional().isString().isLength({ max: 700000 }),
  body('inline_images.*.alt').optional().isString().isLength({ max: 180 }).trim(),
  body('inline_images.*.after_paragraph').optional().isInt({ min: 1, max: 20 }),
  body('is_featured').optional().isBoolean(),
  body('published').optional().isBoolean(),
];

// ── GET /api/news  (public) ───────────────────────────────────────────────────
router.get('/', [
  query('category').optional().trim().isLength({ min: 1, max: 80 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
], async (req, res, next) => {
  try {
  if (!handleValidation(req, res)) return;
  const { category, limit = 50, offset = 0 } = req.query;
  const articles = await news.findPublished({ category, limit: Number(limit), offset: Number(offset) });
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json({ articles });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/news/admin  (protected – includes drafts) ────────────────────────
router.get('/admin', requireAuth, async (_req, res, next) => {
  try {
    res.json({ articles: await news.findAll() });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/news/import  (automation; drafts only) ──────────────────────────
router.post('/import', async (req, res, next) => {
  try {
    const configuredSecret = process.env.CONTENT_IMPORT_SECRET || contentImportSecret;
    const suppliedSecret = req.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
    if (!configuredSecret || !suppliedSecret) {
      return res.status(401).json({ error: 'Import authorization required' });
    }
    const expected = Buffer.from(configuredSecret);
    const supplied = Buffer.from(suppliedSecret);
    if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
      return res.status(401).json({ error: 'Import authorization required' });
    }

    const items = Array.isArray(req.body?.items) ? req.body.items.slice(0, 25) : [];
    if (!items.length) return res.status(400).json({ error: 'At least one item is required' });

    const existing = await news.findAll();
    const results = [];

    for (const raw of items) {
      const title = String(raw.title || '').trim().slice(0, 200);
      const excerpt = String(raw.excerpt || '').trim().slice(0, 500);
      const source = String(raw.source || 'Trusted health source').trim().slice(0, 100);
      const sourceUrl = String(raw.url || '').trim();
      const parsedDate = new Date(raw.date || Date.now());
      const topics = Array.isArray(raw.topics)
        ? raw.topics.map(topic => String(topic).trim().slice(0, 50)).filter(Boolean).slice(0, 10)
        : [];

      if (!title || !excerpt || !/^https:\/\//i.test(sourceUrl) || Number.isNaN(parsedDate.getTime())) {
        results.push({ title: title || 'Untitled', status: 'invalid' });
        continue;
      }
      if (existing.some(article => String(article.content || '').includes(sourceUrl))) {
        results.push({ title, status: 'duplicate' });
        continue;
      }

      const baseSlug = slugify(title) || `health-update-${Date.now()}`;
      let slug = baseSlug;
      let counter = 1;
      while (await news.slugExists(slug)) slug = `${baseSlug}-${counter++}`;

      const article = await news.create({
        id: uuidv4(),
        slug,
        title,
        excerpt,
        content: `${excerpt}\n\nSource: ${source}\nRead the original update: ${sourceUrl}`,
        image: 'https://tzhealthalliance.or.tz/favicon.svg',
        category: 'Announcements',
        author: source,
        date: parsedDate.toISOString().slice(0, 10),
        tags: topics,
        is_featured: false,
        published: false,
      });
      existing.push(article);
      results.push({ id: article.id, title, status: 'drafted' });
    }

    res.status(201).json({
      imported: results.filter(item => item.status === 'drafted').length,
      duplicates: results.filter(item => item.status === 'duplicate').length,
      invalid: results.filter(item => item.status === 'invalid').length,
      results,
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/news/generate  (protected AI drafting) ─────────────────────────
router.post('/generate', requireAuth, [
  body('topic').trim().notEmpty().isLength({ max: 300 }),
  body('purpose').optional().trim().isLength({ max: 100 }),
  body('facts').optional().trim().isLength({ max: 5000 }),
  body('image').optional({ nullable: true }).isString().isLength({ max: 2_000_000 }),
  body('images').optional().isArray({ max: 3 }),
  body('images.*').optional().isString().isLength({ max: 700000 }),
  body('categories').optional().isArray({ max: 100 }),
  body('categories.*').optional().isString().isLength({ max: 80 }).trim(),
], async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;

    const { topic, purpose = 'News update', facts = '', image = '', images = [], categories = [] } = req.body;
    const draft = await generateCloudflareDraft({ topic, purpose, facts, categories });

    const visualInputs = images.length ? images : (image ? [image] : []);
    const imagePlan = visualInputs.slice(0, 3).map((_imageUrl, index) => ({
      image_index: index,
      role: index === 0 ? 'banner' : 'inline',
      after_paragraph: index === 0 ? 0 : index === 1 ? 2 : 4,
      alt: index === 0
        ? `Main image for ${String(topic).trim().slice(0, 120)}`
        : `Supporting image for ${String(topic).trim().slice(0, 120)}`,
    }));

    res.json({
      draft: {
        title: String(draft.title || '').trim().slice(0, 200),
        excerpt: String(draft.excerpt || '').trim().slice(0, 500),
        content: String(draft.content || '').trim().slice(0, 12000),
        category: String(draft.category || '').trim().slice(0, 80),
        tags: Array.isArray(draft.tags)
          ? draft.tags.map(tag => String(tag).trim()).filter(Boolean).slice(0, 8)
          : [],
        image_plan: imagePlan,
      },
    });
  } catch (err) {
    if (err.code === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'AI drafting is not configured. Continue manually.', code: err.code });
    }
    if (err.code === 'AI_FREE_LIMIT_REACHED') {
      return res.status(503).json({ error: 'The free AI allowance is temporarily exhausted. Continue manually or try again later.', code: err.code });
    }
    if (err.code === 'AI_TEMPORARILY_UNAVAILABLE' || err.code === 'AI_INVALID_RESPONSE') {
      return res.status(502).json({ error: 'The drafting assistant is temporarily unavailable. Continue manually.', code: err.code });
    }
    next(err);
  }
});

// ── GET /api/news/:slug  (public) ─────────────────────────────────────────────
router.get('/:slug', async (req, res, next) => {
  try {
  const article = await news.findBySlug(req.params.slug, { incrementViews: true });
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json({ article });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/news  (protected) ───────────────────────────────────────────────
router.post('/', requireAuth, newsBodyValidators, async (req, res, next) => {
  try {
  if (!handleValidation(req, res)) return;

  const {
    title, excerpt, content, image, category, author, date,
    tags = [], inline_images = [], is_featured = false, published = true,
  } = req.body;

  // Build unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (await news.slugExists(slug)) slug = `${baseSlug}-${counter++}`;

  const article = await news.create(persistArticleImages({
    id: uuidv4(), slug, title, excerpt, content, image,
    category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    inline_images: Array.isArray(inline_images) ? inline_images : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  }));

  res.status(201).json({ article });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/news/:id  (protected) ────────────────────────────────────────────
router.put('/:id', requireAuth, [
  param('id').isUUID(),
  ...newsBodyValidators,
], async (req, res, next) => {
  try {
  if (!handleValidation(req, res)) return;

  const existing = await news.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Article not found' });

  const {
    title, excerpt, content, image, category, author, date,
    tags = [], inline_images = [], is_featured = false, published = false,
  } = req.body;

  // Regenerate slug only if title changed
  let slug = existing.slug;
  if (title !== existing.title) {
    const baseSlug = slugify(title);
    slug = baseSlug;
    let counter = 1;
    while (await news.slugExists(slug, req.params.id)) slug = `${baseSlug}-${counter++}`;
  }

  const updated = await news.update(req.params.id, persistArticleImages({
    slug, title, excerpt, content, image, category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    inline_images: Array.isArray(inline_images) ? inline_images : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  }));

  res.json({ article: updated });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/news/:id  (protected) ─────────────────────────────────────────
router.delete('/:id', requireAuth, [
  param('id').isUUID(),
], async (req, res, next) => {
  try {
  if (!handleValidation(req, res)) return;
  const existing = await news.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Article not found' });
  await news.delete(req.params.id);
  res.json({ message: 'Article deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
