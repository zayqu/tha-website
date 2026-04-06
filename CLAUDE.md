# CLAUDE.md — THA Website

## Project
Website for **Tanzania Health Alliance (THA)**, a registered NGO (No. 00NGO/R/8379) based in Dar es Salaam, Tanzania. Public-facing site supporting their health advocacy mission.

## Stack
- **React 18** + **Vite 5** + **Tailwind CSS 3**
- **react-router-dom v6** — uses `HashRouter` (static hosting compatibility, no server-side routing)
- **react-helmet-async** — SEO meta tags

## Commands
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure
```
src/
  App.jsx              # router + layout shell
  components/          # shared UI components
    Header.jsx         # sticky nav, mobile hamburger, "Join the Alliance" CTA
    Footer.jsx
    Icon.jsx           # custom icon wrapper
    ButtonPrimary.jsx
    ButtonSecondary.jsx
    SectionHeader.jsx
    CounterAnimation.jsx
    TypingText.jsx
    AcademyCard.jsx
    NewsCard.jsx
  pages/               # page-level components
    Home.jsx
    About.jsx
    MakeADifference.jsx
    Projects.jsx
    Academy.jsx
    News.jsx
    NewsDetail.jsx
    Contact.jsx
    CampaignDetail.jsx
    MakeDifference.jsx
  data/                # all content data
    thaData.js         # canonical org data + sendEmail() via web3forms
    newsData.js
    statsData.js
    campaigns.json
    impact.json
    partners.json
    stories.json
    team.json
    testimonials.json
    # ...and more JSON files
  styles/              # custom CSS beyond Tailwind
```

## Routes
| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/make-a-difference` | MakeADifference |
| `/projects` | Projects |
| `/academy` | Academy |
| `/news` | News |
| `/contact` | Contact |
| `/campaigns/:campaignId` | CampaignDetail |

## Design System (Tailwind)
Custom tokens defined in `tailwind.config.js`:
- **Colors:** `primary`, `primary-dark`, `secondary`, `secondary-dark`, `cool-gray`, `cool-gray-dark`, `near-black`
- **Shadows:** `shadow-subtle`, `shadow-card`, `shadow-elevated`
- **Font sizes:** `text-hero-lg`, `text-hero-md`
- **Font:** `font-heading` for display/headings

## Org Identity — Do Not Fabricate
All org data is real. Never invent or placeholder org details.
- **Motto:** "Together for a Healthier Tanzania"
- **Founder & Executive Director:** Shaibu Issa
- **Contact:** info@tzhealthalliance.or.tz | +255 659 114 754
- **Address:** Adda Estate, Kinondoni, Dar es Salaam
- **Socials:** Instagram, LinkedIn, Facebook
- **Programs:** KAPIME Campaign (Hepatitis B), Life Unlocked (Mental Health — youth), Talk To Heal (Mental Health — community)

## Contact Form
Uses **web3forms** (`sendEmail()` in `src/data/thaData.js`). The `access_key` in that file needs to be replaced with the real web3forms key before deploying.

## Key Rules
- Use `HashRouter` — do not switch to `BrowserRouter` without configuring server-side fallback
- Logo lives at `public/logo/tha-logo.svg` — referenced as `/logo/tha-logo.svg`
- All data is in `src/data/` — edit JSON/JS files there, not hardcoded in components
