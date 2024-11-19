/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#034875',
        "secondary": "#1B14F8",
        'color-nk': '#006689',
        'primary-secondary': '#690a23',
        'color-nk-secondary': '#191c1e',
        'ms-danger': '#a70040',
        'ms-black': '#071013',
        'ms-white': '#ffffff'
      },
      boxShadow: {
        'darkmode': '0 10px 15px -3px rgb(255 255 255 / 0.1), 0 4px 6px -4px rgb(255 255 255 / 0.1)'
      },
      height: {
        'chat': 'h-full',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'selector',
}