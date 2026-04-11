# Taqwa Humanitarian Association Website

A modern, responsive website built with React, Vite, and TailwindCSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
tha-website/
├── public/              # Static assets
│   ├── images/         # Image files
│   ├── logo/           # Logo files
│   └── favicon.svg     # Favicon
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── data/           # Static data
│   ├── styles/         # Additional styles
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── vercel.json         # Vercel deployment config
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Helmet Async** - Document head management
- **Lucide React** - Icon library

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect the configuration
4. Deploy!

The build command is automatically configured in `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

### Manual Deployment

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 🔧 Configuration Files

- **package.json** - Project dependencies and scripts
- **vite.config.js** - Vite build configuration
- **tailwind.config.js** - TailwindCSS theming
- **postcss.config.js** - PostCSS plugins
- **vercel.json** - Vercel deployment settings
- **.gitignore** - Git ignored files

## 📝 Development Notes

- The app uses HashRouter for client-side routing compatibility
- Mobile-first responsive design
- Optimized images in multiple sizes (sm, lg, xl)
- Custom TailwindCSS utilities and components

## 🐛 Troubleshooting

### Build Fails on Vercel
- Ensure all config files are committed to git
- Check that `package.json`, `vite.config.js`, and `index.html` exist
- Verify Node.js version compatibility

### Routing Issues
- The app uses HashRouter (`#/path`) for static hosting compatibility
- For clean URLs, consider using BrowserRouter with proper server configuration

## 📄 License

All rights reserved - Taqwa Humanitarian Association
