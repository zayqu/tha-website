const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body, param, query, validationResult } = require('express-validator');
const { news } = require('../db');
const { requireAuth } = require('../middleware/auth');

// ── Constants ─────────────────────────────────────────────────────────────────
const VALID_CATEGORIES = ['Events', 'Press Releases', 'Success Stories', 'Announcements'];

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
  body('image').trim().notEmpty().isLength({ max: 500 }),
  body('category').trim().isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('author').trim().notEmpty().isLength({ max: 100 }),
  body('date').trim().notEmpty().withMessage('Date is required'),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().isString().isLength({ max: 50 }).trim(),
  body('is_featured').optional().isBoolean(),
  body('published').optional().isBoolean(),
];

// ── GET /api/news  (public) ───────────────────────────────────────────────────
router.get('/', [
  query('category').optional().isIn(VALID_CATEGORIES),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
], (req, res) => {
  if (!handleValidation(req, res)) return;
  const { category, limit = 50, offset = 0 } = req.query;
  const articles = news.findPublished({ category, limit: Number(limit), offset: Number(offset) });
  res.json({ articles });
});

// ── GET /api/news/admin  (protected – includes drafts) ────────────────────────
router.get('/admin', requireAuth, (_req, res) => {
  res.json({ articles: news.findAll() });
});

// ── GET /api/news/:slug  (public) ─────────────────────────────────────────────
router.get('/:slug', (req, res) => {
  const article = news.findBySlug(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json({ article });
});

// ── POST /api/news  (protected) ───────────────────────────────────────────────
router.post('/', requireAuth, newsBodyValidators, (req, res) => {
  if (!handleValidation(req, res)) return;

  const {
    title, excerpt, content, image, category, author, date,
    tags = [], is_featured = false, published = false,
  } = req.body;

  // Build unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (news.slugExists(slug)) slug = `${baseSlug}-${counter++}`;

  const article = news.create({
    id: uuidv4(), slug, title, excerpt, content, image,
    category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  });

  res.status(201).json({ article });
});

// ── PUT /api/news/:id  (protected) ────────────────────────────────────────────
router.put('/:id', requireAuth, [
  param('id').isUUID(),
  ...newsBodyValidators,
], (req, res) => {
  if (!handleValidation(req, res)) return;

  const existing = news.findById(req.params.id);
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
    while (news.slugExists(slug, req.params.id)) slug = `${baseSlug}-${counter++}`;
  }

  const updated = news.update(req.params.id, {
    slug, title, excerpt, content, image, category, author, date,
    tags: Array.isArray(tags) ? tags : [],
    is_featured: Boolean(is_featured),
    published: Boolean(published),
  });

  res.json({ article: updated });
});

// ── DELETE /api/news/:id  (protected) ─────────────────────────────────────────
router.delete('/:id', requireAuth, [
  param('id').isUUID(),
], (req, res) => {
  if (!handleValidation(req, res)) return;
  const existing = news.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Article not found' });
  news.delete(req.params.id);
  res.json({ message: 'Article deleted' });
});

module.exports = router;
