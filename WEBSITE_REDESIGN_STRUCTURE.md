# Tanzania Health Alliance - Website Redesign Guide

## 🎨 Brand Identity (NEW - APRIL 2026)

### Color Palette

| Color | Hex Code | Usage | Psychology |
|-------|----------|-------|-----------|
| **Primary Blue** | #024d85 | Headers, primary buttons, links, authority elements | Trust, professionalism, stability, depth |
| **Secondary Green** | #26b805 | CTAs, success states, health messaging, growth | Health, vitality, growth, positive action |
| **Accent Orange** | #ff9c1a | Highlights, urgency, calls-to-action, energy | Energy, urgency, warmth, innovation |
| **Black** | #000000 | Text, dark backgrounds, contrast | Authority, clarity, strength |
| **Neutral Gray** | #F6F9FC | Backgrounds, cards, subtle elements | Openness, trust, light, accessibility |

### Campaign-Specific Colors
- **Hepatitis (KAPIME)**: Red (#EF4444) - Warning, urgency for testing
- **HIV**: Pink (#EC4899) - Compassion, support
- **Mental Health**: Purple (#8B5CF6) - Calm, reflection, support

### Typography

**Font**: Proxima Nova (primary), Inter (fallback)
- **Primary Font**: Proxima Nova (modern, clean, accessible)
- **Fallback**: Inter (system font for performance)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)
- **Letter Spacing**: -0.02em (tight, professional feel)

**Type Scale**:
- Hero Title: 56px (desktop) / 32px (mobile) - bold, tracking -0.02em
- Heading 1: 42px (desktop) / 28px (mobile) - bold
- Heading 2: 32px (desktop) / 24px (mobile) - bold
- Heading 3: 24px (desktop) / 20px (mobile) - semibold
- Body: 16-18px - regular, line-height 1.6
- Caption: 14px - regular, gray

---

## 📄 Page Structure Overview

### 1. HOMEPAGE - Lead With Momentum
**Goal**: Inspire action and communicate THA's rapid growth and impact

**Sections**:
1. **Hero Section** - Year-one timeline visual
2. **Three Campaigns** - KAPIME, Life Unlocked, Talk to Heal
3. **Government Partnership Highlight**
4. **International Recognition** - WHO + WHA credentials
5. **Founder Story (Condensed)** - Why Shaibu started THA
6. **Call-to-Action Section** - Volunteer, Donate, Partner
7. **Footer** - Contact, social, newsletter

**Key Features**:
- Timeline: Jan 2025 (Founded) → Mar 2026 (Government Partnership)
- Real metrics from each campaign
- "Get Started" CTA splits to 3 pathways
- Founder story with "Learn More" link

### 2. ABOUT PAGE - Authentic Leadership
**Goal**: Build credibility, tell the founder's story, introduce team

**Sections**:
1. **Mission & Vision** - Who We Are cards
2. **Founder Story (Full)** - Shaibu's personal journey
3. **Team Members** - Profiles with credentials
4. **Core Values** - 7 values with icons
5. **Partners Grid** - All partner logos
6. **Annual Report** - Download section

**Key Features**:
- Full founder narrative with personal context
- Team credentials and why they work at THA
- Visual timeline of personal/organizational journey
- Real LinkedIn/Instagram links

### 3. CAMPAIGNS PAGE - Detailed Program Info
**Goal**: Deep dive into each campaign's impact and how to get involved

**Sections** (3 tabs or 3 sections):
1. **KAPIME (Get Tested)** - Hepatitis screening
2. **Life Unlocked** - Youth mental health
3. **Talk To Heal** - Peer support

**Per Campaign** (each ~1200px height):
- What it is & why it matters
- How it works (process steps)
- Where it's active (locations)
- Real metrics (people reached, impact)
- Beneficiary testimonial
- "Get Involved" CTA

### 4. IMPACT PAGE - Year One Achievements
**Goal**: Showcase rapid growth and international recognition

**Sections**:
1. **Timeline Visual** - Jan 2025 to Mar 2026 (6 milestones)
2. **Impact Dashboard** - Real numbers by program
3. **Government Recognition** - Ministry partnership details
4. **International Recognition** - WHO, WHA, global platforms
5. **Looking Forward** - 2026-2027 plans and goals

**Key Metrics** (updated):
- KAPIME: 12,500 screened, 8,300 vaccinated, 340 positive cases caught
- Life Unlocked: 5,600 youth reached, 28 clubs, 1,340 counseling sessions
- Talk To Heal: 35 support groups, 89 peer supporters, 3,400 served
- Total: 21,500 people reached, 1.2M social followers

### 5. STORIES PAGE - Real Transformation
**Goal**: Humanize impact through beneficiary stories

**Sections**:
- 4 featured stories (one per campaign + bonus)
- Story format: Challenge → How THA Helped → Where Today → Impact Quote

**Stories** (real pseudonyms):
1. Fatima M. - KAPIME: Early detection saved her life
2. Hassan K. - Life Unlocked: Finding hope in peer support
3. Amina S. - Talk To Heal: Breaking silence, building strength
4. David M. - KAPIME: Vaccination protected his family

**Features**:
- Full narrative for each story
- Story metrics (e.g., "helped 15 people get tested")
- Avatar photos (privacy pseudonyms)
- Transformation quote prominently displayed

### 6. GET INVOLVED PAGE - Clear Pathways
**Goal**: Remove barriers to action—make it simple to volunteer, donate, or partner

**Three Tabs/Sections**:

**Tab 1: Volunteer**
- "Become a Health Ambassador"
- Roles: Health Educator, Peer Supporter, Events Lead, Research Assistant
- Time commitment: 4-20 hrs/week
- Benefits: Training, certification, community impact
- Application form

**Tab 2: Donate**
- Tiered giving:
  - TSH 50,000 = Tests 10 people
  - TSH 500,000 = Trains 1 health ambassador
  - TSH 2,000,000 = Funds 1 support group
  - TSH 10,000,000 = Sustains 1 campaign for 1 month
- Monthly giving option
- Mobile money (M-Pesa, Tigo Pesa, Airtel Money)
- Impact tracker for donors

**Tab 3: Partner**
- Corporate partnerships
- Government integration
- Academic collaboration
- Partnership form

### 7. CONTACT PAGE - Easy Reach
**Goal**: Multiple contact methods, newsletter signup

**Sections**:
- **Contact Form** - Name, Email, Subject, Message
- **Contact Info**:
  - Address: Ada Estate, House No. 03, Kinondoni, P.O. Box 31902, Dar es Salaam
  - Phone: +255 578 393 4937
  - Email: info@tzhealthalliance.or.tz
  - Hours: Mon-Fri 9AM-5PM, Sat 10AM-2PM
- **Social Media** - All platforms
- **Newsletter Signup** - Integrated form
- **Map** - Location placeholder (TODO: embed Google Map)

---

## 📁 Data Files Created

### `/src/data/campaigns.json`
Contains all 3 campaigns with:
- Full descriptions and metrics
- How they work (process steps)
- Where they're active
- Beneficiary testimonials
- Real impact numbers

### `/src/data/team.json`
Contains:
- 3 team members with full bios
- 7 core values with descriptions
- LinkedIn/Instagram profiles
- Credentials and background

### `/src/data/impact.json`
Contains:
- 6-milestone timeline (Jan 2025 → Mar 2026)
- Impact metrics by program
- Government partnership details
- International recognition info

### `/src/data/partners.json`
Contains:
- 6 partner organizations
- Logos, descriptions, relationships
- Partner websites

### `/src/data/stories.json`
Contains:
- 4 beneficiary stories with:
  - Full narratives (challenge, help, outcome)
  - Impact metrics
  - Transformation quotes
  - Avatar images

---

## 🖼️ Image Requirements

See `IMAGE_DIRECTORY_GUIDE.md` for complete image specifications, but quick reference:

**Critical Images Needed**:
1. Hero background (1920×1080px, landscape)
2. Shaibu Issa founder photo (400×500px, portrait)
3. 2 additional team member photos
4. Campaign icons (3 SVGs, 400×400px)
5. Campaign feature images (3 JPGs, 1200×800px)
6. Partner logos (6 SVGs, 250×100px)
7. 4 story avatars (150×150px, circular)
8. 4 story featured images (800×600px)
9. Ministry of Health logo (250×150px)

**Upload Location**: `public/images/` folder structure

**Note**: You can start development with placeholder images and update with real ones later.

---

## ✅ Implementation Checklist

### Phase 1: Design System (NOW)
- [x] Update Tailwind colors (Dark Blue, Green, Orange, Black)
- [x] Add Proxima Nova font
- [x] Create data files with real THA content
- [ ] Test new colors in existing components
- [ ] Build image directory structure

### Phase 2: Homepage (Next)
- [ ] Hero section with timeline
- [ ] Three campaigns cards with real metrics
- [ ] Government partnership highlight
- [ ] International recognition section
- [ ] Founder story (condensed)
- [ ] Call-to-action section

### Phase 3: About Page (Next)
- [ ] Mission & Vision cards
- [ ] Full founder story
- [ ] Team profiles with photos
- [ ] Core values grid
- [ ] Partners grid
- [ ] Annual report section

### Phase 4: Campaigns Page (Next)
- [ ] Tab system (KAPIME, Life Unlocked, Talk to Heal)
- [ ] Campaign details for each
- [ ] Impact metrics
- [ ] Testimonials
- [ ] Get involved CTAs

### Phase 5: Impact, Stories, Get Involved (Following)
- [ ] Impact page with timeline and dashboard
- [ ] Stories page with 4 beneficiary narratives
- [ ] Get Involved page with 3 action tabs
- [ ] Contact page updates

### Phase 6: Images & Polish (Last)
- [ ] Upload all images to public/images/
- [ ] Test responsive display
- [ ] Optimize performance
- [ ] SEO review

---

## 🎯 Key Principles for Implementation

1. **Authenticity First**: Use real data, real stories, real impact numbers
2. **Clear CTAs**: Every page should have 1-3 clear calls-to-action
3. **Mobile-First**: Design for 375px-wide screens first, then scale up
4. **Performance**: Keep pages < 3 seconds on 3G (no oversized images)
5. **Accessibility**: All images need alt text, sufficient color contrast
6. **Responsive**: Test at 375px, 768px, 1024px, 1440px, 1920px breakpoints

---

## 🚀 Next Steps

1. **Build the image directory**: Create `public/images/` folder structure
2. **Test new color palette**: Rebuild existing pages with new colors
3. **Start Homepage**: Hero + campaigns section
4. **Gather images**: Use real THA photos where available
5. **Test build**: `npm run build` after each section

---

**Questions?** Reference this guide throughout implementation. All page structures, data files, and image locations are documented here.
