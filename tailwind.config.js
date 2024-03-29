/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
  ],
  plugins: [require("tailwind-children")],
  theme: {
    fontFamily: {
      DEFAULT: ["Roboto Mono", "sans-serif"],
    },
    extend: {
      screens: {
        desk: "1024px",
      },
      colors: {
        primary: "#CA3C25",
        secondary: "#508484",
        tertiary: "#FCE762",
        darky: "#121113",
        cleary: "#fcfbf299",
      },
      fontFamily: {
        roboto: ["Roboto Mono", "sans-serif"],
      },
    },
  },
};
