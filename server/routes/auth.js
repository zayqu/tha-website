const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { admins, tokens } = require('../db');
const { requireAuth } = require('../middleware/auth');
require('dotenv').config();

// ── Rate limiter: 5 attempts per 15 min per IP ────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function issueAccessToken(admin) {
  return jwt.sign(
    { sub: admin.id, identifier: admin.identifier, role: admin.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
}

function issueRefreshToken(adminId) {
  const raw = crypto.randomBytes(64).toString('hex');
  const expiresSec = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  tokens.create({ id: uuidv4(), adminId, tokenHash: hashToken(raw), expiresAt: expiresSec });
  return { raw, expiresSec };
}

function setRefreshCookie(res, raw, expiresSec) {
  res.cookie('rt', raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/api/auth',
    expires: new Date(expiresSec * 1000),
  });
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  loginLimiter,
  [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required').isLength({ max: 100 }),
    body('password').notEmpty().withMessage('Password is required').isLength({ max: 128 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { identifier, password } = req.body;
    const normalized = identifier.includes('@')
      ? identifier.toLowerCase()
      : identifier.replace(/\s+/g, '');

    const admin = admins.findByIdentifier(normalized);

    // Always run bcrypt to prevent timing-based user enumeration
    const hash = admin
      ? admin.password
      : '$2a$12$invalidsaltinvalidsaltinvalidXXXXXXXXXXXXXXXXXXXXXXXX';
    const match = await bcrypt.compare(password, hash);

    if (!admin || !match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    admins.updateLastLogin(admin.id);
    tokens.prune(); // clean up expired tokens periodically

    const accessToken = issueAccessToken(admin);
    const { raw, expiresSec } = issueRefreshToken(admin.id);
    setRefreshCookie(res, raw, expiresSec);

    res.json({
      accessToken,
      admin: { id: admin.id, name: admin.name, identifier: admin.identifier, role: admin.role },
    });
  }
);

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post('/refresh', (req, res) => {
  const raw = req.cookies?.rt;
  if (!raw) return res.status(401).json({ error: 'No refresh token' });

  const stored = tokens.findValid(hashToken(raw));
  if (!stored) {
    res.clearCookie('rt', { path: '/api/auth' });
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  // Rotate: revoke old, issue new
  tokens.revoke(stored.id);

  const admin = { id: stored.admin_id, identifier: stored.identifier, role: stored.role };
  const accessToken = issueAccessToken(admin);
  const { raw: newRaw, expiresSec } = issueRefreshToken(admin.id);
  setRefreshCookie(res, newRaw, expiresSec);

  res.json({ accessToken });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', requireAuth, (req, res) => {
  const raw = req.cookies?.rt;
  if (raw) tokens.revokeByHash(hashToken(raw));
  res.clearCookie('rt', { path: '/api/auth' });
  res.json({ message: 'Logged out' });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const admin = admins.findById(req.admin.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  res.json({ admin: { id: admin.id, name: admin.name, identifier: admin.identifier, role: admin.role } });
});

module.exports = router;
