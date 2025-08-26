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
    },
  },
  plugins: [],
}
