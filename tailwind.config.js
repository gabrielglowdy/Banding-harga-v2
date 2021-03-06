module.exports = {
  purge: {
    enabled: true,
    content: [
      "./**/*.html", 
      "./js/**/index.js"
    ],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
