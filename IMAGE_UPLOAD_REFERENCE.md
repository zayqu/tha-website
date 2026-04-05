# 📸 Image Upload Reference - Where Every Image Goes

## Quick Visual Map

```
Your website images go in: public/images/

HOMEPAGE needs:
├── /hero/hero-bg-lg.jpg          → Hero section background
├── /campaigns/kapime-icon.svg     → KAPIME campaign icon
├── /campaigns/life-unlocked-icon.svg
├── /campaigns/talk-to-heal-icon.svg
└── /partners/{logo}.svg           → Partner logos

ABOUT PAGE needs:
├── /team/shaibu-issa.jpg         → Founder portrait (400×500px)
├── /team/associate-director.jpg  → Team member 2
├── /team/general-secretary.jpg   → Team member 3
└── /partners/{logos}.svg         → All 6 partner logos

CAMPAIGNS PAGE needs:
├── /campaigns/kapime-feature.jpg
├── /campaigns/life-unlocked-feature.jpg
└── /campaigns/talk-to-heal-feature.jpg

STORIES PAGE needs:
├── /stories/story-1-avatar.jpg   → Fatima's avatar
├── /stories/story-1-featured.jpg → Fatima's story image
├── /stories/story-2-avatar.jpg   → Hassan's avatar
├── /stories/story-2-featured.jpg
├── /stories/story-3-avatar.jpg   → Amina's avatar
├── /stories/story-3-featured.jpg
├── /stories/story-4-avatar.jpg   → David's avatar
└── /stories/story-4-featured.jpg

GOVERNMENT PARTNERSHIP needs:
├── /government/ministry-health-logo.svg
└── /government/ministry-partnership.jpg
```

---

## 📋 Image Checklist by Page

### HOMEPAGE
- [ ] Hero background: 1920×1080px JPG
- [ ] KAPIME icon: 400×400px SVG
- [ ] Life Unlocked icon: 400×400px SVG
- [ ] Talk to Heal icon: 400×400px SVG
- [ ] WHO logo: 250×100px SVG
- [ ] WHA logo: 250×100px SVG
- [ ] Ministry of Health logo: 250×100px SVG

**Location**: `/public/images/hero/`, `/campaigns/`, `/partners/`

---

### ABOUT PAGE
- [ ] Shaibu Issa: 400×500px JPG portrait
- [ ] Team member 2: 400×500px JPG portrait
- [ ] Team member 3: 400×500px JPG portrait
- [ ] WHO logo: 250×100px SVG
- [ ] Global Liver Institute: 250×100px SVG
- [ ] World Hepatitis Alliance: 250×100px SVG
- [ ] Task Force: 250×100px SVG
- [ ] Abaché: 250×100px SVG
- [ ] Ministry of Health: 250×100px SVG

**Location**: `/public/images/team/`, `/partners/`

---

### CAMPAIGNS PAGE
- [ ] KAPIME feature: 1200×800px JPG
- [ ] KAPIME icon: 400×400px SVG
- [ ] Life Unlocked feature: 1200×800px JPG
- [ ] Life Unlocked icon: 400×400px SVG
- [ ] Talk to Heal feature: 1200×800px JPG
- [ ] Talk to Heal icon: 400×400px SVG

**Location**: `/public/images/campaigns/`

---

### IMPACT PAGE
- [ ] Timeline background (optional): 1600×900px JPG
- [ ] Timeline milestones graphic (optional SVG)

**Location**: `/public/images/misc/`

---

### STORIES PAGE
- [ ] Fatima avatar: 150×150px JPG circular
- [ ] Fatima featured: 800×600px JPG
- [ ] Hassan avatar: 150×150px JPG circular
- [ ] Hassan featured: 800×600px JPG
- [ ] Amina avatar: 150×150px JPG circular
- [ ] Amina featured: 800×600px JPG
- [ ] David avatar: 150×150px JPG circular
- [ ] David featured: 800×600px JPG

**Location**: `/public/images/stories/`

---

### GOVERNMENT PARTNERSHIP PAGE (Optional)
- [ ] Ministry of Health logo: 250×150px SVG
- [ ] Partnership photo: 1200×800px JPG
- [ ] Government seal (optional): 300×300px SVG

**Location**: `/public/images/government/`

---

### FOOTER (All Pages)
- [ ] Social media icons (optional): Handled by Icon component
- [ ] THA logo (optional): 200×50px SVG or PNG

**Location**: `/public/images/misc/` (or component-based)

---

## 🎬 Image Usage in Components (Code Reference)

### Homepage
```jsx
// Hero background
<div style={{backgroundImage: 'url(/images/hero/hero-bg-lg.jpg)'}}>

// Campaign icons
<img src="/images/campaigns/kapime-icon.svg" alt="KAPIME" />

// Partner logos in footer
partners.map(p => <img src={`/images/partners/${p.logoFile}`} />)
```

### About Page
```jsx
// Founder photo
<img src="/images/team/shaibu-issa.jpg" alt="Shaibu Issa" />

// Team members
team.map(m => <img src={`/images/team/${m.photoFile}`} />)

// Partner grid
partners.map(p => <img src={`/images/partners/${p.logoFile}`} />)
```

### Campaigns Page
```jsx
// Campaign feature image
<img src="/images/campaigns/kapime-feature.jpg" alt="KAPIME" />
<img src="/images/campaigns/life-unlocked-feature.jpg" alt="Life Unlocked" />
<img src="/images/campaigns/talk-to-heal-feature.jpg" alt="Talk to Heal" />
```

### Stories Page
```jsx
// Story avatar (circular)
<img src={`/images/stories/story-${index}-avatar.jpg`} alt={name} className="rounded-full" />

// Story featured image
<img src={`/images/stories/story-${id}-featured.jpg`} alt={title} />
```

---

## 📐 Image Dimensions Summary

| Image Type | Width | Height | Format | Location |
| --- | --- | --- | --- | --- |
| Hero background | 1920 | 1080 | JPG | `/hero/` |
| Campaign icons | 400 | 400 | SVG | `/campaigns/` |
| Campaign features | 1200 | 800 | JPG | `/campaigns/` |
| Team portraits | 400 | 500 | JPG | `/team/` |
| Team group | 1600 | 900 | JPG | `/team/` |
| Partner logos | 250 | 100 | SVG | `/partners/` |
| Story avatars | 150 | 150 | JPG | `/stories/` |
| Story featured | 800 | 600 | JPG | `/stories/` |
| Government logos | 250 | 150 | SVG | `/government/` |
| Government images | 1200 | 800 | JPG | `/government/` |

---

## 🔄 Upload Options

### Option 1: Local Files (For Development)
```
1. Create folders: mkdir public\images\{hero,campaigns,team,partners,stories,government,misc}
2. Add images to each folder
3. Reference as: /images/hero/hero-bg-lg.jpg
```

### Option 2: Cloudinary (For Production)
```
1. Create free account: https://cloudinary.com
2. Upload images to your cloud
3. Get URLs like: https://res.cloudinary.com/YOUR_CLOUD/image/upload/tha/image-name.jpg
4. Update image paths in components
```

### Option 3: GitHub (For Version Control)
```
1. Add to public/images/ locally
2. Commit and push to GitHub
3. Images available via CDN
```

**Recommendation**: Start with Option 1 (local), switch to Option 2 (Cloudinary) for production.

---

## 🖼️ How to Reference Images in Components

### Simple Image
```jsx
<img 
  src="/images/team/shaibu-issa.jpg" 
  alt="Shaibu Issa, Founder" 
  className="w-96 rounded-lg"
/>
```

### Background Image
```jsx
<div 
  className="h-96 bg-cover bg-center"
  style={{backgroundImage: 'url(/images/hero/hero-bg-lg.jpg)'}}
>
  Content here
</div>
```

### From Data File
```jsx
import team from '@/data/team.json'

{team.map(member => (
  <img 
    key={member.id}
    src={member.photo}  // e.g., "/images/team/shaibu-issa.jpg"
    alt={member.name}
  />
))}
```

### Responsive Images
```jsx
<picture>
  <source media="(min-width: 1920px)" srcSet="/images/hero/hero-bg-xl.jpg" />
  <source media="(min-width: 768px)" srcSet="/images/hero/hero-bg-lg.jpg" />
  <img src="/images/hero/hero-bg-sm.jpg" alt="Hero" />
</picture>
```

---

## ✅ Before Going Live

- [ ] All images in correct folders
- [ ] Image dimensions match specs
- [ ] File sizes optimized (< specifications)
- [ ] All alt text added in HTML/JSX
- [ ] Images display correctly on mobile (375px)
- [ ] Images display correctly on desktop (1920px)
- [ ] No broken image links
- [ ] Performance tested (load time < 3s)

---

## 🎯 Priority Images (Start Here)

If you only have time for some images, prioritize:
1. **Hero background** - Most visible
2. **Team photos** (Shaibu + 2 others) - Builds credibility
3. **Campaign icons** (3 SVGs) - Visual identity
4. **Partner logos** (6 SVGs) - Shows partnerships
5. **Story avatars** (4 JPGs) - Humanizes impact

These 15 images will make your site 80% complete.

---

## 📞 Need Help?

Reference this document when:
- Building a component that needs images
- Uploading new images
- Troubleshooting broken image links
- Optimizing for performance
- Testing responsive display

**All paths shown work with**: `url(/images/folder/filename.ext)`
