/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          100: '#D1C9FE',
          300: '#AB9EFD',
        },
      },
    },
  },
  plugins: [],
}
