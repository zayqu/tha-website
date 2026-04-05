# 🎯 THA Logo & Favicon Setup Guide

## 📍 Where Everything Goes

```
Your website root structure:

tha-website/
├── public/
│   ├── favicon.ico              ← Browser tab icon (32×32px)
│   ├── favicon.svg              ← Modern SVG favicon
│   ├── apple-touch-icon.png     ← iPhone home screen icon (180×180px)
│   ├── android-chrome-192.png   ← Android home screen icon
│   ├── android-chrome-512.png   ← Android splash screen icon
│   ├── site.webmanifest         ← PWA metadata (auto-generated)
│   ├── robots.txt               ← SEO - tell search engines what to crawl
│   ├── sitemap.xml              ← SEO - list all pages
│   │
│   ├── logo/                    ← NEW FOLDER - Add here
│   │   ├── tha-logo.svg         ← Main logo (for header)
│   │   ├── tha-logo-dark.svg    ← Dark variant (if needed)
│   │   ├── tha-logo-light.svg   ← Light variant (for dark backgrounds)
│   │   ├── tha-logo-square.svg  ← Square version (for favicon base)
│   │   ├── tha-logo-full.svg    ← Full logo with text
│   │   └── tha-logo-mark.svg    ← Just the mark (icon only)
│   │
│   ├── images/
│   │   ├── hero/
│   │   ├── campaigns/
│   │   ├── team/
│   │   ├── partners/
│   │   ├── stories/
│   │   ├── government/
│   │   └── misc/
│   │
│   ├── index.html
│   └── ...other files
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── assets/
│   │   └── logo/                ← ALTERNATIVE: Store here instead
│   │       ├── tha-logo.svg
│   │       └── ...other logos
│   └── ...
```

---

## 🎨 Logo Specifications

### Main Logo Placement
| Location | Usage | Dimensions | Where in Code |
|----------|-------|------------|---------------|
| **Header/Navigation** | Brand identity | 40-60px height | `src/components/Header.jsx` |
| **Footer** | Brand consistency | 40-60px height | `src/components/Footer.jsx` |
| **Homepage Hero** | Visual branding | 80-120px height | `src/pages/Home.jsx` |
| **About Page** | Organization identity | 100-150px height | `src/pages/About.jsx` |
| **Social Media Share** | OG image (1200×630px) | Open Graph image | `index.html` head |

### Logo Variants Needed
1. **Full Logo** (with text THA)
   - Size: 400×100px minimum
   - Format: SVG or PNG
   - Use in: Header, footer, formal documents

2. **Logo Mark Only** (just the symbol/icon)
   - Size: 200×200px minimum
   - Format: SVG
   - Use in: Favicon, profile pictures, social media avatars

3. **Dark Version** (for light backgrounds)
   - Same sizes as above
   - High contrast on light backgrounds

4. **Light Version** (for dark backgrounds)
   - Same sizes as above
   - High contrast on dark backgrounds

---

## 🔗 Favicon Setup (In `public/index.html`)

### Current Setup
Your `index.html` should have these tags in the `<head>`:

```html
<head>
  <!-- Essential Meta Tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Tanzania Health Alliance - Combating Hepatitis, HIV & Mental Health" />
  <title>Tanzania Health Alliance - THA</title>

  <!-- Favicon & App Icons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  
  <!-- Android Theme Color -->
  <meta name="theme-color" content="#024d85" />
  
  <!-- Social Media (Open Graph) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tzhealthalliance.or.tz/" />
  <meta property="og:title" content="Tanzania Health Alliance - THA" />
  <meta property="og:description" content="Tanzania's premier health NGO combating Hepatitis, HIV & Mental Health" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://tzhealthalliance.or.tz/" />
  <meta name="twitter:title" content="Tanzania Health Alliance" />
  <meta name="twitter:description" content="Combating Hepatitis, HIV & Mental Health in Tanzania" />
  <meta name="twitter:image" content="/og-image.jpg" />
</head>
```

---

## 📦 Favicon Files to Create/Add

### 1. **favicon.svg** (Modern, scalable)
- **Location**: `public/favicon.svg`
- **Size**: 100×100px (SVG scales automatically)
- **Format**: SVG
- **Source**: Export from your logo mark (symbol only)
- **Colors**: Use primary brand colors

```xml
<!-- Example structure (replace with actual logo) -->
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#024d85"/>
  <text x="50" y="60" font-size="60" font-weight="bold" text-anchor="middle" fill="#26b805">
    TH
  </text>
</svg>
```

### 2. **favicon.ico** (Traditional, for older browsers)
- **Location**: `public/favicon.ico`
- **Size**: 32×32px (primary), also includes 16×16px
- **Format**: ICO file
- **Tool**: Use favicon.io or similar to convert PNG to ICO
- **Why**: Some older browsers still look for this

### 3. **apple-touch-icon.png** (iPhone home screen)
- **Location**: `public/apple-touch-icon.png`
- **Size**: 180×180px
- **Format**: PNG with transparency
- **Background**: White or transparent
- **Purpose**: When iPhone users add website to home screen
- **Important**: iOS adds a glossy effect automatically

### 4. **android-chrome-192.png** (Android home screen)
- **Location**: `public/android-chrome-192.png`
- **Size**: 192×192px
- **Format**: PNG with transparency
- **Background**: Transparent or your app color
- **Purpose**: Android home screen icon

### 5. **android-chrome-512.png** (Android splash screen)
- **Location**: `public/android-chrome-512.png`
- **Size**: 512×512px
- **Format**: PNG with transparency
- **Background**: Transparent
- **Purpose**: Android app splash screen, high-res icon

### 6. **og-image.jpg** (Social media preview)
- **Location**: `public/og-image.jpg`
- **Size**: 1200×630px
- **Format**: JPG
- **Content**: Your logo + THA name + tagline on branded background
- **Colors**: Dark Blue (#024d85) background with Green (#26b805) accents
- **Purpose**: Shows when link is shared on Facebook, LinkedIn, Twitter, etc.

---

## 🛠️ How to Create These Files

### Option 1: Use favicon.io (Easiest)
1. Go to https://favicon.io
2. Upload your logo (PNG or SVG)
3. Customize colors (use #024d85, #26b805, #ff9c1a)
4. Download the complete package
5. Extract to `public/` folder

### Option 2: Use Figma (Professional)
1. Create 192×192px square in Figma
2. Add your logo mark (symbol only, centered)
3. Export as PNG (192×192px)
4. Use favicon.io to convert to all sizes
5. Or manually export each size

### Option 3: Command Line (Advanced)
```bash
# Convert logo.png to all sizes using ImageMagick
convert logo.png -define icon:auto-resize=256,192,128,96,64,48,32,16 favicon.ico

# Create square version for Apple icon
convert logo.png -resize 180x180 -background white -gravity center -extent 180x180 apple-touch-icon.png
```

---

## 📄 site.webmanifest (PWA Configuration)

Create `public/site.webmanifest`:

```json
{
  "name": "Tanzania Health Alliance",
  "short_name": "THA",
  "description": "Tanzania's premier health NGO combating Hepatitis, HIV & Mental Health",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#024d85",
  "icons": [
    {
      "src": "/android-chrome-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ],
  "screenshots": [
    {
      "src": "/og-image.jpg",
      "sizes": "1200x630",
      "type": "image/jpeg"
    }
  ]
}
```

---

## 📍 Logo Usage in Code

### Header Component
```jsx
// src/components/Header.jsx
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-subtle">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo/tha-logo.svg" 
            alt="Tanzania Health Alliance Logo"
            className="h-12 w-auto"
          />
        </Link>
        
        {/* Navigation links */}
        <ul className="flex gap-8">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          {/* ... more links ... */}
        </ul>
      </nav>
    </header>
  )
}
```

### Footer Component
```jsx
// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          {/* Logo section */}
          <div>
            <img 
              src="/logo/tha-logo-light.svg" 
              alt="THA Logo"
              className="h-12 mb-4"
            />
            <p>Tanzania Health Alliance - Building a healthier Tanzania</p>
          </div>
          
          {/* ... other footer sections ... */}
        </div>
      </div>
    </footer>
  )
}
```

### Social Media Meta Tags
```jsx
// In index.html <head> or via React Helmet
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="/og-image.jpg" />
```

---

## 📋 Logo & Favicon Checklist

### Create These Files
- [ ] `public/favicon.svg` (100×100px SVG)
- [ ] `public/favicon.ico` (32×32px + 16×16px)
- [ ] `public/apple-touch-icon.png` (180×180px PNG)
- [ ] `public/android-chrome-192.png` (192×192px PNG)
- [ ] `public/android-chrome-512.png` (512×512px PNG)
- [ ] `public/og-image.jpg` (1200×630px JPG)
- [ ] `public/site.webmanifest` (PWA config)

### Create These Logo Variants (in `public/logo/`)
- [ ] `tha-logo.svg` (full logo with text)
- [ ] `tha-logo-mark.svg` (just the symbol)
- [ ] `tha-logo-dark.svg` (dark variant)
- [ ] `tha-logo-light.svg` (light variant)

### Update These Files
- [ ] `public/index.html` - Add favicon/manifest links
- [ ] `src/components/Header.jsx` - Add logo image
- [ ] `src/components/Footer.jsx` - Add logo image
- [ ] Update any pages that reference logo

### Test
- [ ] Favicon shows in browser tab
- [ ] Logo appears in Header
- [ ] Logo appears in Footer
- [ ] Open Graph image shows when link shared
- [ ] Mobile icon shows when adding to home screen

---

## 🎨 Logo Design Recommendations

### Logo Should Include
- ✅ THA initials or full name
- ✅ Health symbol (e.g., heartbeat, cross, health plus)
- ✅ Colors: Primary blue (#024d85) + secondary green (#26b805)
- ✅ Modern, clean design
- ✅ Scalable to small sizes (favicon = 32px)
- ✅ Works in both full color and monochrome

### Logo Should NOT Include
- ❌ Too many details (won't show at 32×32px)
- ❌ Very thin lines (disappear at small sizes)
- ❌ Complex gradients (don't scale well)
- ❌ Too many colors (hard to distinguish at small sizes)

### Logo Files Format
- **Web**: SVG (scales perfectly, smallest file)
- **Backup**: PNG with transparency (for older browsers)
- **Print**: PDF or AI file (separate from web)
- **Social**: PNG or JPG (for sharing)

---

## 📁 Recommended Folder Structure

```
public/
├── favicon.svg                 ← Modern favicon
├── favicon.ico                 ← Traditional favicon
├── apple-touch-icon.png        ← iOS home screen
├── android-chrome-192.png      ← Android home screen
├── android-chrome-512.png      ← Android splash
├── og-image.jpg                ← Social media preview
├── site.webmanifest            ← PWA manifest
│
├── logo/                       ← NEW FOLDER
│   ├── tha-logo.svg            ← Main logo (full)
│   ├── tha-logo-mark.svg       ← Logo symbol only
│   ├── tha-logo-dark.svg       ← Dark variant
│   ├── tha-logo-light.svg      ← Light variant
│   └── README.md               ← Logo usage guide
│
├── images/                     ← Existing folder
│   ├── hero/
│   ├── campaigns/
│   ├── team/
│   ├── partners/
│   ├── stories/
│   ├── government/
│   └── misc/
│
├── index.html
└── robots.txt
```

---

## 🚀 Quick Start - Add Logos Today

1. **Create logo folder**: `mkdir public/logo`
2. **Design/export logo**: Create 4 SVG versions
3. **Generate favicons**: Use favicon.io or command line
4. **Add to public/**: Copy all favicon files
5. **Update HTML**: Add favicon/manifest links to index.html
6. **Update components**: Add logo to Header.jsx, Footer.jsx
7. **Test**: Check browser tab, sharing, mobile home screen
8. **Commit**: Push all new logo files to git

---

## 📊 Complete File List

| File | Size | Location | Purpose |
|------|------|----------|---------|
| favicon.svg | <5KB | `public/` | Modern browser tab icon |
| favicon.ico | <10KB | `public/` | Traditional browser tab icon |
| apple-touch-icon.png | 20-50KB | `public/` | iOS home screen |
| android-chrome-192.png | 20-50KB | `public/` | Android home screen |
| android-chrome-512.png | 50-100KB | `public/` | Android splash |
| og-image.jpg | 100-150KB | `public/` | Social sharing preview |
| site.webmanifest | <2KB | `public/` | PWA configuration |
| tha-logo.svg | <20KB | `public/logo/` | Main logo (full) |
| tha-logo-mark.svg | <10KB | `public/logo/` | Logo symbol only |
| tha-logo-dark.svg | <20KB | `public/logo/` | Dark variant |
| tha-logo-light.svg | <20KB | `public/logo/` | Light variant |

**Total estimated size**: ~300-400KB (compressed, all files)

---

**Next Steps:**
1. Design/gather your THA logo
2. Create all favicon variants
3. Add logos to components
4. Test in multiple browsers
5. Share link to verify social media preview

Questions? See IMAGE_DIRECTORY_GUIDE.md for complete image organization.
