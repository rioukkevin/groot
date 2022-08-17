/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FCE762",
        secondary: "#508484",
        tertiary: "#CA3C25",
        darky: "#121113",
        cleary: "#f2e5d7",
      },
    },
  },
  plugins: [],
};
