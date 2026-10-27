const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, param, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/auth');
const impactData = require('../../src/data/impact.json');

const router = express.Router();
const hasDatabase = Boolean(process.env.DATABASE_URL);
let pool;
let schemaReady;

if (hasDatabase) {
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/i,
    '$1verify-full'
  );
  pool = new Pool({ connectionString, connectionTimeoutMillis: 5000, query_timeout: 10000 });
}

const JOURNEY_FILE = path.join(__dirname, '../data/journey.json');

function readLocalMilestones() {
  try {
    if (!fs.existsSync(JOURNEY_FILE)) return null;
    const parsed = JSON.parse(fs.readFileSync(JOURNEY_FILE, 'utf8'));
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function writeLocalMilestones(items) {
  const dir = path.dirname(JOURNEY_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${JOURNEY_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ items }, null, 2));
  fs.renameSync(tmp, JOURNEY_FILE);
}

const memoryMilestones = (impactData.yearOneTimeline || []).map((item, index) => ({
  id: `journey-${index + 1}`,
  month: item.month,
  milestone: item.milestone,
  description: item.description,
  icon: item.icon || 'flag',
  color: item.color || 'primary',
  sortOrder: index,
  published: true,
  created_at: 0,
  updated_at: 0,
}));

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id,
    month: row.month,
    milestone: row.milestone,
    description: row.description,
    icon: row.icon || 'flag',
    color: row.color || 'primary',
    sortOrder: Number(row.sort_order || 0),
    published: Boolean(row.published),
    created_at: Number(row.created_at || 0),
    updated_at: Number(row.updated_at || 0),
  };
}

async function ensureSchema() {
  if (!pool || schemaReady) return schemaReady;
  schemaReady = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS journey_milestones (
        id TEXT PRIMARY KEY,
        month TEXT NOT NULL,
        milestone TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'flag',
        color TEXT NOT NULL DEFAULT 'primary',
        sort_order INTEGER NOT NULL DEFAULT 0,
        published BOOLEAN NOT NULL DEFAULT true,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS journey_public_idx
        ON journey_milestones (published, sort_order, created_at);
    `);

    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM journey_milestones');
    if (rows[0].count === 0) {
      const now = Math.floor(Date.now() / 1000);
      for (const item of memoryMilestones) {
        await pool.query(
          `INSERT INTO journey_milestones
           (id, month, milestone, description, icon, color, sort_order, published, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.month, item.milestone, item.description, item.icon, item.color,
            item.sortOrder, item.published, now]
        );
      }
    }
  })();
  return schemaReady;
}

async function allMilestones({ includeDrafts = false } = {}) {
  if (!pool) {
    const stored = readLocalMilestones();
    const source = stored === null ? memoryMilestones : stored;
    return source.filter(item => includeDrafts || item.published)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }
  await ensureSchema();
  const { rows } = await pool.query(
    includeDrafts
      ? 'SELECT * FROM journey_milestones ORDER BY sort_order ASC, created_at ASC'
      : 'SELECT * FROM journey_milestones WHERE published = true ORDER BY sort_order ASC, created_at ASC'
  );
  return rows.map(normalize);
}

function cleanPayload(input, existing = {}) {
  return {
    month: String(input.month ?? existing.month ?? '').trim().slice(0, 80),
    milestone: String(input.milestone ?? existing.milestone ?? '').trim().slice(0, 160),
    description: String(input.description ?? existing.description ?? '').trim().slice(0, 1200),
    icon: String(input.icon ?? existing.icon ?? 'flag').trim().slice(0, 60) || 'flag',
    color: ['primary', 'secondary', 'accent'].includes(input.color)
      ? input.color : (existing.color || 'primary'),
    sortOrder: Number.isFinite(Number(input.sortOrder))
      ? Math.max(0, Math.floor(Number(input.sortOrder))) : Number(existing.sortOrder || 0),
    published: input.published === undefined ? Boolean(existing.published ?? true) : Boolean(input.published),
  };
}

function validationError(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ error: errors.array()[0].msg });
  return true;
}

const validators = [
  body('month').trim().isLength({ min: 2, max: 80 }).withMessage('Date label must be 2–80 characters'),
  body('milestone').trim().isLength({ min: 3, max: 160 }).withMessage('Milestone title must be 3–160 characters'),
  body('description').trim().isLength({ min: 3, max: 1200 }).withMessage('Description must be 3–1200 characters'),
  body('icon').optional().trim().isLength({ min: 1, max: 60 }),
  body('color').optional().isIn(['primary', 'secondary', 'accent']),
  body('sortOrder').optional().isInt({ min: 0, max: 9999 }),
  body('published').optional().isBoolean(),
];

router.get('/admin', requireAuth, async (_req, res, next) => {
  try { res.json({ milestones: await allMilestones({ includeDrafts: true }) }); }
  catch (error) { next(error); }
});

router.get('/', async (_req, res, next) => {
  try { res.json({ milestones: await allMilestones() }); }
  catch (error) { next(error); }
});

router.post('/', requireAuth, validators, async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) {
      const item = cleanPayload(req.body);
      const now = Math.floor(Date.now() / 1000);
      const stored = readLocalMilestones();
      const items = stored === null ? [...memoryMilestones] : stored;
      const record = { ...item, id: uuidv4(), created_at: now, updated_at: now };
      items.push(record);
      writeLocalMilestones(items);
      return res.status(201).json({ milestone: record });
    }
    await ensureSchema();
    const item = cleanPayload(req.body);
    const now = Math.floor(Date.now() / 1000);
    const id = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO journey_milestones
       (id, month, milestone, description, icon, color, sort_order, published, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
      [id, item.month, item.milestone, item.description, item.icon, item.color,
        item.sortOrder, item.published, now]
    );
    res.status(201).json({ milestone: normalize(rows[0]) });
  } catch (error) { next(error); }
});

router.put('/:id', requireAuth, [
  param('id').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid milestone id'),
  ...validators,
], async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) {
      const stored = readLocalMilestones();
      const items = stored === null ? [...memoryMilestones] : stored;
      const index = items.findIndex(item => item.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Milestone not found' });
      const item = cleanPayload(req.body, items[index]);
      items[index] = { ...items[index], ...item, id: items[index].id, updated_at: Math.floor(Date.now() / 1000) };
      writeLocalMilestones(items);
      return res.json({ milestone: items[index] });
    }
    await ensureSchema();
    const { rows: existingRows } = await pool.query('SELECT * FROM journey_milestones WHERE id = $1', [req.params.id]);
    if (!existingRows[0]) return res.status(404).json({ error: 'Milestone not found' });
    const item = cleanPayload(req.body, normalize(existingRows[0]));
    const now = Math.floor(Date.now() / 1000);
    const { rows } = await pool.query(
      `UPDATE journey_milestones SET month=$2,milestone=$3,description=$4,icon=$5,color=$6,
       sort_order=$7,published=$8,updated_at=$9 WHERE id=$1 RETURNING *`,
      [req.params.id, item.month, item.milestone, item.description, item.icon, item.color,
        item.sortOrder, item.published, now]
    );
    res.json({ milestone: normalize(rows[0]) });
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, [
  param('id').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid milestone id'),
], async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) {
      const stored = readLocalMilestones();
      const items = stored === null ? [...memoryMilestones] : stored;
      const next = items.filter(item => item.id !== req.params.id);
      if (next.length === items.length) return res.status(404).json({ error: 'Milestone not found' });
      writeLocalMilestones(next);
      return res.json({ message: 'Milestone deleted' });
    }
    await ensureSchema();
    const { rowCount } = await pool.query('DELETE FROM journey_milestones WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Milestone not found' });
    res.json({ message: 'Milestone deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
