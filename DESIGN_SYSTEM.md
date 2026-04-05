# Tanzania Health Alliance - Premium Design System

## Overview
Tanzania Health Alliance (THA) website is a modern, professional NGO platform built with React, Vite, and Tailwind CSS. The design system emphasizes premium aesthetics, healthcare color psychology, and seamless user experience.

## Design Principles
- **Professional**: Midnight blue (#0A2540) conveys authority and trust
- **Vital**: Bright green (#00D26A) symbolizes health and growth
- **Urgent**: Warm orange (#FF6B35) highlights calls-to-action
- **Accessible**: Clear typography, generous whitespace, mobile-first
- **Humane**: Founder's personal story drives emotional connection

## Color Palette

### Primary Colors
- **Midnight Blue** (#0A2540) - Primary brand color, authority, depth
  - Light: #1a3f5f
  - Dark: #051529
- **Vital Green** (#00D26A) - CTAs, positive action, health
  - Light: #33dd88
  - Dark: #00a852
- **Warm Orange** (#FF6B35) - Urgency, highlights, secondary CTAs
  - Light: #ff8855
  - Dark: #cc5428

### Neutral Colors
- **Cool Gray** (#F6F9FC) - Backgrounds, secondary elements
  - Light: #FFFFFF
  - Dark: #E8EDF4
- **Near Black** (#1A1A1A) - Primary text

### Healthcare Category Colors (Context-Aware Icons)
- **Hepatitis Red** (#EF4444) - Urgency, warning
- **HIV Pink** (#EC4899) - Compassion, support
- **Mental Purple** (#8B5CF6) - Calm, peace
- **Health Green** (#10B981) - Vitality, hope

## Typography

### Font Family
- **Inter** - Clean, modern, highly readable
  - 400 weight for body text
  - 600-700 weight for headings
  - Tight tracking (-0.02em) for premium feel

### Scale
```
Hero (Desktop):    56px (56px mobile)
Heading MD:        42px (32px mobile)
Heading SM:        32px (24px mobile)
Body Large:        18px (16px mobile)
Body Medium:       16px (14px mobile)
Body Small:        14px (12px mobile)
```

### Line Height
- **Headings**: 1.2 (tight)
- **Body**: 1.6 (relaxed, readable)

## Components

### Header
- Fixed positioning with glassmorphic backdrop on scroll
- Responsive mobile hamburger menu
- Quick navigation to all pages
- "Join the Alliance" CTA button
- Smooth transitions and hover states

### Footer
- Newsletter subscription section
- 4-column footer grid (About, Links, Get Involved, Contact)
- Social media icons (Facebook, Instagram, LinkedIn)
- Contact information
- Privacy/Terms links
- Consistent with brand colors

### Cards
- Subtle shadows (0 4px 6px rgba(0,0,0,0.05))
- Hover lift animation (translateY(-4px))
- Rounded corners (8px default)
- 300ms ease transitions

### Buttons
- **Primary**: Vital Green background, white text
- **Secondary**: Midnight Blue outline, hover fill
- Padding: 12px horizontal, 12px vertical
- Rounded: 8px

### Animations
- **Fade Up**: Scroll-triggered element animation
- **Scale**: Hover effects on cards/images
- **Count Up**: Animated counters for statistics
- **Marquee**: Infinite scroll for partner logos
- **Pulse Soft**: Gentle emphasis effect

## Pages

### 1. HOME
- Hero section with mission statement
- Animated impact counters (4 metrics)
- Focus areas cards (Hepatitis, HIV, Mental Health, Healthcare Access)
- Latest news grid (3 cards)
- Academy highlight section
- Partners marquee (infinite scroll)
- CTA block ("Join the Alliance")

### 2. ABOUT
- Founder's story with pull-quote
- Mission/Vision statements
- Timeline (2018-present)
- Team profiles (4 members)
- Partners grid (8 logos)
- Annual report download section

### 3. MAKE A DIFFERENCE
- Action selector tabs (Volunteer, Donate, Partner)
- Volunteer roles with time commitments
- Mobile money options (M-Pesa, Tigo Pesa, Airtel Money)
- Bank transfer details
- Impact calculator
- Success story testimonial

### 4. ACADEMY (In Progress)
- Search and filter UI
- Resource grid with badges
- Categorized content (WHO, Research, Training, Policy, Newsletters)
- Load more pagination
- Automated daily content fetch

### 5. NEWS (In Progress)
- Category filter pills
- Featured post (full-width)
- Grid layout (3 cols desktop)
- Individual article pages
- Airtable integration for staff

### 6. CONTACT
- Two-column layout
- Location card with embedded map placeholder
- Contact form with validation
- Mobile-responsive
- Newsletter signup

## Implementation Details

### Tailwind Configuration
```javascript
// Colors already configured in tailwind.config.js
// Additional utilities:
- shadow-subtle: 0 4px 6px rgba(0,0,0,0.05)
- shadow-card: 0 4px 12px rgba(0,0,0,0.08)
- shadow-elevated: 0 12px 24px rgba(0,0,0,0.12)
- Animation utilities for fade-up, count-up, marquee
```

### CSS Classes
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.body-md`, `.body-sm`, `.body-lg` - Text utilities
- `.heading-md`, `.heading-lg`, `.heading-sm` - Heading utilities
- `.input-group` - Floating label form inputs
- `.modal-backdrop` / `.modal-content` - Modal styling

### Icons
- Material Design Icons (SVG-based)
- Category-aware coloring system
- 30+ icons included
- Customizable size, color, category

## File Structure
```
src/
├── components/
│   ├── Header.jsx        - Fixed nav header
│   ├── Footer.jsx        - Footer with newsletter
│   ├── Icon.jsx          - Category-aware icons
│   └── (other components)
├── pages/
│   ├── Home.jsx          - Landing page
│   ├── About.jsx         - Organization story
│   ├── MakeDifference.jsx - Engagement page
│   ├── Academy.jsx       - Resources (TODO)
│   ├── News.jsx          - News/events (TODO)
│   └── Contact.jsx       - Contact form
├── data/
│   ├── academy.json      - Academy resources
│   ├── statsData.js      - Impact statistics
│   ├── thaData.js        - Org metadata
│   └── newsData.js       - News articles
├── styles/
│   └── index.css         - Global styles
└── App.jsx               - Router setup
```

## Performance Metrics
- Build Size: ~72 KB gzipped JS, 32 KB CSS
- Load time target: <3s on 3G
- Mobile-first responsive design
- Lazy loading for images below fold
- Optimized SVG icons

## Deployment
- Vite static export (HashRouter for cPanel)
- GitHub Actions for automated deploys
- FTP to cPanel hosting
- .htaccess for SPA routing

## TODO Items
1. Academy page with search and API integration
2. News page with staff workflow (Airtable + Cloudinary)
3. Embed real map in Contact page
4. Form submission backend
5. Image optimization and WebP conversion
6. SEO metadata and sitemap generation
7. Newsletter service integration
8. Analytics setup

## Color Usage Guidelines

### When to Use Each Color
- **Midnight Blue**: Headers, navigation, text, serious messaging
- **Vital Green**: Buttons, positive actions, success states, health messaging
- **Warm Orange**: Secondary CTAs, highlights, urgent messaging
- **Icons**:
  - Hepatitis topics → Red
  - HIV topics → Pink
  - Mental health → Purple
  - General health → Green

## Accessibility
- WCAG 2.1 AA compliant color contrasts
- Semantic HTML structure
- ARIA labels where needed
- Mobile-touch targets (minimum 44x44px)
- Clear focus states on interactive elements

---

**Last Updated**: April 5, 2024
**Version**: 2.0 (Complete Redesign)
