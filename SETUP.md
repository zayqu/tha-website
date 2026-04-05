# THA Website - Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Contact Form
Edit `src/data/thaData.js` and replace `YOUR_WEB3FORMS_KEY` with your free key from:
https://web3forms.com (takes 30 seconds, no credit card)

This allows contact form to send emails to both:
- info@tzhealthalliance.or.tz
- tzhealthalliance@gmail.com

### 3. Add Your Logo
Replace `public/logo.png` with your actual logo file

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 📧 Contact Form Setup (IMPORTANT!)

1. Go to https://web3forms.com
2. Enter your email
3. Get access key
4. Paste key in `src/data/thaData.js` line 40

## 🎯 New Features Added

✅ **Real THA Data** - Integrated from your website
✅ **Projects Page** - Showcase your work with photos
✅ **Working Contact Form** - Sends to both emails
✅ **Volunteer Confirmation** - Auto-reply message
✅ **Bank Details Only** - Removed mobile money
✅ **Security** - No backend, static files only
✅ **Mobile First** - Optimized for phones

## 📱 Pages

1. **Home** - Hero, stats, focus areas
2. **About** - Mission, team, timeline
3. **Projects** - Your work showcased (NEW!)
4. **Get Involved** - Volunteer, donate, partner
5. **Academy** - Health resources
6. **News** - Latest updates
7. **Contact** - Working form

## 🔒 Security Features

- No database = No SQL injection
- Static files only
- Form validation
- HTTPS enforced
- No user passwords
- Secure email via Web3Forms API

## 📸 Adding Projects

Edit `src/pages/Projects.jsx` - Add your projects with:
- Title, description
- Photos (upload to cloud, use URLs)
- Location, date, impact stats
- Category (filters automatically)

## 🌐 Deploy to cPanel

1. Build: `npm run build`
2. Upload `dist/` folder contents to `public_html`
3. Upload `.htaccess` from `public/` folder
4. Done!

## 📝 TODO Before Launch

- [ ] Get Web3Forms key
- [ ] Add your logo.png
- [ ] Update projects with real data
- [ ] Test contact form
- [ ] Add more project photos

## 💡 Need Help?

Contact: info@tzhealthalliance.or.tz
