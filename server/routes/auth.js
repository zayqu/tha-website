const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const { admins, tokens } = require('../db');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');
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

async function issueRefreshToken(adminId) {
  const raw = crypto.randomBytes(64).toString('hex');
  const expiresSec = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  await tokens.create({ id: uuidv4(), adminId, tokenHash: hashToken(raw), expiresAt: expiresSec });
  return { raw, expiresSec };
}

function setRefreshCookie(res, raw, expiresSec) {
  res.cookie('rt', raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    path: '/api/auth',
    expires: new Date(expiresSec * 1000),
  });
}


// ── POST /api/auth/register ───────────────────────────────────────────────────
// Creates a pending editor account. A super administrator must approve it.
router.post(
  '/register',
  loginLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 12, max: 128 })
      .withMessage('Password must be between 12 and 128 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const identifier = req.body.email.toLowerCase();
      if (await admins.exists(identifier)) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      await admins.create({
        id: uuidv4(),
        identifier,
        password: await bcrypt.hash(req.body.password, 12),
        name: req.body.name.trim(),
        role: 'editor',
        status: 'pending',
      });

      return res.status(201).json({
        message: 'Registration received. An administrator must approve your account before you can sign in.',
        status: 'pending',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  loginLimiter,
  [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required').isLength({ max: 100 }),
    body('password').notEmpty().withMessage('Password is required').isLength({ max: 128 }),
  ],
  async (req, res, next) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { identifier, password } = req.body;
    const normalized = identifier.includes('@')
      ? identifier.toLowerCase()
      : identifier.replace(/\s+/g, '');

    const admin = await admins.findByIdentifier(normalized);

    // Always run bcrypt to prevent timing-based user enumeration
    const hash = admin
      ? admin.password
      : '$2a$12$invalidsaltinvalidsaltinvalidXXXXXXXXXXXXXXXXXXXXXXXX';
    const match = await bcrypt.compare(password, hash);

    if (!admin || !match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (admin.status && admin.status !== 'approved') {
      const message = admin.status === 'pending'
        ? 'Your account is awaiting administrator approval.'
        : 'Your account has not been approved.';
      return res.status(403).json({ error: message, code: 'ACCOUNT_NOT_APPROVED' });
    }

    await admins.updateLastLogin(admin.id);
    await tokens.prune(); // clean up expired tokens periodically

    const accessToken = issueAccessToken(admin);
    const { raw, expiresSec } = await issueRefreshToken(admin.id);
    setRefreshCookie(res, raw, expiresSec);

    res.json({
      accessToken,
      admin: { id: admin.id, name: admin.name, identifier: admin.identifier, role: admin.role },
    });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post('/refresh', async (req, res, next) => {
  try {
  const raw = req.cookies?.rt;
  if (!raw) return res.status(401).json({ error: 'No refresh token' });

  const stored = await tokens.findValid(hashToken(raw));
  if (!stored) {
    res.clearCookie('rt', { path: '/api/auth' });
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  // Rotate: revoke old, issue new
  await tokens.revoke(stored.id);

  const admin = { id: stored.admin_id, identifier: stored.identifier, role: stored.role };
  const accessToken = issueAccessToken(admin);
  const { raw: newRaw, expiresSec } = await issueRefreshToken(admin.id);
  setRefreshCookie(res, newRaw, expiresSec);

  res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
  const raw = req.cookies?.rt;
  if (raw) await tokens.revokeByHash(hashToken(raw));
  res.clearCookie('rt', { path: '/api/auth' });
  res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
});

// ── Administrator approval workflow ──────────────────────────────────────────
router.get('/accounts/pending', requireAuth, requireSuperAdmin, async (_req, res, next) => {
  try {
    res.json({ accounts: await admins.listPending() });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/accounts/:id/status',
  requireAuth,
  requireSuperAdmin,
  [param('id').isUUID(), body('status').isIn(['approved', 'rejected'])],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (req.admin.id === req.params.id) {
        return res.status(400).json({ error: 'You cannot change your own approval status' });
      }
      const account = await admins.setStatus(req.params.id, req.body.status);
      if (!account) return res.status(404).json({ error: 'Account not found' });
      res.json({ account });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res, next) => {
  try {
  const admin = await admins.findById(req.admin.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  res.json({ admin: { id: admin.id, name: admin.name, identifier: admin.identifier, role: admin.role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
