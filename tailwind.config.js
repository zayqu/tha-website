/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Dark Blue #024d85 - Authority, Trust, Depth
        primary: {
          DEFAULT: '#024d85',
          light: '#1b6ba8',
          dark: '#013557'
        },
        // Secondary: Green #26b805 - Health, Growth, CTAs
        secondary: {
          DEFAULT: '#26b805',
          light: '#4dce2e',
          dark: '#1f8c04'
        },
        // Accent: Orange #ff9c1a - Urgency, Highlights, Energy
        accent: {
          DEFAULT: '#ff9c1a',
          light: '#ffb84d',
          dark: '#e68900'
        },
        // Neutral: Black & Grays
        black: '#000000',
        'cool-gray': {
          DEFAULT: '#F6F9FC',
          light: '#FFFFFF',
          dark: '#E8EDF4'
        },
        'near-black': '#1A1A1A',
        // Health Category Colors (retained from previous)
        hepatitis: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626'
        },
        hiv: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777'
        },
        mental: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED'
        }
      },
      fontFamily: {
        sans: ['Proxima Nova', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Proxima Nova', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-lg': '56px',
        'hero-md': '42px',
        'hero-sm': '32px',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      lineHeight: {
        tight: '1.2',
        relaxed: '1.6',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'count-up': 'countUp 2s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        countUp: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      boxShadow: {
        'subtle': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 12px 24px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
