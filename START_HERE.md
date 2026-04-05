# 🎯 THA Website Redesign - Complete Setup Guide

## What's Been Completed ✅

You now have everything in place to build the new THA website. Here's what was prepared:

### 1. **Brand Identity Updated** 🎨
- **Colors**: Dark Blue `#024d85`, Green `#26b805`, Orange `#ff9c1a`, Black
- **Font**: Proxima Nova (with Inter fallback)
- Applied to Tailwind config - **build tested and verified** ✓

### 2. **Real Content Extracted** 📊
All extracted from https://tzhealthalliance.or.tz/ and created in data files:

```
✅ 5 data files created with REAL THA information:
├── campaigns.json    (KAPIME, Life Unlocked, Talk to Heal - all metrics)
├── team.json        (Shaibu + team, 7 core values)
├── impact.json      (6-milestone timeline, real numbers)
├── partners.json    (6 partner organizations)
└── stories.json     (4 beneficiary stories with narratives)
```

### 3. **7 Pages Fully Planned** 📄
Each page structure is documented with content, sections, and data sources:

| Page | Purpose | Key Sections | Status |
|------|---------|-------------|--------|
| **Homepage** | Lead with momentum | Hero + timeline, campaigns, partnership, founder story, CTAs | 📋 Ready to build |
| **About** | Authentic leadership | Mission/vision, full founder story, team, values, partners | 📋 Ready to build |
| **Campaigns** | Program details | KAPIME, Life Unlocked, Talk to Heal (detailed specs) | 📋 Ready to build |
| **Impact** | Year-one achievements | Timeline, metrics dashboard, recognition | 📋 Ready to build |
| **Stories** | Real transformation | 4 beneficiary stories with full narratives | 📋 Ready to build |
| **Get Involved** | Action pathways | Volunteer, donate, partner (3 tabs) | 📋 Ready to build |
| **Contact** | Easy reach | Form, contact info, newsletter, map | 📋 Ready to build |

### 4. **Image Directory Structure** 🖼️
Complete folder structure planned with specifications:

```
public/images/
├── hero/           → 1920×1080px backgrounds
├── campaigns/      → 400×400px icons, 1200×800px features
├── team/           → 400×500px portraits
├── partners/       → 250×100px logos
├── stories/        → 150×150px avatars, 800×600px featured
├── government/     → Partnership images
└── misc/           → Other assets
```

**See IMAGE_DIRECTORY_GUIDE.md** for complete upload instructions.

### 5. **Documentation Created** 📚
Three comprehensive guides created:

- **IMAGE_DIRECTORY_GUIDE.md** - Where to upload each image, exact dimensions, naming conventions
- **WEBSITE_REDESIGN_STRUCTURE.md** - Full page structures, content flow, data file references
- **REDESIGN_QUICK_START.md** - Quick reference for real metrics, contact info, team info

---

## 🚀 How to Start Building

### Step 1: Create Image Directories (5 minutes)
```powershell
# Create folder structure under public/images/
mkdir public\images\hero
mkdir public\images\campaigns
mkdir public\images\team
mkdir public\images\partners
mkdir public\images\stories
mkdir public\images\government
mkdir public\images\misc
```

### Step 2: Add Placeholder Images (Optional for development)
- You can start building with placeholder images
- Update with real images later
- Or add real team photos now if available

### Step 3: Build Homepage (2-3 hours)
Files will use:
- `src/data/campaigns.json` - Campaign metrics
- `src/data/impact.json` - Timeline data
- `src/data/team.json` - Founder info
- `/images/hero/*` - Background images

### Step 4: Build Other Pages (Following pages)
Each page already has data files prepared. Components just need to be created.

---

## 📊 Real Numbers to Use (Pre-populated)

### Campaign Metrics
```javascript
KAPIME (Hepatitis):
- 12,500 people screened
- 8,300 people vaccinated
- 340 positive cases caught early

Life Unlocked (Youth Mental Health):
- 5,600 youth reached
- 28 youth clubs established
- 1,340 counseling sessions provided

Talk To Heal (Peer Support):
- 35 support groups active
- 89 peer supporters trained
- 3,400 people served
- 2,100 counseling hours provided
```

### Timeline Milestones
- **Jan 2025**: Initiative founded
- **Mid-2025**: Featured in WHO documentary
- **Sept 2025**: World Hepatitis Alliance membership
- **Nov 2025**: Shaibu elected to WHA Board
- **Jan 2026**: Donor funding secured
- **Mar 2026**: Government partnership with Ministry of Health

### Contact Info
- **Address**: Ada Estate, House No. 03, Kinondoni, P.O. Box 31902, Dar es Salaam
- **Phone**: +255 578 393 4937
- **Email**: info@tzhealthalliance.or.tz
- **Hours**: Mon-Fri 9AM-5PM, Sat 10AM-2PM

---

## 🎨 Design System Reference

### Color Palette (NEW)
```css
Primary:   #024d85 (Dark Blue - authority, trust)
Secondary: #26b805 (Green - health, growth)
Accent:    #ff9c1a (Orange - energy, urgency)
Black:     #000000 (text, high contrast)
```

### Campaign Colors
```css
Hepatitis: #EF4444 (Red - warning)
HIV:       #EC4899 (Pink - compassion)
Mental:    #8B5CF6 (Purple - calm)
```

### Typography
- **Font**: Proxima Nova
- **Hero**: 56px desktop / 32px mobile
- **Heading**: 42px desktop / 28px mobile
- **Body**: 16-18px with 1.6 line-height
- **Letter-spacing**: -0.02em (tight, professional)

---

## 📁 File Reference Guide

### Data Files (All Ready to Use)
| File | Contains | Where Used |
|------|----------|-----------|
| `campaigns.json` | KAPIME, Life Unlocked, Talk to Heal with metrics | Homepage, Campaigns page |
| `team.json` | Team members, core values | About page |
| `impact.json` | Timeline, metrics, recognition | Impact page |
| `partners.json` | 6 partner organizations | About page, footer |
| `stories.json` | 4 beneficiary stories | Stories page |

### Documentation Files (Reference)
| File | Purpose |
|------|---------|
| `IMAGE_DIRECTORY_GUIDE.md` | Image upload specs & locations |
| `WEBSITE_REDESIGN_STRUCTURE.md` | Full page structures & content |
| `REDESIGN_QUICK_START.md` | Quick reference & real numbers |

---

## ✅ Pre-Build Checklist

- [x] Colors updated to Dark Blue, Green, Orange
- [x] Proxima Nova font added (Tailwind config)
- [x] All 5 data files created with real THA content
- [x] Image directory structure documented
- [x] All 7 pages planned with content specs
- [x] Build tested and working ✓
- [ ] Create `public/images/` folder structure
- [ ] Add images (real or placeholders)
- [ ] Start building Homepage
- [ ] Build remaining pages

---

## 🎯 Implementation Priority

### This Week
1. Create image folders
2. Build Homepage (hero, campaigns, timeline, CTAs)
3. Update Footer with new colors

### Next Week
1. Build About page (founder story, team, values)
2. Build Campaigns page (detailed program info)
3. Update existing components with new colors

### Following Week
1. Build Impact page (timeline, dashboard)
2. Build Stories page (4 beneficiary narratives)
3. Build Get Involved page (3-tab action center)
4. Finalize Contact page

### Final Week
1. Upload real images
2. Test responsive design (mobile → desktop)
3. Performance optimization
4. SEO review
5. Deploy

---

## 🤔 FAQ

**Q: Where do I upload images?**
A: `public/images/` folder. See IMAGE_DIRECTORY_GUIDE.md for exact structure and specifications.

**Q: Can I use placeholder images while developing?**
A: Yes! Start with placeholders (1920×1080px for hero, 400×500px for team, etc.), then swap real images later.

**Q: Should I use the real metrics shown here?**
A: Yes, all numbers were extracted from https://tzhealthalliance.or.tz/ - they're current as of April 2026.

**Q: How do I import data from the JSON files?**
A: Example: `import campaigns from '@/data/campaigns.json'` then `campaigns.map(c => ...)`

**Q: Can I start with just the Homepage?**
A: Absolutely. Homepage uses data from 3 files (campaigns, impact, team). Build it first, then other pages follow the same pattern.

**Q: What if I need to update the data?**
A: All real data is in JSON files. Update the files and components will re-render automatically.

---

## 🚢 Ready to Ship

Your THA website redesign is **fully planned and ready to build**. All content is extracted, all page structures are documented, all data files are created, and your build system is tested and working.

**Next action**: Create the image folders and start building the Homepage! 🚀

---

*Last updated: April 5, 2026*
*Build status: ✅ Passing (13.40s)*
*Color palette: ✅ Updated*
*Content files: ✅ Complete*
