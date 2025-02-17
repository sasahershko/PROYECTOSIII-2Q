/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class", // Activa el modo oscuro basado en clases
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "secundary-bg": "#080b12",
        secundary: "#111827",
        utad: "#0068ee",
      },
    },
  },
  plugins: [],
};

export default config;
