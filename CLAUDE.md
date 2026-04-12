# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for Taqwa Humanitarian Association (THA). Two separate apps share this repo:

1. **Frontend** — Vite + React 18 + TailwindCSS SPA (root `package.json`)
2. **Backend** — Express API in `server/` (separate `server/package.json`, CommonJS)

## Commands

### Frontend (run from repo root)
```bash
npm install          # install frontend deps
npm run dev          # dev server on :3000 (auto-opens browser)
npm run build        # production build → dist/
npm run preview      # serve production build locally
npm run lint         # ESLint (js/jsx, zero warnings allowed)
```

### Backend (run from server/)
```bash
cd server
npm install          # install backend deps
npm run dev          # nodemon on :3001
npm start            # production start
npm run seed         # seed admin account + sample data
```

Both must run simultaneously for local development. The Vite dev server proxies `/api` → `http://localhost:3001`.

## Architecture

### Routing
- Uses **HashRouter** (`#/path`) for static hosting compatibility — all links use hash-based paths.
- Public pages are wrapped in `PublicLayout` (Header + Footer + MobileBottomNav).
- Admin routes (`/admin/*`) render standalone without the public layout.
- Admin routes are protected by `ProtectedRoute`, which checks `AuthContext`.

### Authentication
- JWT access tokens are stored **only in memory** (never localStorage) to mitigate XSS.
- Refresh tokens are httpOnly cookies. `AuthContext` silently refreshes on mount and before expiry.
- `authFetch()` from `useAuth()` is the authenticated fetch wrapper — auto-attaches Bearer token and retries once on 401/TOKEN_EXPIRED.

### Data layer (server/db.js)
- Dual-mode: uses **PostgreSQL** (`pg` Pool) when `DATABASE_URL` env var is set, otherwise falls back to a **JSON file store** under `server/data/`.
- Schema is auto-created on first query (`ensureSchema()`).
- Exported objects: `admins`, `tokens`, `news` — all methods are async regardless of backend.

### API routes
- `POST/GET /api/auth/*` — login, logout, refresh, register (`server/routes/auth.js`)
- `GET/POST/PUT/DELETE /api/news/*` — public listing + admin CRUD (`server/routes/news.js`)
- `GET /api/health` — health check

### Frontend data flow for News
- Public pages use `src/lib/api.js` (`fetchPublishedNews`, `fetchNewsArticle`) which call the API.
- Admin pages use `authFetch` from `AuthContext` directly.
- `normalizeArticle()` in `src/lib/api.js` handles snake_case/camelCase field mapping.

### Static data
- Non-API page content lives in `src/data/` (e.g., `thaData.js`, `statsData.js`, `newsData.js`).

## Design tokens (tailwind.config.js)
- Primary: `#024d85` (blue), Secondary: `#26b805` (green), Accent: `#ff9c1a` (orange)
- Font: Inter / system-ui
- Custom shadows: `subtle`, `card`, `elevated`
- Custom animations: `fade-up`, `fade-in`

## Environment variables
- `VITE_API_BASE_URL` — frontend API base (empty string uses Vite proxy in dev)
- `DATABASE_URL` — PostgreSQL connection string (omit for JSON file store)
- `ALLOWED_ORIGINS` — comma-separated CORS origins (defaults to `http://localhost:3000`)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — required by auth routes
- `NODE_ENV` — controls error verbosity, logging format, CORS strictness

## Deployment
- Deployed on Vercel; config in `vercel.json`.
- Frontend build: `npm run build` → `dist/`.
