# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Tanzania Health Alliance (THA)** – NGO focused on combating Viral Hepatitis, HIV, and Mental Health through advocacy and community programs.

*Tech Stack*: React 18, Vite 5, Tailwind CSS 3, React Router v6 (HashRouter), react-helmet-async.

## Development Commands
```bash
# Start the dev server (local, continues live-reload)
npm run dev

# Build production assets (creates ./dist)
npm run build

# Preview the built site in a local webserver
npm run preview
```

Note: This project does not currently have test or lint scripts configured.

## High-Level Architecture

- **`src/main.jsx`** – bootstraps React and renders `<App />` into `#root`.
- **`src/App.jsx`** – top-level layout:
  1. `<Header />` (desktop navigation) and `<MobileBottomNav />` (bottom bar for small screens).
  2. `<ScrollToTop />` – scrolls to top on route changes.
  3. `<Routes>` – defines the app's public pages.
  4. `<Footer />` – shared footer.
- **Pages** (`src/pages/*`)
  - `Home.jsx`: hero section, animated impact counters, program cards, partner & testimonial carousels.
  - `About.jsx`: organization information and mission.
  - `MakeADifference.jsx`: involvement opportunities.
  - `Academy.jsx`: educational content with card layouts.
  - `News.jsx` & `NewsDetail.jsx`: news listing and individual articles.
  - `Projects.jsx`: project showcase.
  - `CampaignDetail.jsx`: dynamic campaign pages (route: `/campaigns/:campaignId`).
  - `Contact.jsx`: contact form using Web3Forms.
- **Components** (`src/components/*`)
  - Layout: `Header`, `Footer`, `MobileBottomNav`, `Icon`.
  - Carousels: `PartnersCarousel`, `TestimonialCarousel`.
  - UI pieces: `ButtonPrimary`, `ButtonSecondary`, `SectionHeader`, `NewsCard`, `AcademyCard`, `TypingText`, `CounterAnimation`.
- **Data** (`src/data/*.js` or JSON)
  - `thaData.js`: core organization details, contact, banking, team, programs, thematic areas.
  - `sendEmail()` helper posts to Web3Forms (access key needs configuration).
  - JSON data: `campaigns.json`, `partners.json`, `testimonials.json`, `news.json`, `newsData.js`, `academy.json`, `impact.json`, `statsData.js`, `team.json`, `teamData.json`, `objectives.json`, `thematicAreas.json`, `faqs.json`, `contactInfo.json`, `stories.json`.
- **Styling**
  - Tailwind generates utility classes via `src/index.css` (imports Tailwind directives).
  - `tailwind.config.js` defines brand colors (primary blue, secondary green, accent orange), health category colors, fonts, custom animations, shadows, and breakpoints.
- **Routing** – Uses `HashRouter` for static hosting compatibility (GitHub Pages, Netlify, etc.).
- **SEO** – `react-helmet-async` in page components sets `<title>` and meta tags.
- **Accessibility** – Components use semantic tags, ARIA labels, sufficient color contrast, keyboard navigation.

## Folder Highlights
```
src/
 ├─ App.jsx
 ├─ main.jsx
 ├─ index.css
 ├─ components/
 │   ├─ Header.jsx
 │   ├─ Footer.jsx
 │   ├─ MobileBottomNav.jsx
 │   ├─ Icon.jsx
 │   ├─ PartnersCarousel.jsx
 │   ├─ TestimonialCarousel.jsx
 │   ├─ ButtonPrimary.jsx
 │   ├─ ButtonSecondary.jsx
 │   ├─ SectionHeader.jsx
 │   ├─ NewsCard.jsx
 │   ├─ AcademyCard.jsx
 │   ├─ TypingText.jsx
 │   ├─ CounterAnimation.jsx
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ About.jsx
 │   ├─ MakeADifference.jsx
 │   ├─ Academy.jsx
 │   ├─ News.jsx
 │   ├─ NewsDetail.jsx
 │   ├─ Projects.jsx
 │   ├─ CampaignDetail.jsx
 │   ├─ Contact.jsx
 ├─ data/
 │   ├─ thaData.js
 │   ├─ campaigns.json
 │   ├─ partners.json
 │   ├─ testimonials.json
 │   ├─ news.json
 │   ├─ newsData.js
 │   ├─ academy.json
 │   ├─ impact.json
 │   ├─ statsData.js
 │   ├─ team.json
 │   ├─ teamData.json
 │   ├─ objectives.json
 │   ├─ thematicAreas.json
 │   ├─ faqs.json
 │   ├─ contactInfo.json
 │   └─ stories.json
 └─ styles/ (empty or unused; styles are in src/index.css)
```

## Common Tasks
- **Updating news** – edit `src/data/newsData.js` or `src/data/news.json`.
- **Adding a partner** – edit `src/data/partners.json`.
- **Adding a testimonial** – edit `src/data/testimonials.json`.
- **Changing site theme** – modify `tailwind.config.js` brand colors or `src/index.css` overrides.
- **Adding a new page** – create a component in `pages/`, add a `<Route>` in `App.jsx`, and add any required data files.
- **Adding a new component** – follow patterns in `components/` and use Tailwind utilities for styling.
- **Contact form deployment** – replace `YOUR_WEB3FORMS_KEY` in `thaData.js` with a real access key before public deployment.

## Build and Deploy Notes
- Production build output is in `dist/`. The `public/` folder is copied unchanged.
- The app uses `HashRouter`, so deployment works on any static hosting (GitHub Pages, Netlify, Vercel, etc.).
- The `vite.config.js` manually chunks `react`, `react-dom`, and `react-router-dom` into a vendor bundle for better caching.
- Base path is set to `./` for relative asset paths (suitable for static hosting).
- Static assets (favicon, images) live in `public/` and are served at the root.

## Navigation Reference
**Routes**: `/` (Home), `/about`, `/make-a-difference`, `/projects`, `/academy`, `/news`, `/news/:id`, `/contact`, `/campaigns/:campaignId`

**Key Files**:
- `App.jsx` – main router & layout
- `Header.jsx` – primary navigation (desktop)
- `MobileBottomNav.jsx` – mobile navigation bar
- `thaData.js` – core organization data & email helper
- `campaigns.json` – program definitions used on Home and CampaignDetail
- `tailwind.config.js` – design tokens (colors, fonts, animations)

---

This CLAUDE.md will be used for future instances of Claude Code to operate in this repository.