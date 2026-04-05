/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        primary: {
          DEFAULT: '#024d85',
          light: '#0A5FA0',
          dark: '#013A65'
        },
        secondary: {
          DEFAULT: '#26b805',
          light: '#3DD615',
          dark: '#1E8F04'
        },
        accent: {
          DEFAULT: '#ff9c1a',
          light: '#FFB04D',
          dark: '#E68A0A'
        },
        neutral: {
          DEFAULT: '#F6F9FC',
          dark: '#000000'
        }
      },
      fontFamily: {
        sans: ['Proxima Nova', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'count-up': 'countUp 2s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
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
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
=======
        primary: '#0F4C81',
        secondary: '#2E8B57',
        accent: '#E85D04',
        neutral: '#1A1A1A',
        background: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      lineHeight: {
        'tight': '1.4',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
