/**
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

// ── Init (ensure data dir exists on startup) ──────────────────────────────────
ensureDataDir();

module.exports = { admins, tokens, news };
