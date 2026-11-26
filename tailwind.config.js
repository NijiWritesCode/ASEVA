/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0B0C0E',
          900: '#121316',
          800: '#1B1D22',
          700: '#262930',
          600: '#383C46',
        },
        gold: {
          50: '#FBF8F0',
          100: '#F5EED9',
          200: '#EBDBB0',
          300: '#DEC583',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A8833E',
          700: '#85642E',
          800: '#664B24',
          900: '#4A351B',
        },
        sand: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4F0E8',
          300: '#E8E2D5',
          400: '#D5CCBC',
          500: '#B8ACA0',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'luxury': '2px',
      },
    },
  },
  plugins: [],
}
