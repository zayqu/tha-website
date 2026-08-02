# News Publishing Deployment Verification

This document records the production checks for the upgraded News publishing workflow introduced in PR #8.

Required checks before merge:

- Frontend and backend Vercel builds succeed.
- Admin News provides explicit **Publish now** and **Save as draft** actions.
- Custom and suggested categories are available.
- The public News filters reflect published categories.
- Topic-assisted drafting remains editable before publishing.
- Uploaded images are resized and compressed before submission.
- Existing published articles remain available.
- Academy, News, admin login, registration, API health, and unauthenticated auth connectivity pass production smoke tests.
