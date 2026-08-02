require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const projectRoutes = require('./routes/projects');
const { admins } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://tha-red.vercel.app,https://tzhealthalliance.or.tz,https://www.tzhealthalliance.or.tz')
  .split(',').map(origin => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const isConfigured = allowedOrigins.includes(origin);
    const isThaPreview = /^https:\/\/tha(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);
    if (isConfigured || isThaPreview) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: false, limit: '3mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
}));

let adminProvisioning;
async function provisionInitialAdmin() {
  if (adminProvisioning) return adminProvisioning;
  adminProvisioning = (async () => {
    const identifier = process.env.ADMIN_IDENTIFIER?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!identifier || !password) return;
    if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');
    const normalized = identifier.includes('@') ? identifier.toLowerCase() : identifier;
    const passwordResetVersion = process.env.ADMIN_PASSWORD_RESET_VERSION?.trim() || null;
    const existing = await admins.findByIdentifier(normalized);

    if (existing) {
      if (!passwordResetVersion || existing.password_reset_version === passwordResetVersion) return;
      await admins.resetPassword(
        normalized,
        await bcrypt.hash(password, 12),
        passwordResetVersion
      );
      console.log('THA administrator password reset applied and existing sessions revoked.');
      return;
    }

    await admins.create({
      id: uuidv4(),
      identifier: normalized,
      password: await bcrypt.hash(password, 12),
      name: process.env.ADMIN_NAME || 'THA Administrator',
      role: 'superadmin',
      status: 'approved',
      passwordResetVersion,
    });
    console.log('Initial THA administrator provisioned.');
  })();
  return adminProvisioning;
}

app.use(async (_req, _res, next) => {
  try {
    await provisionInitialAdmin();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'THA Content API',
    storage: process.env.DATABASE_URL ? 'postgresql' : 'ephemeral',
    configured: {
      database: Boolean(process.env.DATABASE_URL),
      administrator: Boolean(process.env.ADMIN_IDENTIFIER && process.env.ADMIN_PASSWORD),
      authentication: Boolean(process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET),
    },
    time: new Date().toISOString(),
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  if (err.message?.startsWith('CORS:')) return res.status(403).json({ error: err.message });
  console.error(err);
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`THA Content API running on port ${PORT}`));
}

module.exports = app;
