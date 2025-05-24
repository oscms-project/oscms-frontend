/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e6f0ff',
          200: '#bfdaff',
          300: '#99c3ff',
          400: '#4d96ff',
          500: '#0066ff',
          600: '#005ce6',
          700: '#004dbf',
          800: '#003d99',
          900: '#003280',
        },
      },
      spacing: {
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-white',
    'rounded-2xl',
    'shadow-xl',
    'border',
    'border-blue-100',
    'overflow-hidden'
  ]
} 