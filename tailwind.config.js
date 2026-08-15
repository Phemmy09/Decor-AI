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
        gold: {
          50: '#FAF8F0',
          100: '#F5F0E1',
          200: '#EBDDBB',
          300: '#E0C78F',
          400: '#D6B465',
          500: '#D4AF37', // Primary Luxury Gold
          600: '#B89327',
          700: '#91711A',
          800: '#6B5213',
          900: '#47360B',
        },
        obsidian: {
          950: '#07090E',
          900: '#0B0F17',
          850: '#101622',
          800: '#161E2E',
          750: '#1C263B',
          700: '#233049',
        },
        champagne: {
          100: '#F9F6F0',
          200: '#F3ECE0',
          300: '#E8DCC9',
          400: '#DECDB1',
        },
        emeraldLuxury: {
          500: '#10B981',
          600: '#059669',
          900: '#064E3B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'gold-sm': '0 0 15px -3px rgba(212, 175, 55, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
