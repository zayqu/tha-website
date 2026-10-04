const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const SECRET_FILE = path.join(DATA_DIR, 'runtime-secrets.json');

function loadOrCreate() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (fs.existsSync(SECRET_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(SECRET_FILE, 'utf8'));
      if (existing.jwtAccessSecret && existing.jwtRefreshSecret) {
        if (!existing.contentImportSecret) {
          existing.contentImportSecret = crypto.randomBytes(48).toString('hex');
          fs.writeFileSync(SECRET_FILE, JSON.stringify(existing), { mode: 0o600 });
          try { fs.chmodSync(SECRET_FILE, 0o600); } catch {}
        }
        return existing;
      }
    } catch {}
  }

  const created = {
    jwtAccessSecret: crypto.randomBytes(48).toString('hex'),
    jwtRefreshSecret: crypto.randomBytes(48).toString('hex'),
    contentImportSecret: crypto.randomBytes(48).toString('hex'),
  };

  fs.writeFileSync(SECRET_FILE, JSON.stringify(created), { mode: 0o600 });
  try { fs.chmodSync(SECRET_FILE, 0o600); } catch {}
  return created;
}

const secrets = loadOrCreate();

module.exports = {
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || secrets.jwtAccessSecret,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || secrets.jwtRefreshSecret,
  contentImportSecret: process.env.CONTENT_IMPORT_SECRET || secrets.contentImportSecret,
};
