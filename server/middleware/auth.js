const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
require('dotenv').config();
const { jwtAccessSecret, contentImportSecret } = require('../runtime-secrets');

/**
 * Verifies the Bearer access token in the Authorization header.
 * Attaches { id, identifier, role } to req.admin on success.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, jwtAccessSecret);
    req.admin = { id: payload.sub, identifier: payload.identifier, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

/**
 * Restricts access to admins with role === 'superadmin'.
 * Must be used after requireAuth.
 */
function requireSuperAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
}

function requireEditorialImport(req, res, next) {
  const expected = Buffer.from(process.env.CONTENT_IMPORT_SECRET || contentImportSecret || '');
  const supplied = Buffer.from(req.get('authorization')?.match(/^Bearer (.+)$/)?.[1] || '');
  if (expected.length && expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied)) {
    return next();
  }
  return requireAuth(req, res, next);
}

module.exports = { requireAuth, requireSuperAdmin, requireEditorialImport };
