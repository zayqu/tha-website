# CLAUDE.md

This file provides guidance to Claude Code when working with the Tanzania Health Alliance (THA) website repository. Content reflects the current codebase structure, development workflow, and architectural considerations.

## Project Overview
### Tanzania Health Alliance
- **Purpose:** Public-facing website supporting THA's health advocacy mission
- **Organization:** Registered NGO (No. 00NGO/R/8379) in Dar es Salaam
- **Contact:** info@tzhealthalliance.or.tz | +255 659 114 754

## Technology Stack
- React 18 with Vite 5
- Routing: `ReactRouterDOM v6` using `HashRouter`
- Tailwind CSS 3 + Custom CSS
- SEO: `react-helmet-async`
- Third-party: web3forms integration

## Development Commands
```bash
npm run dev     # Start dev server
npm run build   # Build production
npm run preview # Preview production
npm test       # Run unit/integration tests
npm run lint    # Lint codebase
```

## File Structure
```
src/
├ App.jsx      # Main router
├ components/  # Reusable UI
├ pages/       # Page components
├ data/        # Content JSON/JS
└ styles/      # Custom CSS
```

## Key Routes
| Path                  | Page                  |
|-----------------------|-----------------------|
| `/`                   | Home                  |
| `/about`              | About                 |
| `/campaigns/:id`      | CampaignDetail        |

## Design System
- Tailwind CSS tokens in `tailwind.config.js`
- Font elecciones: `font-heading` for headings

## Rules
1. Use `HashRouter` (no SSR)
2. All data in `src/data/` (JSON files)
3. Logo: `public/logo/tha-logo.svg`
4. Web3forms access key needs replacement before deployment

## Developer Notes
- Use `HashRouter` for static hosting compatibility
- Optimize for mobile users in Tanzania
- Update web3forms key before deploy
- Avoid hardcoding org details

This document will be updated as the repository evolves.