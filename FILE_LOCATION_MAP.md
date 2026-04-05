# 📍 COMPLETE FILE LOCATION MAP - THA Website Redesign

## 🎯 WHERE EVERYTHING GOES - COMPLETE REFERENCE

```
tha-website/
│
├── 📚 DOCUMENTATION (Reference guides - READ THESE)
│   ├── START_HERE.md                      👈 BEGIN HERE - Project overview
│   ├── FINAL_SUMMARY.md                   👈 QUICK SUMMARY - What you have right now
│   ├── PROJECT_MEMORY.md                  👈 COMPLETE TRACE - All details preserved
│   ├── REDESIGN_QUICK_START.md            ← Real numbers quick reference
│   ├── WEBSITE_REDESIGN_STRUCTURE.md      ← Full page structures & content
│   ├── IMAGE_DIRECTORY_GUIDE.md           ← Image specs & upload instructions
│   ├── IMAGE_UPLOAD_REFERENCE.md          ← Visual map of image locations
│   ├── LOGO_FAVICON_GUIDE.md              ← Logo & favicon setup
│   └── FILE_LOCATION_MAP.md               ← This file
│
├── 🎨 BRAND & CONFIG
│   ├── tailwind.config.js                 ✅ Colors: Dark Blue, Green, Orange; Font: Proxima Nova
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── 📁 PUBLIC FOLDER - Web Server Files
│   ├── index.html                         👈 UPDATE: Add favicon/manifest links here
│   │
│   ├── 🎯 FAVICON FILES (Go in public/ root)
│   │   ├── favicon.svg                    ← Modern browser favicon (100×100px SVG)
│   │   ├── favicon.ico                    ← Traditional favicon (32×32px ICO)
│   │   ├── apple-touch-icon.png           ← iPhone home screen (180×180px)
│   │   ├── android-chrome-192.png         ← Android home screen (192×192px)
│   │   ├── android-chrome-512.png         ← Android splash (512×512px)
│   │   ├── og-image.jpg                   ← Social media preview (1200×630px)
│   │   └── site.webmanifest               ← PWA configuration JSON
│   │
│   ├── 📋 LOGO FOLDER (Create: public/logo/)
│   │   ├── tha-logo.svg                   ← Full logo with text (400×100px) - HEADER
│   │   ├── tha-logo-mark.svg              ← Mark/symbol only (200×200px) - favicon base
│   │   ├── tha-logo-dark.svg              ← Dark variant (light backgrounds)
│   │   └── tha-logo-light.svg             ← Light variant (dark backgrounds) - FOOTER
│   │
│   ├── 🖼️ IMAGES FOLDER (Create: public/images/)
│   │   │
│   │   ├── hero/
│   │   │   ├── hero-bg-xl.jpg             (2560×1440px) - Extra large desktop
│   │   │   ├── hero-bg-lg.jpg             (1920×1080px) - Desktop MAIN
│   │   │   ├── hero-bg-md.jpg             (1366×768px) - Tablet
│   │   │   ├── hero-bg-sm.jpg             (768×432px)  - Mobile
│   │   │   └── hero-bg-xs.jpg             (375×667px)  - Small mobile
│   │   │
│   │   ├── campaigns/
│   │   │   ├── kapime-icon.svg            (400×400px)
│   │   │   ├── kapime-feature.jpg         (1200×800px)
│   │   │   ├── life-unlocked-icon.svg     (400×400px)
│   │   │   ├── life-unlocked-feature.jpg  (1200×800px)
│   │   │   ├── talk-to-heal-icon.svg      (400×400px)
│   │   │   └── talk-to-heal-feature.jpg   (1200×800px)
│   │   │
│   │   ├── team/
│   │   │   ├── shaibu-issa.jpg            (400×500px) - FOUNDER PORTRAIT
│   │   │   ├── associate-director.jpg     (400×500px)
│   │   │   ├── general-secretary.jpg      (400×500px)
│   │   │   └── team-group.jpg             (1600×900px) [optional]
│   │   │
│   │   ├── partners/
│   │   │   ├── who-logo.svg               (250×100px)
│   │   │   ├── global-liver-logo.svg      (250×100px)
│   │   │   ├── wha-logo.svg               (250×100px)
│   │   │   ├── taskforce-logo.svg         (250×100px)
│   │   │   ├── abaché-logo.svg            (250×100px)
│   │   │   └── ministry-health-logo.svg   (250×100px)
│   │   │
│   │   ├── stories/
│   │   │   ├── story-1-avatar.jpg         (150×150px) - Fatima
│   │   │   ├── story-1-featured.jpg       (800×600px)
│   │   │   ├── story-2-avatar.jpg         (150×150px) - Hassan
│   │   │   ├── story-2-featured.jpg       (800×600px)
│   │   │   ├── story-3-avatar.jpg         (150×150px) - Amina
│   │   │   ├── story-3-featured.jpg       (800×600px)
│   │   │   ├── story-4-avatar.jpg         (150×150px) - David
│   │   │   └── story-4-featured.jpg       (800×600px)
│   │   │
│   │   ├── government/
│   │   │   ├── ministry-health-logo.svg   (250×150px)
│   │   │   ├── ministry-partnership.jpg   (1200×800px)
│   │   │   └── government-seal.svg        (300×300px)
│   │   │
│   │   └── misc/
│   │       ├── annual-report-cover.pdf
│   │       ├── timeline-visual.svg
│   │       ├── impact-dashboard-bg.jpg
│   │       └── testimonial-gradient.svg
│   │
│   ├── robots.txt
│   └── ...other public files
│
├── 📊 DATA FILES (Real THA Content)
│   src/data/
│   ├── campaigns.json                     ✅ 3 campaigns with real metrics (21,500+ data)
│   ├── team.json                          ✅ Team members + 7 core values
│   ├── impact.json                        ✅ 6-milestone timeline + recognition
│   ├── partners.json                      ✅ 6 partner organizations
│   ├── stories.json                       ✅ 4 beneficiary stories with narratives
│   ├── academy.json
│   ├── news.json
│   ├── newsData.js
│   ├── statsData.js
│   └── thaData.js
│
├── 🎨 STYLES
│   src/styles/
│   └── index.css                          ✅ Updated with Proxima Nova font
│
├── 🛠️ COMPONENTS
│   src/components/
│   ├── Header.jsx                         👈 UPDATE: Add logo from /logo/tha-logo.svg
│   ├── Footer.jsx                         👈 UPDATE: Add logo from /logo/tha-logo-light.svg
│   ├── ButtonPrimary.jsx
│   ├── ButtonSecondary.jsx
│   ├── CounterAnimation.jsx
│   ├── NewsCard.jsx
│   ├── AcademyCard.jsx
│   ├── SectionHeader.jsx
│   ├── TypingText.jsx
│   └── Icon.jsx
│
├── 📄 PAGES
│   src/pages/
│   ├── Home.jsx                           📋 READY TO BUILD - Uses campaigns.json, impact.json
│   ├── About.jsx                          📋 READY TO BUILD - Uses team.json, partners.json
│   ├── Campaigns.jsx                      📋 READY TO BUILD - Uses campaigns.json
│   ├── Academy.jsx
│   ├── News.jsx
│   ├── NewsDetail.jsx
│   ├── Contact.jsx                        📋 READY TO UPDATE - Real contact info ready
│   ├── MakeDifference.jsx
│   ├── Projects.jsx
│   └── [Pages to create]
│
├── 📍 MAIN APP
│   src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── 📦 BUILD OUTPUT (Auto-generated)
    dist/
    ├── index.html
    ├── assets/
    │   ├── index-*.css
    │   ├── index-*.js
    │   └── vendor-*.js
    └── ...
```

---

## 🎯 QUICK NAVIGATION

### If You Need To...

**Add logo to Header**
→ File: `src/components/Header.jsx`  
→ Import: `<img src="/logo/tha-logo.svg" />`  
→ Size: 40-60px height  
→ Guide: LOGO_FAVICON_GUIDE.md

**Add logo to Footer**
→ File: `src/components/Footer.jsx`  
→ Import: `<img src="/logo/tha-logo-light.svg" />`  
→ Size: 40-60px height  
→ Guide: LOGO_FAVICON_GUIDE.md

**Build Homepage**
→ File: `src/pages/Home.jsx`  
→ Data: `campaigns.json`, `impact.json`, `team.json`  
→ Guide: WEBSITE_REDESIGN_STRUCTURE.md

**Build About Page**
→ File: `src/pages/About.jsx`  
→ Data: `team.json`, `partners.json`  
→ Guide: WEBSITE_REDESIGN_STRUCTURE.md

**Upload Hero Image**
→ Folder: `public/images/hero/`  
→ File: `hero-bg-lg.jpg`  
→ Size: 1920×1080px  
→ Guide: IMAGE_UPLOAD_REFERENCE.md

**Add Team Photos**
→ Folder: `public/images/team/`  
→ Files: `shaibu-issa.jpg` (400×500px) + others  
→ Guide: IMAGE_UPLOAD_REFERENCE.md

**Add Partner Logos**
→ Folder: `public/images/partners/`  
→ Files: `who-logo.svg` + 5 others (250×100px)  
→ Guide: IMAGE_UPLOAD_REFERENCE.md

**Add Story Avatars & Images**
→ Folder: `public/images/stories/`  
→ Avatar: 150×150px JPG  
→ Featured: 800×600px JPG  
→ Guide: IMAGE_UPLOAD_REFERENCE.md

**Setup Favicons**
→ Folder: `public/`  
→ Files: favicon.svg, .ico, apple-touch-icon.png, android-chrome-*.png, og-image.jpg  
→ Guide: LOGO_FAVICON_GUIDE.md

**Find Real Metrics**
→ File: `src/data/campaigns.json`, `impact.json`  
→ Quick Ref: REDESIGN_QUICK_START.md  
→ Full Details: PROJECT_MEMORY.md

**Find Contact Info**
→ Quick Ref: REDESIGN_QUICK_START.md (line ~30)  
→ Full Details: PROJECT_MEMORY.md

---

## 📋 FILE CREATION CHECKLIST

### Logo Files (Priority 1)
- [ ] `public/logo/tha-logo.svg` - Full logo with text
- [ ] `public/logo/tha-logo-mark.svg` - Mark only
- [ ] `public/logo/tha-logo-dark.svg` - Dark variant
- [ ] `public/logo/tha-logo-light.svg` - Light variant

### Favicon Files (Priority 1)
- [ ] `public/favicon.svg` - Modern SVG favicon
- [ ] `public/favicon.ico` - Traditional favicon
- [ ] `public/apple-touch-icon.png` - iOS icon
- [ ] `public/android-chrome-192.png` - Android
- [ ] `public/android-chrome-512.png` - Android splash
- [ ] `public/og-image.jpg` - Social preview
- [ ] `public/site.webmanifest` - PWA config

### Image Folders (Priority 2)
- [ ] `public/images/hero/` - Create folder
- [ ] `public/images/campaigns/` - Create folder
- [ ] `public/images/team/` - Create folder
- [ ] `public/images/partners/` - Create folder
- [ ] `public/images/stories/` - Create folder
- [ ] `public/images/government/` - Create folder
- [ ] `public/images/misc/` - Create folder

### Critical Images (Priority 2)
- [ ] Hero background: `public/images/hero/hero-bg-lg.jpg`
- [ ] Founder: `public/images/team/shaibu-issa.jpg`
- [ ] Team 2: `public/images/team/associate-director.jpg`
- [ ] Team 3: `public/images/team/general-secretary.jpg`

### Campaign Images (Priority 3)
- [ ] 3 campaign icons (SVG, 400×400px)
- [ ] 3 campaign feature images (JPG, 1200×800px)

### Partner Logos (Priority 3)
- [ ] 6 partner logos (SVG, 250×100px)

### Story Images (Priority 4)
- [ ] 4 avatars (JPG, 150×150px)
- [ ] 4 featured images (JPG, 800×600px)

---

## 🔗 Data File Usage

### campaigns.json Usage
```javascript
import campaigns from '@/data/campaigns.json'

// In Home.jsx
campaigns.map(campaign => (
  <div key={campaign.id}>
    <h3>{campaign.name}</h3>
    <p>{campaign.metrics.peopleReached || campaign.metrics.youthReached}</p>
  </div>
))

// In Campaigns.jsx
const campaign = campaigns.find(c => c.id === 'kapime')
```

### team.json Usage
```javascript
import team from '@/data/team.json'

// In About.jsx
team.team.map(member => (
  <div key={member.id}>
    <img src={member.photo} alt={member.name} />
    <h3>{member.name}</h3>
    <p>{member.bioFull}</p>
  </div>
))

// Founder info
const founder = team.team[0]  // Shaibu Issa
```

### impact.json Usage
```javascript
import impact from '@/data/impact.json'

// Timeline
impact.yearOneTimeline.map(milestone => ...)

// Metrics
const totalReached = impact.impactMetrics.total.peopleReached
```

### stories.json Usage
```javascript
import stories from '@/data/stories.json'

// All stories
stories.stories.map(story => ...)

// Individual story
const story = stories.stories[0]  // Fatima
```

---

## ✅ REFERENCE MATRIX

| Task | File Location | Data Source | Documentation |
|------|---------------|-------------|----------------|
| Add Header logo | `src/components/Header.jsx` | `/logo/tha-logo.svg` | LOGO_FAVICON_GUIDE.md |
| Add Footer logo | `src/components/Footer.jsx` | `/logo/tha-logo-light.svg` | LOGO_FAVICON_GUIDE.md |
| Build Homepage | `src/pages/Home.jsx` | campaigns.json, impact.json | WEBSITE_REDESIGN_STRUCTURE.md |
| Build About page | `src/pages/About.jsx` | team.json, partners.json | WEBSITE_REDESIGN_STRUCTURE.md |
| Build Campaigns | `src/pages/Campaigns.jsx` | campaigns.json | WEBSITE_REDESIGN_STRUCTURE.md |
| Build Impact page | NEW PAGE | impact.json | WEBSITE_REDESIGN_STRUCTURE.md |
| Build Stories page | NEW PAGE | stories.json | WEBSITE_REDESIGN_STRUCTURE.md |
| Upload images | `public/images/*` | See IMAGE_UPLOAD_REFERENCE.md | IMAGE_UPLOAD_REFERENCE.md |
| Create favicons | `public/*` | Logo files | LOGO_FAVICON_GUIDE.md |
| Update index.html | `public/index.html` | favicon config | LOGO_FAVICON_GUIDE.md |

---

**Use this map to quickly find what you're looking for!**

*Last updated: April 5, 2026 | Ready to build: YES ✅*
