# THA Website - Image Directory & Upload Guide

## 📁 Image Directory Structure

```
public/images/
├── hero/
│   ├── hero-bg-xl.jpg (2560×1440px)
│   ├── hero-bg-lg.jpg (1920×1080px)
│   ├── hero-bg-md.jpg (1366×768px)
│   ├── hero-bg-sm.jpg (768×432px)
│   └── hero-bg-xs.jpg (375×667px)
│
├── campaigns/
│   ├── kapime-icon.svg (400×400px)
│   ├── kapime-feature.jpg (600×400px)
│   ├── kapime-testing.jpg (1200×800px)
│   │
│   ├── life-unlocked-icon.svg (400×400px)
│   ├── life-unlocked-feature.jpg (600×400px)
│   ├── life-unlocked-youth.jpg (1200×800px)
│   │
│   ├── talk-to-heal-icon.svg (400×400px)
│   ├── talk-to-heal-feature.jpg (600×400px)
│   └── talk-to-heal-group.jpg (1200×800px)
│
├── team/
│   ├── shaibu-issa.jpg (400×500px)
│   ├── shaibu-issa-quote.jpg (1200×800px)
│   ├── associate-director.jpg (400×500px)
│   ├── general-secretary.jpg (400×500px)
│   ├── team-member-4.jpg (400×500px)
│   └── team-group.jpg (1600×900px)
│
├── partners/
│   ├── who-logo.svg or .png (250×100px)
│   ├── global-liver-logo.svg (250×100px)
│   ├── wha-logo.svg (250×100px)
│   ├── taskforce-logo.svg (250×100px)
│   ├── abaché-logo.svg (250×100px)
│   ├── ministry-health-logo.svg (250×100px)
│   └── partners-grid.jpg (1600×400px)
│
├── stories/
│   ├── story-1-avatar.jpg (150×150px)
│   ├── story-1-featured.jpg (800×600px)
│   ├── story-2-avatar.jpg (150×150px)
│   ├── story-2-featured.jpg (800×600px)
│   ├── story-3-avatar.jpg (150×150px)
│   ├── story-3-featured.jpg (800×600px)
│   ├── story-4-avatar.jpg (150×150px)
│   └── story-4-featured.jpg (800×600px)
│
├── government/
│   ├── ministry-partnership.jpg (1200×800px)
│   ├── permanent-secretary-quote.jpg (800×600px)
│   └── government-seal.svg (300×300px)
│
└── misc/
    ├── annual-report-cover.pdf
    ├── timeline-visual.svg
    ├── impact-dashboard-bg.jpg
    └── testimonial-gradient.svg
```

## 🎨 Image Specifications by Type

### Hero Section Images
- **Resolution**: 1920×1080px (desktop), responsive variants for mobile
- **Format**: WebP (with JPG fallback)
- **File Size**: < 300KB (optimized)
- **Purpose**: Background hero section with gradient overlay
- **Optimization**: Use TinyPNG, ImageOptim, or Cloudinary

### Campaign Icons
- **Resolution**: 400×400px
- **Format**: SVG (preferred) or PNG with transparency
- **File Size**: < 50KB
- **Purpose**: Campaign section icons (KAPIME, Life Unlocked, Talk to Heal)

### Campaign Feature Images
- **Resolution**: 
  - Small cards: 600×400px
  - Full width: 1200×800px
- **Format**: WebP or JPG
- **File Size**: < 200KB each
- **Aspect Ratio**: 3:2
- **Purpose**: Show campaign activities in action

### Team Photos
- **Resolution**: 400×500px (portrait)
- **Format**: JPG with quality 85%
- **File Size**: < 100KB each
- **Background**: Solid color or subtle gradient
- **Crop**: Head and shoulders, centered
- **Purpose**: Team member profiles

### Partner Logos
- **Resolution**: 250×100px or square 250×250px
- **Format**: SVG (preferred) or PNG with transparency
- **Background**: Transparent
- **File Size**: < 30KB
- **Purpose**: Partner grid display

### Story Images
- **Avatar**: 150×150px, square
- **Featured**: 800×600px, 4:3 ratio
- **Format**: JPG
- **File Size**: < 100KB each
- **Purpose**: Beneficiary stories (use pseudonyms for privacy)

### Government Partnership
- **Ministry Logo**: 250×150px or 300×300px
- **Partnership Image**: 1200×800px
- **Format**: SVG for logos, JPG for photos
- **File Size**: < 100KB each

## 🖼️ Where Images Go in the Code

### Homepage (`src/pages/Home.jsx`)
```jsx
// Hero section background
<div className="bg-cover" style={{backgroundImage: 'url(/images/hero/hero-bg-lg.jpg)'}}>

// Campaign icons
<img src="/images/campaigns/kapime-icon.svg" alt="KAPIME" />
<img src="/images/campaigns/life-unlocked-icon.svg" alt="Life Unlocked" />
<img src="/images/campaigns/talk-to-heal-icon.svg" alt="Talk to Heal" />

// Campaign feature images (optional)
<img src="/images/campaigns/kapime-testing.jpg" alt="KAPIME Testing" />
```

### About Page (`src/pages/About.jsx`)
```jsx
// Founder photo
<img src="/images/team/shaibu-issa.jpg" alt="Shaibu Issa, Founder" className="w-96 rounded-lg" />

// Team members
team.map(member => (
  <img src={`/images/team/${member.photoFile}`} alt={member.name} />
))

// Team group photo (optional)
<img src="/images/team/team-group.jpg" alt="THA Team" className="w-full rounded-lg" />
```

### Campaigns Page (`src/pages/Campaigns.jsx`)
```jsx
// Campaign feature images
<img src="/images/campaigns/kapime-feature.jpg" alt="KAPIME Campaign" />
<img src="/images/campaigns/life-unlocked-feature.jpg" alt="Life Unlocked" />
<img src="/images/campaigns/talk-to-heal-feature.jpg" alt="Talk to Heal" />

// Campaign icons
<img src="/images/campaigns/{campaign}-icon.svg" alt={campaignName} />
```

### Stories Page (`src/pages/Stories.jsx`)
```jsx
// Story avatar (circular)
<img src={`/images/stories/story-${index}-avatar.jpg`} alt={story.name} className="w-24 h-24 rounded-full" />

// Story featured image
<img src={`/images/stories/story-${story.id}-featured.jpg`} alt={story.title} className="w-full rounded-lg" />
```

### Partner Logos (`src/components/PartnersSection.jsx`)
```jsx
// Partner logos grid
partners.map(partner => (
  <img src={`/images/partners/${partner.logoFile}`} alt={partner.name} />
))
```

### Government Partnership (`src/pages/GovernmentPartnership.jsx`)
```jsx
// Ministry logo
<img src="/images/government/ministry-health-logo.svg" alt="Tanzania Ministry of Health" />

// Partnership photo
<img src="/images/government/ministry-partnership.jpg" alt="Government Partnership" />
```

## 📤 How to Upload Images

### Option 1: Direct File System (Recommended for Development)
1. Create the folder structure under `public/images/`
2. Upload images directly to their respective folders
3. Reference them in components as `/images/folder/filename.ext`

### Option 2: Cloudinary (Recommended for Production)
1. Create free account at https://cloudinary.com
2. Upload images to your Cloudinary account
3. Use URLs like: `https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1234567890/tha/image-name.jpg`
4. Update components to use Cloudinary URLs
5. Benefits: Auto-optimization, responsive variants, CDN delivery

### Option 3: GitHub (Free, Limited Storage)
1. Add images to `public/images/` folder
2. Commit and push to GitHub
3. GitHub serves them via CDN (github.com/raw...)
4. Benefits: Version control, backup, free

### My Recommendation for Your Workflow:
1. **Development**: Use local `public/images/` folder (Option 1)
2. **Production**: Switch to Cloudinary URLs for performance
3. **Naming**: Keep consistent naming as shown above
4. **Optimization**: Compress images before uploading using TinyPNG or ImageOptim

## 🔒 Privacy & Image Guidelines

### For Team Photos
- Use professional headshots
- Consistent background and lighting
- Neutral or branded background color
- 400×500px portrait orientation

### For Beneficiary Stories
- Use pseudonyms/nicknames (never full names for privacy)
- Use avatar images or silhouettes if real photos unavailable
- Get explicit consent before publishing
- Consider using illustrated avatars instead of photos

### For Campaign Images
- Show impact and action (people testing, youth learning, support groups)
- Diverse representation of Tanzanian communities
- Professional quality, relevant to campaign message
- High-resolution for marketing use

## 📋 Image Upload Checklist

- [ ] Create `public/images/` folder structure
- [ ] Optimize all images (< file sizes listed above)
- [ ] Verify image dimensions match specifications
- [ ] Use proper naming conventions (lowercase, hyphens)
- [ ] Add alt text in all HTML/JSX components
- [ ] Test images display correctly on mobile (375px) and desktop (1920px)
- [ ] Compress WebP variants for hero section
- [ ] Create SVG logos for campaigns and partners
- [ ] Verify all image paths are relative (/images/...)
- [ ] Test image loading performance

## 🎨 Image Naming Convention

**Format**: `{section}-{type}-{descriptor}.{ext}`

**Examples**:
- `hero-bg-lg.jpg` (Hero background, large)
- `campaign-kapime-icon.svg` (Campaign icon)
- `team-shaibu-founder.jpg` (Team member)
- `story-malaria-avatar.jpg` (Story avatar)
- `partner-who-logo.svg` (Partner logo)

## 🚀 Next Steps

1. **Create folder structure** in `public/images/`
2. **Gather images** from THA current website and create new ones
3. **Optimize images** using TinyPNG or similar tool
4. **Upload images** to appropriate folders
5. **Update component files** with image paths
6. **Test on mobile & desktop** to verify responsive display
7. **Consider Cloudinary** for production deployment

---

**Questions?** Reference this guide when building components that need images.
