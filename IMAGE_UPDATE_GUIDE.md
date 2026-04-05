# THA Website - Image & Stats Update Guide

## 📊 Update Impact Statistics

Edit: `src/data/statsData.js`

```javascript
export const impactStats = {
  peopleReached: 5000,      // Update this number
  partnerships: 12,          // Update this number
  regions: 8,                // Update this number
  yearsActive: 1,            // Manual override (auto-calculates from 2025)
  volunteers: 25,            // For future use
  projects: 15               // For future use
};
```

**Auto-update:** Years Active calculates automatically from 2025 foundation year

## 🖼️ Replace Images

### Logo
- File: `public/logo.png`
- Your logo provided - just add to public folder

### Hero Section
File: `src/pages/Home.jsx` - Line ~70
```jsx
{/* TODO: Replace with your healthcare photo - recommended 1920x1080px */}
<img src="YOUR_IMAGE_URL" alt="Healthcare in Tanzania" />
```

### About Page
File: `src/pages/About.jsx` - Line ~50
```jsx
{/* TODO: Replace with THA team photo */}
<img src="YOUR_IMAGE_URL" alt="THA Team" />
```

### News Articles
File: `src/data/newsData.js`
- Update `image:` URLs for each article

### Projects
File: `src/pages/Projects.jsx`
- Update `images:` array for each project

## 🎨 Brand Colors (Already Applied)
- Orange: #ff9c1a
- Green: #26b805
- Blue: #024d85
- Black: #000000

## ✅ Icons
All icons now using Material Design OUTLINED style with THA brand colors
