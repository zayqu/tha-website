const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/auth');
const legacyCampaigns = require('../../src/data/campaigns.json');

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

const memoryProjects = (legacyCampaigns.campaigns || []).map(project => ({
  ...project,
  slug: project.id,
  category: project.subtitle || 'Community Health',
  published: true,
  status: 'active',
  created_at: 0,
  updated_at: 0,
}));

function normalize(row) {
  if (!row) return null;
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  return {
    ...data,
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    published: Boolean(row.published),
    status: row.status || 'active',
    metrics: row.metrics && typeof row.metrics === 'object' ? row.metrics : (data.metrics || {}),
    created_at: Number(row.created_at || 0),
    updated_at: Number(row.updated_at || 0),
  };
}

async function ensureSchema() {
  if (!pool || schemaReady) return schemaReady;
  schemaReady = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        published BOOLEAN NOT NULL DEFAULT false,
        status TEXT NOT NULL DEFAULT 'active',
        metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS projects_public_idx
        ON projects (published, status, updated_at DESC);
    `);

    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM projects');
    if (rows[0].count === 0) {
      const now = Math.floor(Date.now() / 1000);
      for (const project of memoryProjects) {
        const { id, slug, name, category, published, status, metrics, created_at, updated_at, ...data } = project;
        await pool.query(
          `INSERT INTO projects
           (id, slug, name, category, published, status, metrics, data, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10)
           ON CONFLICT (id) DO NOTHING`,
          [id, slug, name, category, published, status, JSON.stringify(metrics || {}),
            JSON.stringify(data), created_at || now, updated_at || now]
        );
      }
    }
  })();
  return schemaReady;
}

async function allProjects({ includeDrafts = false } = {}) {
  if (!pool) return memoryProjects.filter(project => includeDrafts || project.published);
  await ensureSchema();
  const { rows } = await pool.query(
    includeDrafts
      ? 'SELECT * FROM projects ORDER BY updated_at DESC'
      : "SELECT * FROM projects WHERE published = true AND status <> 'archived' ORDER BY updated_at DESC"
  );
  return rows.map(normalize);
}

async function findProject(identifier, includeDrafts = false) {
  if (!pool) {
    return memoryProjects.find(project =>
      (project.id === identifier || project.slug === identifier) &&
      (includeDrafts || project.published)
    ) || null;
  }
  await ensureSchema();
  const values = [identifier];
  const visibility = includeDrafts ? '' : "AND published = true AND status <> 'archived'";
  const { rows } = await pool.query(
    `SELECT * FROM projects WHERE (id = $1 OR slug = $1) ${visibility} LIMIT 1`,
    values
  );
  return normalize(rows[0]);
}

function slugify(value) {
  return String(value || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function cleanPayload(input, existing = {}) {
  const name = String(input.name || existing.name || '').trim().slice(0, 160);
  const slug = slugify(input.slug || name);
  const metrics = input.metrics && typeof input.metrics === 'object' && !Array.isArray(input.metrics)
    ? Object.fromEntries(Object.entries(input.metrics)
      .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) >= 0)
      .map(([key, value]) => [String(key).slice(0, 60), Number(value)]))
    : (existing.metrics || {});

  return {
    ...existing,
    ...input,
    name,
    slug,
    category: String(input.category || existing.category || 'Community Health').trim().slice(0, 100),
    published: Boolean(input.published),
    status: ['active', 'completed', 'planned', 'archived'].includes(input.status)
      ? input.status : (existing.status || 'active'),
    metrics,
  };
}

function validationError(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ error: errors.array()[0].msg });
  return true;
}

const validators = [
  body('name').trim().isLength({ min: 3, max: 160 }).withMessage('Project name must be 3–160 characters'),
  body('category').optional().trim().isLength({ min: 2, max: 100 }),
  body('published').optional().isBoolean(),
  body('status').optional().isIn(['active', 'completed', 'planned', 'archived']),
];

router.get('/impact', async (_req, res, next) => {
  try {
    const projects = await allProjects();
    const totals = {};
    for (const project of projects) {
      for (const [key, value] of Object.entries(project.metrics || {})) {
        const amount = Number(value);
        if (Number.isFinite(amount)) totals[key] = (totals[key] || 0) + amount;
      }
    }
    res.json({ totals, projectCount: projects.length });
  } catch (error) { next(error); }
});

router.get('/admin', requireAuth, async (_req, res, next) => {
  try { res.json({ projects: await allProjects({ includeDrafts: true }) }); }
  catch (error) { next(error); }
});

router.get('/', async (_req, res, next) => {
  try { res.json({ projects: await allProjects() }); }
  catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const project = await findProject(req.params.slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, validators, async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) return res.status(503).json({ error: 'Project editing requires PostgreSQL' });
    await ensureSchema();
    const project = cleanPayload(req.body);
    const now = Math.floor(Date.now() / 1000);
    const id = uuidv4();
    const { name, slug, category, published, status, metrics, ...data } = project;
    const { rows } = await pool.query(
      `INSERT INTO projects
       (id, slug, name, category, published, status, metrics, data, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$9) RETURNING *`,
      [id, slug, name, category, published, status, JSON.stringify(metrics), JSON.stringify(data), now]
    );
    res.status(201).json({ project: normalize(rows[0]) });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A project with this name or URL already exists' });
    next(error);
  }
});

router.put('/:id', requireAuth, [param('id').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid project id'), ...validators], async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) return res.status(503).json({ error: 'Project editing requires PostgreSQL' });
    const existing = await findProject(req.params.id, true);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    const project = cleanPayload(req.body, existing);
    const now = Math.floor(Date.now() / 1000);
    const { name, slug, category, published, status, metrics, id, created_at, updated_at, ...data } = project;
    const { rows } = await pool.query(
      `UPDATE projects SET slug=$2,name=$3,category=$4,published=$5,status=$6,
       metrics=$7::jsonb,data=$8::jsonb,updated_at=$9 WHERE id=$1 RETURNING *`,
      [req.params.id, slug, name, category, published, status,
        JSON.stringify(metrics), JSON.stringify(data), now]
    );
    res.json({ project: normalize(rows[0]) });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A project with this name or URL already exists' });
    next(error);
  }
});

router.delete('/:id', requireAuth, [param('id').trim().isLength({ min: 1, max: 100 }).withMessage('Invalid project id')], async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    if (!pool) return res.status(503).json({ error: 'Project editing requires PostgreSQL' });
    await ensureSchema();
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
