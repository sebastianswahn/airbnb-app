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
        // Existing colors
        "black-600": "#222222",
        "grey-700": "#717171",
        "grey-600": "#DDDDDD",
        "skyblue-600": "#F7F7F7",
        // New Airbnb colors
        airbnb: {
          DEFAULT: "#FF385C",
          light: "#FF385C1A",
        },
        neutral: {
          50: "#F7F7F7",
          100: "#EBEBEB",
          200: "#DDDDDD",
          300: "#C8C8C8",
          400: "#A0A0A0",
          500: "#717171",
          600: "#5C5C5C",
          700: "#484848",
          800: "#383838",
          900: "#222222",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        // Existing shadows
        "3xl": "0px 3px 10px rgba(0, 0, 0, 0.1)",
        "4xl": "0px 3px 15px rgba(0, 0, 0, 0.15)",
        // New Airbnb specific shadows
        menu: "0 2px 16px rgba(0, 0, 0, 0.12)",
        card: "0 6px 16px rgba(0, 0, 0, 0.12)",
        search: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      fontWeight: {
        semiBold: 500,
      },
      maxWidth: {
        "8xl": "2520px",
      },
      height: {
        "screen-minus-nav": "calc(100vh - 80px)",
      },
      screens: {
        xs: "375px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

module.exports = config;
