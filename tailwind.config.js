/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6767',
          500: '#ff3535',
          600: '#ed1515',
          700: '#c80d0d',
          800: '#a50f0f',
          900: '#881414',
          950: '#4b0404',
        },
        surface: {
          950: '#080808',
          900: '#0f0f0f',
          850: '#141414',
          800: '#1a1a1a',
          700: '#222222',
          600: '#2c2c2c',
          500: '#3a3a3a',
          400: '#525252',
          300: '#737373',
        },
        accent: {
          red:   '#c80d0d',
          crimson:'#8b0000',
          glow:  'rgba(200,13,13,0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 4px 24px rgba(0,0,0,0.45)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.6)',
        'brand':     '0 0 24px rgba(200,13,13,0.3)',
        'brand-sm':  '0 0 10px rgba(200,13,13,0.2)',
        'sidebar':   '4px 0 24px rgba(0,0,0,0.6)',
        'topbar':    '0 2px 16px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-in-left':'slideInLeft 0.35s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'pulse-brand': 'pulseBrand 2.5s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideInUp:   { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseBrand:  {
          '0%, 100%': { boxShadow: '0 0 10px rgba(200,13,13,0.2)' },
          '50%':      { boxShadow: '0 0 28px rgba(200,13,13,0.5)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}
