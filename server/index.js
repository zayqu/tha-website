require('dotenv').config();
const express = require('express');
const path = require('path');
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
const journeyRoutes = require('./routes/journey');
const { admins, news } = require('./db');
const { MEDIA_DIR } = require('./media-storage');
const { jwtAccessSecret, jwtRefreshSecret } = require('./runtime-secrets');
const { renderHtml, renderSitemap, renderPublicPage, renderLlmsTxt } = require('./seo-render');

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

app.use('/admin', (_req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
});

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
  try {
    return await adminProvisioning;
  } catch (error) {
    // Neon can occasionally time out while a serverless instance is warming.
    // Do not retain a rejected promise: the next request should be able to
    // retry administrator provisioning without requiring a redeployment.
    adminProvisioning = null;
    throw error;
  }
}

app.use(async (_req, _res, next) => {
  try {
    await provisionInitialAdmin();
  } catch (error) {
    // Provisioning is idempotent and is not required to serve public content.
    // A temporary database delay must not take News, Campaigns, Journey, or
    // the health endpoint offline. Authentication still performs its own
    // database checks and provisioning will retry on the next request.
    console.warn('Administrator provisioning temporarily unavailable; retrying on the next request.', error.message);
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/media/news', express.static(MEDIA_DIR, { maxAge: '30d', immutable: true }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'THA Content API',
    storage: process.env.DATABASE_URL ? 'postgresql' : 'local-json',
    configured: {
      database: Boolean(process.env.DATABASE_URL),
      administrator: Boolean(process.env.ADMIN_IDENTIFIER && process.env.ADMIN_PASSWORD),
      authentication: Boolean(jwtAccessSecret && jwtRefreshSecret),
    },
    time: new Date().toISOString(),
  });
});

// cPanel/Passenger deployment: serve the built React application and API
// from one Node process. API routes stay above the SPA fallback.
const frontendDist = path.resolve(__dirname, '../dist');
const frontendIndex = path.join(frontendDist, 'index.html');

// SEO-critical public routes are rendered with meaningful HTML before React
// starts. This keeps News fully crawlable even when a bot does not execute JS.
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const articles = await news.findPublished({ limit: 100, offset: 0 });
    const liveProjects = await projectRoutes.allProjects();
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.type('application/xml').send(renderSitemap(articles, liveProjects));
  } catch (error) {
    next(error);
  }
});

app.get('/llms.txt', async (_req, res, next) => {
  try {
    const articles = await news.findPublished({ limit: 100, offset: 0 });
    const liveProjects = await projectRoutes.allProjects();
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.type('text/plain').send(renderLlmsTxt({ articles, projects: liveProjects }));
  } catch (error) {
    next(error);
  }
});

const crawlablePages = new Set([
  '/', '/about', '/impact', '/projects', '/academy', '/make-a-difference',
  '/contact', '/privacy', '/cookies', '/terms',
  '/health/hepatitis', '/health/hiv', '/health/mental-health',
  '/campaigns/kapime', '/campaigns/life-unlocked', '/campaigns/talk-to-heal',
]);

app.get([...crawlablePages], async (req, res, next) => {
  try {
    const html = renderPublicPage(frontendIndex, req.path);
    if (!html) return next();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

app.get('/campaigns/:campaignId', async (req, res, next) => {
  try {
    const staticHtml = renderPublicPage(frontendIndex, req.path);
    if (staticHtml) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.type('html').send(staticHtml);
    }
    const project = await projectRoutes.findProject(req.params.campaignId);
    if (!project) return next();
    const html = renderPublicPage(frontendIndex, req.path, { project });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

app.get('/news', async (_req, res, next) => {
  try {
    const articles = await news.findPublished({ limit: 100, offset: 0 });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.type('html').send(renderHtml(frontendIndex, { articles }));
  } catch (error) {
    next(error);
  }
});

app.get('/news/:slug', async (req, res, next) => {
  try {
    const article = await news.findBySlug(req.params.slug);
    if (!article) return res.status(404).type('html').send('Article not found');
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.type('html').send(renderHtml(frontendIndex, { article }));
  } catch (error) {
    next(error);
  }
});
app.use(express.static(frontendDist, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  immutable: process.env.NODE_ENV === 'production',
  index: false,
}));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  return res.sendFile(frontendIndex, err => {
    if (err) next(err);
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
