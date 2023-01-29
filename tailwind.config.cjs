/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#634BFB',
          400: '#8573FC',
          200: '#CBC3FE',
        },
      },
    },
  },
  plugins: [],
}
