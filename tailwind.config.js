/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.html", // Altere para o caminho onde ficam seus arquivos HTML.
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./dist/**/*.html", // Altere para o caminho onde ficam seus arquivos HTML.
    "./dist/**/*.{js,ts,jsx,tsx,css}",
    "./public/**/*.html", // Altere para o caminho onde ficam seus arquivos HTML.
    "./public/**/*.{js,ts,jsx,tsx,css}",
    "./**/*",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

