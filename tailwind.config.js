/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F80ED',
          50: '#EBF4FF',
          100: '#D6E8FF',
          200: '#B3D1FF',
          300: '#80B3FF',
          400: '#4D95FF',
          500: '#2F80ED',
          600: '#1A5BB8',
          700: '#0E3A7A',
          800: '#0E1B3D',
          900: '#0A1530',
        },
        navy: {
          DEFAULT: '#0E1B3D',
          50: '#F0F2F7',
          100: '#D9DEE8',
          200: '#B3C0D1',
          300: '#8DA2BA',
          400: '#6784A3',
          500: '#41668C',
          600: '#2A4A6B',
          700: '#1E2A4D',
          800: '#0E1B3D',
          900: '#0A1530',
        },
        background: {
          light: '#F6F7F8',
          dark: '#111721',
        }
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
