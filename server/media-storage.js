const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEDIA_DIR = path.join(__dirname, 'data', 'uploads', 'news');

function ensureMediaDir() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true, mode: 0o700 });
}

function extensionForMime(mime) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

function persistDataImage(value) {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return value;
  const match = value.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) return value;
  ensureMediaDir();
  const mime = match[1] === 'image/jpg' ? 'image/jpeg' : match[1];
  const bytes = Buffer.from(match[2].replace(/\s+/g, ''), 'base64');
  const digest = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 24);
  const filename = `${digest}.${extensionForMime(mime)}`;
  const target = path.join(MEDIA_DIR, filename);
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, bytes, { mode: 0o600 });
  }
  return `/api/media/news/${filename}`;
}

function persistArticleImages(article) {
  const next = { ...article };
  next.image = persistDataImage(next.image);
  if (Array.isArray(next.inline_images)) {
    next.inline_images = next.inline_images.map(item => ({
      ...item,
      src: persistDataImage(item?.src),
    }));
  }
  return next;
}

module.exports = { MEDIA_DIR, persistDataImage, persistArticleImages };
