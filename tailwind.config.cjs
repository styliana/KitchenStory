/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Nowoczesny sans-serif do interfejsu
        sans: ['Inter', 'sans-serif'],
        // Elegancki szeryfowy do nagłówków
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}