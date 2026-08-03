const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { body, param, query, validationResult } = require('express-validator');
const { news } = require('../db');
const { requireAuth } = require('../middleware/auth');

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
    const configuredSecret = process.env.CONTENT_IMPORT_SECRET;
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
        image: 'https://tha-red.vercel.app/favicon.svg',
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
  body('categories').optional().isArray({ max: 100 }),
  body('categories.*').optional().isString().isLength({ max: 80 }).trim(),
], async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI drafting is not configured.' });
    }

    const {
      topic,
      purpose = 'News update',
      facts = '',
      image = '',
      categories = [],
    } = req.body;

    const instructions = [
      'You are the editorial assistant for Tanzania Health Alliance (THA).',
      'Create a professional, human, factual public-health news draft for the THA website.',
      'Never invent names, dates, locations, statistics, quotes, partnerships, outcomes, or medical claims.',
      'Use only the supplied topic, facts, and visible image evidence. If information is missing, write neutrally without guessing.',
      'Use clear English for a general Tanzanian audience, short paragraphs, respectful language, and an institutional but warm tone.',
      'The content must be 5 to 8 useful paragraphs and must not contain Markdown headings, hashtags, or promotional exaggeration.',
      'Choose an existing category when suitable; otherwise suggest one concise professional category.',
      'Return only the requested structured data.',
    ].join(' ');

    const requestContent = [{
      type: 'input_text',
      text: [
        `Topic: ${topic}`,
        `Story type: ${purpose}`,
        `Verified facts supplied by editor:\n${facts || 'No additional facts supplied.'}`,
        `Available categories: ${categories.length ? categories.join(', ') : 'None supplied'}`,
      ].join('\n\n'),
    }];

    if (image && (/^data:image\/(jpeg|png|webp);base64,/i.test(image) || /^https:\/\//i.test(image))) {
      requestContent.push({ type: 'input_image', image_url: image, detail: 'low' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_NEWS_MODEL || 'gpt-5.6-terra',
        instructions,
        input: [{ role: 'user', content: requestContent }],
        reasoning: { effort: 'low' },
        text: {
          format: {
            type: 'json_schema',
            name: 'tha_news_draft',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string', minLength: 10, maxLength: 200 },
                excerpt: { type: 'string', minLength: 30, maxLength: 500 },
                content: { type: 'string', minLength: 200, maxLength: 12000 },
                category: { type: 'string', minLength: 2, maxLength: 80 },
                tags: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 8,
                  items: { type: 'string', minLength: 2, maxLength: 50 },
                },
              },
              required: ['title', 'excerpt', 'content', 'category', 'tags'],
            },
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI news drafting failed:', data.error?.code || response.status);
      return res.status(502).json({ error: 'The drafting assistant is temporarily unavailable. Please try again.' });
    }

    const outputText = data.output_text
      || data.output?.flatMap(item => item.content || []).find(item => item.type === 'output_text')?.text;
    if (!outputText) {
      return res.status(502).json({ error: 'The drafting assistant returned an empty response.' });
    }

    let draft;
    try {
      draft = JSON.parse(outputText);
    } catch (_error) {
      return res.status(502).json({ error: 'The drafting assistant returned an invalid draft.' });
    }

    res.json({
      draft: {
        title: String(draft.title || '').trim().slice(0, 200),
        excerpt: String(draft.excerpt || '').trim().slice(0, 500),
        content: String(draft.content || '').trim().slice(0, 12000),
        category: String(draft.category || '').trim().slice(0, 80),
        tags: Array.isArray(draft.tags)
          ? draft.tags.map(tag => String(tag).trim()).filter(Boolean).slice(0, 8)
          : [],
      },
    });
  } catch (err) {
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
    tags = [], is_featured = false, published = true,
  } = req.body;

  // Build unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (await news.slugExists(slug)) slug = `${baseSlug}-${counter++}`;

  const article = await news.create({
    id: uuidv4(), slug, title, excerpt, content, image,
    category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  });

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
    tags = [], is_featured = false, published = false,
  } = req.body;

  // Regenerate slug only if title changed
  let slug = existing.slug;
  if (title !== existing.title) {
    const baseSlug = slugify(title);
    slug = baseSlug;
    let counter = 1;
    while (await news.slugExists(slug, req.params.id)) slug = `${baseSlug}-${counter++}`;
  }

  const updated = await news.update(req.params.id, {
    slug, title, excerpt, content, image, category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  });

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
