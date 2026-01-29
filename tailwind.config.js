/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hepsiburada Color Palette
        primary: {
          DEFAULT: '#FF6000',  // Hepsiburada Orange
          50: '#FFF7F0',
          100: '#FFEFE0',
          200: '#FFD4B8',
          300: '#FFB885',
          400: '#FF8C42',
          500: '#FF6000',      // Main Orange
          600: '#E55500',      // Hover Orange
          700: '#CC4A00',
          800: '#993800',
          900: '#662500',
        },
        navy: {
          DEFAULT: '#484848',  // Hepsiburada Dark Text
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#484848',      // Main Dark
          800: '#363636',
          900: '#1A1A1A',
        },
        background: {
          light: '#F5F5F5',    // Hepsiburada Light Background
          dark: '#121212',     // Modern dark background
        },
        // Dark mode specific colors
        dark: {
          DEFAULT: '#121212',
          50: '#2A2A2A',
          100: '#252525',
          200: '#202020',
          300: '#1A1A1A',
          400: '#151515',
          500: '#121212',
          600: '#0E0E0E',
          700: '#0A0A0A',
          800: '#050505',
          900: '#000000',
        },
        // Additional Hepsiburada colors
        hb: {
          orange: '#FF6000',
          'orange-dark': '#E55500',
          'orange-light': '#FFF4ED',
          green: '#00C853',
          'green-light': '#E8F9EF',
          red: '#F44336',
          'red-light': '#FEECEB',
          gray: '#666666',
          'gray-light': '#999999',
          border: '#E0E0E0',
        }
      },
      fontFamily: {
        // Hepsiburada uses Inter font
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
