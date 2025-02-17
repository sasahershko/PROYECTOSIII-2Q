const { createThemes } = require("tw-colors");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class", // Activa el modo oscuro basado en clases
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [
    createThemes({
      light: {
        "primary-bg": "#fff",
        secundary: "#111827",
        "primary-text": "#000",
        "secundary-text": "#111827",
        accent: "#0068ee",
        card: "#f1f2f4",
      },
      dark: {
        "primary-bg": "#080b12",
        secundary: "#111827",
        "primary-text": "#fff",
        "secundary-text": "#d1d5db",
        accent: "#14b55a",
        card: "#1f2937",
      },
    }),
  ],
};

export default config;
