const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/auth');
const defaults = require('../../src/data/siteContentDefaults.json');

const router = express.Router();
const CONTENT_FILE = path.join(__dirname, '../data/site-content.json');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (!base || typeof base !== 'object') return override === undefined ? base : override;
  const out = { ...base };
  if (!override || typeof override !== 'object' || Array.isArray(override)) return out;
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      out[key] = mergeDeep(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function readContent() {
  try {
    if (!fs.existsSync(CONTENT_FILE)) return clone(defaults);
    const parsed = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    return mergeDeep(clone(defaults), parsed);
  } catch {
    return clone(defaults);
  }
}

function writeContent(content) {
  const dir = path.dirname(CONTENT_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = CONTENT_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(content, null, 2));
  fs.renameSync(tmp, CONTENT_FILE);
}

function cleanString(value, fallback = '', max = 5000) {
  const text = String(value ?? fallback).trim();
  return text.slice(0, max);
}

function cleanObject(input = {}, existing = {}) {
  const out = { ...existing };
  for (const [key, value] of Object.entries(input || {})) {
    if (Array.isArray(value)) {
      out[key] = value;
    } else if (value && typeof value === 'object') {
      out[key] = cleanObject(value, existing[key] || {});
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      out[key] = value;
    }
  }
  return out;
}

function cleanDocuments(items = []) {
  return items.slice(0, 200).map((item, index) => ({
    id: cleanString(item.id || uuidv4(), uuidv4(), 100),
    category: cleanString(item.category, 'Documents', 120),
    title: cleanString(item.title, 'Untitled document', 180),
    meta: cleanString(item.meta, '', 200),
    description: cleanString(item.description, '', 1200),
    status: cleanString(item.status, '', 120),
    action: cleanString(item.action, 'View', 80),
    url: cleanString(item.url, '', 1000),
    external: Boolean(item.external),
    published: item.published !== false,
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : (index + 1) * 10,
  }));
}

router.get('/', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json({ content: readContent() });
});

router.get('/admin', requireAuth, (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ content: readContent() });
});

router.put('/', requireAuth, (req, res, next) => {
  try {
    const existing = readContent();
    const next = cleanObject(req.body?.content || {}, existing);
    next.documents = cleanDocuments(req.body?.content?.documents ?? existing.documents ?? []);
    next.updatedAt = Math.floor(Date.now() / 1000);
    next.updatedBy = req.admin?.identifier || req.admin?.id || 'admin';
    writeContent(next);
    res.json({ content: next });
  } catch (error) {
    next(error);
  }
});

router.post('/documents', requireAuth, (req, res, next) => {
  try {
    const content = readContent();
    const documents = Array.isArray(content.documents) ? [...content.documents] : [];
    const [document] = cleanDocuments([{ ...req.body, id: req.body?.id || uuidv4() }]);
    documents.push(document);
    content.documents = documents;
    content.updatedAt = Math.floor(Date.now() / 1000);
    content.updatedBy = req.admin?.identifier || req.admin?.id || 'admin';
    writeContent(content);
    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
});

router.put('/documents/:id', requireAuth, (req, res, next) => {
  try {
    const content = readContent();
    const documents = Array.isArray(content.documents) ? [...content.documents] : [];
    const index = documents.findIndex(item => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Document not found' });
    const [updated] = cleanDocuments([{ ...documents[index], ...req.body, id: documents[index].id }]);
    documents[index] = updated;
    content.documents = documents;
    content.updatedAt = Math.floor(Date.now() / 1000);
    content.updatedBy = req.admin?.identifier || req.admin?.id || 'admin';
    writeContent(content);
    res.json({ document: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/documents/:id', requireAuth, (req, res, next) => {
  try {
    const content = readContent();
    const documents = Array.isArray(content.documents) ? content.documents : [];
    const nextDocuments = documents.filter(item => item.id !== req.params.id);
    if (nextDocuments.length === documents.length) return res.status(404).json({ error: 'Document not found' });
    content.documents = nextDocuments;
    content.updatedAt = Math.floor(Date.now() / 1000);
    content.updatedBy = req.admin?.identifier || req.admin?.id || 'admin';
    writeContent(content);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
});

router.readContent = readContent;
router.writeContent = writeContent;

module.exports = router;
