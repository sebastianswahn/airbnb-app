/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-600": "#222222",
        "grey-700": "#717171",
        "grey-600": "#DDDDDD",
        "skyblue-600": "#F7F7F7",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        "3xl": "0px 3px 10px rgba(0, 0, 0, 0.1)",
        "4xl": "0px 3px 15px rgba(0, 0, 0, 0.15)",
      },
      fontWeight: {
        semiBold: 500,
      },
    },
  },
  plugins: [],
};

module.exports = config;
