const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
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

module.exports = { requireAuth, requireSuperAdmin };
