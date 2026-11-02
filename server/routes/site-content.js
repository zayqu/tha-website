const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/auth');
const defaults = require('../../src/data/siteContentDefaults.json');

const router = express.Router();
const CONTENT_FILE = path.join(__dirname, '../data/site-content.json');
const DOCUMENT_DIR = path.join(__dirname, '../data/uploads/documents');
const SITE_MEDIA_DIR = path.join(__dirname, '../data/uploads/site');
const MAX_DOCUMENT_BYTES = 6 * 1024 * 1024;
const ALLOWED_SITE_IMAGES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const ALLOWED_DOCUMENTS = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
};

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

router.post('/media/upload', requireAuth, (req, res, next) => {
  try {
    const { dataUrl, fileName } = req.body || {};
    const match = String(dataUrl || '').match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return res.status(400).json({ error: 'Invalid image upload' });

    const mime = match[1].toLowerCase();
    const ext = ALLOWED_SITE_IMAGES[mime];
    if (!ext) return res.status(400).json({ error: 'Use JPG, PNG, or WebP images' });

    const bytes = Buffer.from(match[2], 'base64');
    if (!bytes.length || bytes.length > 4 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image must be 4 MB or smaller' });
    }

    fs.mkdirSync(SITE_MEDIA_DIR, { recursive: true });
    const baseName = path.basename(String(fileName || 'image'), path.extname(String(fileName || 'image')))
      .replace(/[^a-z0-9_-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image';
    const storedName = `${Date.now()}-${uuidv4().slice(0, 8)}-${baseName}${ext}`;
    fs.writeFileSync(path.join(SITE_MEDIA_DIR, storedName), bytes);
    res.status(201).json({
      url: `/api/media/site/${storedName}`,
      fileName: path.basename(String(fileName || storedName)),
      size: bytes.length,
      mime,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/documents/upload', requireAuth, (req, res, next) => {
  try {
    const { dataUrl, fileName } = req.body || {};
    const match = String(dataUrl || '').match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return res.status(400).json({ error: 'Invalid document upload' });

    const mime = match[1].toLowerCase();
    const ext = ALLOWED_DOCUMENTS[mime];
    if (!ext) return res.status(400).json({ error: 'Unsupported document type' });

    const bytes = Buffer.from(match[2], 'base64');
    if (!bytes.length || bytes.length > MAX_DOCUMENT_BYTES) {
      return res.status(400).json({ error: 'Document must be 6 MB or smaller' });
    }

    fs.mkdirSync(DOCUMENT_DIR, { recursive: true });
    const baseName = path.basename(String(fileName || 'document'), path.extname(String(fileName || 'document')))
      .replace(/[^a-z0-9_-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'document';
    const storedName = `${Date.now()}-${uuidv4().slice(0, 8)}-${baseName}${ext}`;
    fs.writeFileSync(path.join(DOCUMENT_DIR, storedName), bytes);
    res.status(201).json({
      url: `/api/media/documents/${storedName}`,
      fileName: path.basename(String(fileName || storedName)),
      size: bytes.length,
      mime,
    });
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
router.DOCUMENT_DIR = DOCUMENT_DIR;
router.SITE_MEDIA_DIR = SITE_MEDIA_DIR;

module.exports = router;
