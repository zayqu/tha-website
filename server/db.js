/*
 * db.js – Pure JavaScript JSON file store (no native compilation needed).
 *
 * Three files under server/data/:
 *   admins.json       – admin accounts
 *   tokens.json       – refresh tokens
 *   news.json         – news articles
 *
 * Writes are atomic: data is written to a .tmp file, then renamed over the
 * target so a crash during write can't leave a corrupted file.
 */
const fs   = require('fs');
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');

// ── File helpers ──────────────────────────────────────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read(name) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return { items: [] };
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return { items: [] };
  }
}

function write(name, data) {
  ensureDataDir();
  const fp  = filePath(name);
  const tmp = `${fp}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, fp);   // atomic on same drive
}

function getItems(name) {
  return read(name).items || [];
}

function setItems(name, items) {
  write(name, { items });
}

// ── Admins ────────────────────────────────────────────────────────────────────
const admins = {
  findById(id) {
    return getItems('admins').find(a => a.id === id) || null;
  },
  findByIdentifier(identifier) {
    return getItems('admins').find(a => a.identifier === identifier) || null;
  },
  create({ id, identifier, password, name, role = 'editor' }) {
    const items = getItems('admins');
    const record = { id, identifier, password, name, role,
                     created_at: Math.floor(Date.now() / 1000), last_login: null };
    items.push(record);
    setItems('admins', items);
    return record;
  },
  updateLastLogin(id) {
    const items = getItems('admins');
    const idx = items.findIndex(a => a.id === id);
    if (idx !== -1) {
      items[idx].last_login = Math.floor(Date.now() / 1000);
      setItems('admins', items);
    }
  },
  exists(identifier) {
    return getItems('admins').some(a => a.identifier === identifier);
  },
};

// ── Refresh tokens ────────────────────────────────────────────────────────────
const tokens = {
  create({ id, adminId, tokenHash, expiresAt }) {
    const items = getItems('tokens');
    const record = { id, admin_id: adminId, token_hash: tokenHash,
                     expires_at: expiresAt, created_at: Math.floor(Date.now() / 1000),
                     revoked: false };
    items.push(record);
    setItems('tokens', items);
    return record;
  },
  findValid(tokenHash) {
    const now = Math.floor(Date.now() / 1000);
    const token = getItems('tokens').find(
      t => t.token_hash === tokenHash && !t.revoked && t.expires_at > now
    );
    if (!token) return null;
    const admin = admins.findById(token.admin_id);
    if (!admin) return null;
    return { ...token, identifier: admin.identifier, role: admin.role };
  },
  revoke(id) {
    const items = getItems('tokens');
    const idx = items.findIndex(t => t.id === id);
    if (idx !== -1) { items[idx].revoked = true; setItems('tokens', items); }
  },
  revokeByHash(tokenHash) {
    const items = getItems('tokens');
    let changed = false;
    items.forEach(t => { if (t.token_hash === tokenHash) { t.revoked = true; changed = true; } });
    if (changed) setItems('tokens', items);
  },
  // Clean up expired/revoked tokens to keep the file small
  prune() {
    const now = Math.floor(Date.now() / 1000);
    const items = getItems('tokens').filter(t => !t.revoked && t.expires_at > now);
    setItems('tokens', items);
  },
};

// ── News ──────────────────────────────────────────────────────────────────────
const news = {
  findAll() {
    return getItems('news').sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  },
  findPublished({ category, limit = 50, offset = 0 } = {}) {
    let items = getItems('news').filter(n => n.published);
    if (category) items = items.filter(n => n.category === category);
    items.sort((a, b) => (b.date > a.date ? 1 : -1));
    return items.slice(offset, offset + limit);
  },
  findBySlug(slug) {
    return getItems('news').find(n => n.slug === slug && n.published) || null;
  },
  findById(id) {
    return getItems('news').find(n => n.id === id) || null;
  },
  slugExists(slug, excludeId = null) {
    return getItems('news').some(n => n.slug === slug && n.id !== excludeId);
  },
  create(article) {
    const items = getItems('news');
    const now = Math.floor(Date.now() / 1000);
    const record = { ...article, created_at: now, updated_at: now };
    items.push(record);
    setItems('news', items);
    return record;
  },
  update(id, fields) {
    const items = getItems('news');
    const idx = items.findIndex(n => n.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...fields, id, updated_at: Math.floor(Date.now() / 1000) };
    setItems('news', items);
    return items[idx];
  },
  delete(id) {
    const items = getItems('news').filter(n => n.id !== id);
    setItems('news', items);
  },
};

// ── Init ─────────────────────────────────────────────────────────────────────
// Vercel functions have a read-only application filesystem. Only initialize the
// JSON fallback locally when PostgreSQL has not been configured.
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
if (!hasDatabaseUrl && !process.env.VERCEL) ensureDataDir();

let pool = null;
let schemaReady = null;

if (hasDatabaseUrl) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
  });
}

async function ensureSchema() {
  if (!pool) return;
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        identifier TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        created_at INTEGER NOT NULL,
        last_login INTEGER
      );

      CREATE TABLE IF NOT EXISTS tokens (
        id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        revoked BOOLEAN NOT NULL DEFAULT false
      );

      CREATE INDEX IF NOT EXISTS tokens_hash_idx ON tokens(token_hash);

      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        published BOOLEAN NOT NULL DEFAULT false,
        views INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      ALTER TABLE news ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;
    `);
  }
  await schemaReady;
}

function normalizeNews(row) {
  if (!row) return null;
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : [],
    is_featured: Boolean(row.is_featured),
    published: Boolean(row.published),
    views: Number(row.views || 0),
  };
}

const dbAdmins = {
  async findById(id) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
      return rows[0] || null;
    }
    return admins.findById(id);
  },

  async findByIdentifier(identifier) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query('SELECT * FROM admins WHERE identifier = $1', [identifier]);
      return rows[0] || null;
    }
    return admins.findByIdentifier(identifier);
  },

  async create({ id, identifier, password, name, role = 'editor' }) {
    const now = Math.floor(Date.now() / 1000);
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        `INSERT INTO admins (id, identifier, password, name, role, created_at, last_login)
         VALUES ($1, $2, $3, $4, $5, $6, NULL)
         RETURNING *`,
        [id, identifier, password, name, role, now]
      );
      return rows[0];
    }
    return admins.create({ id, identifier, password, name, role });
  },

  async updateLastLogin(id) {
    if (pool) {
      await ensureSchema();
      await pool.query('UPDATE admins SET last_login = $2 WHERE id = $1', [id, Math.floor(Date.now() / 1000)]);
      return;
    }
    admins.updateLastLogin(id);
  },

  async exists(identifier) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query('SELECT 1 FROM admins WHERE identifier = $1 LIMIT 1', [identifier]);
      return rows.length > 0;
    }
    return admins.exists(identifier);
  },
};

const dbTokens = {
  async create({ id, adminId, tokenHash, expiresAt }) {
    const now = Math.floor(Date.now() / 1000);
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        `INSERT INTO tokens (id, admin_id, token_hash, expires_at, created_at, revoked)
         VALUES ($1, $2, $3, $4, $5, false)
         RETURNING *`,
        [id, adminId, tokenHash, expiresAt, now]
      );
      return rows[0];
    }
    return tokens.create({ id, adminId, tokenHash, expiresAt });
  },

  async findValid(tokenHash) {
    const now = Math.floor(Date.now() / 1000);
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        `SELECT t.*, a.identifier, a.role
         FROM tokens t
         JOIN admins a ON a.id = t.admin_id
         WHERE t.token_hash = $1 AND t.revoked = false AND t.expires_at > $2
         LIMIT 1`,
        [tokenHash, now]
      );
      return rows[0] || null;
    }
    return tokens.findValid(tokenHash);
  },

  async revoke(id) {
    if (pool) {
      await ensureSchema();
      await pool.query('UPDATE tokens SET revoked = true WHERE id = $1', [id]);
      return;
    }
    tokens.revoke(id);
  },

  async revokeByHash(tokenHash) {
    if (pool) {
      await ensureSchema();
      await pool.query('UPDATE tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
      return;
    }
    tokens.revokeByHash(tokenHash);
  },

  async prune() {
    const now = Math.floor(Date.now() / 1000);
    if (pool) {
      await ensureSchema();
      await pool.query('DELETE FROM tokens WHERE revoked = true OR expires_at <= $1', [now]);
      return;
    }
    tokens.prune();
  },
};

const dbNews = {
  async findAll() {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
      return rows.map(normalizeNews);
    }
    return news.findAll().map(normalizeNews);
  },

  async findPublished({ category, limit = 50, offset = 0 } = {}) {
    if (pool) {
      await ensureSchema();
      const values = [limit, offset];
      let where = 'WHERE published = true';
      if (category) {
        values.unshift(category);
        where += ' AND category = $1';
      }
      const limitIndex = category ? 2 : 1;
      const offsetIndex = category ? 3 : 2;
      const { rows } = await pool.query(
        `SELECT * FROM news ${where}
         ORDER BY date DESC, created_at DESC
         LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
        values
      );
      return rows.map(normalizeNews);
    }
    return news.findPublished({ category, limit, offset }).map(normalizeNews);
  },

  async findBySlug(slug, { incrementViews = false } = {}) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        incrementViews
          ? 'UPDATE news SET views = views + 1 WHERE slug = $1 AND published = true RETURNING *'
          : 'SELECT * FROM news WHERE slug = $1 AND published = true LIMIT 1',
        [slug]
      );
      return normalizeNews(rows[0]);
    }
    const items = getItems('news');
    const idx = items.findIndex(n => n.slug === slug && n.published);
    if (idx === -1) return null;
    if (incrementViews) {
      items[idx].views = Number(items[idx].views || 0) + 1;
      setItems('news', items);
    }
    return normalizeNews(items[idx]);
  },

  async findById(id) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query('SELECT * FROM news WHERE id = $1 LIMIT 1', [id]);
      return normalizeNews(rows[0]);
    }
    return normalizeNews(news.findById(id));
  },

  async slugExists(slug, excludeId = null) {
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        excludeId
          ? 'SELECT 1 FROM news WHERE slug = $1 AND id <> $2 LIMIT 1'
          : 'SELECT 1 FROM news WHERE slug = $1 LIMIT 1',
        excludeId ? [slug, excludeId] : [slug]
      );
      return rows.length > 0;
    }
    return news.slugExists(slug, excludeId);
  },

  async create(article) {
    const now = Math.floor(Date.now() / 1000);
    const record = { ...article, views: Number(article.views || 0), created_at: now, updated_at: now };
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        `INSERT INTO news
         (id, slug, title, excerpt, content, image, category, author, date, tags, is_featured, published, views, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          record.id, record.slug, record.title, record.excerpt, record.content, record.image,
          record.category, record.author, record.date, JSON.stringify(record.tags || []),
          record.is_featured, record.published, record.views, record.created_at, record.updated_at,
        ]
      );
      return normalizeNews(rows[0]);
    }
    return normalizeNews(news.create(record));
  },

  async update(id, fields) {
    const now = Math.floor(Date.now() / 1000);
    if (pool) {
      await ensureSchema();
      const { rows } = await pool.query(
        `UPDATE news SET
           slug = $2, title = $3, excerpt = $4, content = $5, image = $6,
           category = $7, author = $8, date = $9, tags = $10::jsonb,
           is_featured = $11, published = $12, updated_at = $13
         WHERE id = $1
         RETURNING *`,
        [
          id, fields.slug, fields.title, fields.excerpt, fields.content, fields.image,
          fields.category, fields.author, fields.date, JSON.stringify(fields.tags || []),
          fields.is_featured, fields.published, now,
        ]
      );
      return normalizeNews(rows[0]);
    }
    return normalizeNews(news.update(id, fields));
  },

  async delete(id) {
    if (pool) {
      await ensureSchema();
      await pool.query('DELETE FROM news WHERE id = $1', [id]);
      return;
    }
    news.delete(id);
  },
};

module.exports = { admins: dbAdmins, tokens: dbTokens, news: dbNews };
