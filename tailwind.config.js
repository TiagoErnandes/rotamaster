/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          950: '#050b18',
          900: '#080f1e',
          800: '#0d1525',
          700: '#111c30',
          600: '#162038',
          500: '#1e3a5f',
          400: '#2a4e7a',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        game: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(245,158,11,0.6)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      boxShadow: {
        'game': '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        'game-hover': '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold': '0 0 16px rgba(245,158,11,0.4)',
        'skill': '0 2px 12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
