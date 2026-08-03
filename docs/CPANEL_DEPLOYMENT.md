# THA cPanel production deployment

This repository can deploy the public website and Node.js API to cPanel without using Vercel build capacity.

## Production layout

- Website: `https://tzhealthalliance.or.tz`
- API: `https://api.tzhealthalliance.or.tz`
- Frontend: the Vite `dist` artifact served by Apache
- Backend: the `server` directory running as a cPanel Node.js application
- Database: the existing Neon PostgreSQL database

Keep the existing Vercel deployment online until the cPanel release passes all acceptance tests.

## One-time cPanel setup

1. Create the `api.tzhealthalliance.or.tz` subdomain and enable SSL.
2. In **Setup Node.js App**, create a Node.js 20 production application.
3. Set its application root to a private directory outside `public_html`, for example `/home/ACCOUNT/tha-api`.
4. Set the startup file to `index.js`. The deployment copies the contents of `server/` directly into the application root.
5. Add the production environment variables in the cPanel Node application:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=https://tzhealthalliance.or.tz,https://www.tzhealthalliance.or.tz`
   - `DATABASE_URL`
   - `ADMIN_IDENTIFIER`
   - `ADMIN_PASSWORD`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_ACCESS_EXPIRES`
   - `JWT_REFRESH_EXPIRES`
   - `ADMIN_PASSWORD_RESET_VERSION` only when intentionally resetting the administrator password
6. Copy the existing values securely from the current production configuration. Never commit them or paste them into an issue or chat.

## GitHub production secrets

Add these in **Repository settings → Secrets and variables → Actions**:

| Secret | Example or purpose |
|---|---|
| `CPANEL_HOST` | SSH hostname |
| `CPANEL_PORT` | SSH port, commonly `22` |
| `CPANEL_USER` | cPanel SSH username |
| `CPANEL_SSH_KEY` | Dedicated Ed25519 private deployment key |
| `CPANEL_KNOWN_HOSTS` | Verified server host-key line |
| `CPANEL_FRONTEND_PATH` | `/home/ACCOUNT/public_html` |
| `CPANEL_API_PATH` | `/home/ACCOUNT/tha-api` |
| `CPANEL_NODE_BIN` | Node environment bin directory shown by cPanel, ending in `/bin` |

The corresponding public deployment key must be installed in the cPanel account's `~/.ssh/authorized_keys`.

## Deployment behavior

Pull requests run the complete frontend build and backend startup verification without touching production. A push to `main`:

1. downloads the exact verified frontend artifact;
2. validates that remote paths are non-empty and restricted to the cPanel home directory;
3. synchronizes the frontend while removing obsolete frontend assets;
4. synchronizes backend source while preserving `.env`, `data/`, and `node_modules/`;
5. installs locked production dependencies;
6. restarts the Passenger Node.js application using `tmp/restart.txt`;
7. verifies the public API health endpoint and homepage.

The workflow does not disable SSH host verification and does not store credentials in the repository.

## Final acceptance checks

- Homepage, Academy, News, Contact and individual News pages load over HTTPS.
- Refreshing a clean React URL returns the same page rather than a 404.
- `/api/health` reports PostgreSQL and authentication configured.
- Published news appears publicly.
- Admin login connects to the cPanel API.
- Registration loads, but no test account is submitted.
- Image upload compression and publish/draft controls work.
- No browser console or Node runtime errors appear.
