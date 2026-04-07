# CLAUDE.md

This file provides guidance to Claude Code when working with the Tanzania Health Alliance (THA) website repository.

## Project Overview
**Tanzania Health Alliance (THA)** - Registered NGO supporting health advocacy in Tanzania
- Contact: info@tzhealthalliance.or.tz | +255 659 114 754
- Mission: Combat Viral Hepatitis, HIV, and Mental Health through advocacy

## Technology Stack
- React 18 + Vite 5 + Tailwind CSS 3
- React Router v6 with HashRouter (static hosting)
- react-helmet-async for SEO
- web3forms integration for contact form

## Development Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm test       # Run tests
npm run lint    # Lint codebase
```

## File Structure Highlights
```
src/
├ App.jsx           # Main router + layout
├ components/       # Reusable UI components
│  ├ Header.jsx          # Top navigation (desktop)
│  ├ MobileBottomNav.jsx # Bottom navigation (mobile)
│  ├ PartnersCarousel.jsx # Infinite scroll partner logos
│  ├ TestimonialsCarousel.jsx # Swipeable testimonials
│  └ ... (buttons, cards, icons, etc.)
├ pages/            # Page components
│  ├ Home.jsx        # Landing page with news, programs, etc.
│  ├ About.jsx       # Organization information
│  └ ... (other pages)
├ data/             # Content data
│  ├ thaData.js      # Core organization data + contact
│  ├ newsData.js     # Latest news articles
│  ├ testimonials.json # Partner testimonials
│  └ partners.json   # Organizational partners
└ styles/           # Custom CSS beyond Tailwind
```

## Key Features Implemented
1. **Mobile-First Design**:
   - Bottom navigation bar for mobile (Home, About, News, Contact)
   - Touch-friendly controls and spacing
   - Optimized image loading for mobile networks

2. **Dynamic Content Sections**:
   - Latest News: Auto-populated from newsData.js
   - Partners: Infinite horizontal scroll carousel
   - Testimonials: Swipeable carousel with navigation dots
   - Programs: Campaign cards with gradient headers

3. **Performance Optimizations**:
   - Lazy-loaded images where appropriate
   - Efficient carousel implementations
   - Mobile-specific padding to avoid bottom nav overlap

4. **Accessibility**:
   - Proper ARIA labels and semantic HTML
   - Sufficient color contrast
   - Keyboard navigable components

## Important Notes
- **Routing**: Maintain `HashRouter` for static hosting compatibility
- **Data Updates**: Edit JSON files in `src/data/` for content changes
- **Contact Form**: Requires valid web3forms access key in `src/data/thaData.js`
- **Logo**: Located at `/logo/tha-logo.svg` (public directory)

## Common Tasks
- Update news: Modify `src/data/newsData.js`
- Add partner: Update `src/data/partners.json`
- Add testimonial: Update `src/data/testimonials.json`
- Style changes: Adjust Tailwind config or `src/styles/`
- New components: Follow existing patterns in `src/components/`

This guide will be updated as the repository evolves.