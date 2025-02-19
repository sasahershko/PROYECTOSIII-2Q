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
      pink: {
        "primary-bg": "#fff0f6", // Fondo rosa muy claro
        secundary: "#9d174d", // Rosa intenso para elementos secundarios
        "primary-text": "#330e14", // Texto en tono oscuro para buen contraste
        "secundary-text": "#9d174d", // Texto secundario que armoniza con el secundary
        accent: "#db2777", // Acento rosa vibrante
        card: "#ffe4e6", // Fondo suave para tarjetas
      },
      dracula: {
        "primary-bg": "#282a36", // Fondo principal oscuro de Dracula
        secundary: "#44475a", // Fondo secundario
        "primary-text": "#f8f8f2", // Texto principal claro
        "secundary-text": "#6272a4", // Texto secundario
        accent: "#ff79c6", // Acento vibrante
        card: "#44475a", // Fondo para tarjetas o paneles
      },
      nord: {
        "primary-bg": "#2E3440", // Fondo principal del estilo Nord
        secundary: "#3B4252", // Fondo secundario
        "primary-text": "#D8DEE9", // Texto principal claro
        "secundary-text": "#81A1C1", // Texto secundario
        accent: "#88C0D0", // Acento frío y suave
        card: "#434C5E", // Fondo para tarjetas
      },
      solarizedDark: {
        "primary-bg": "#002b36", // Fondo principal Solarized Dark
        secundary: "#073642", // Fondo secundario
        "primary-text": "#839496", // Texto principal
        "secundary-text": "#586e75", // Texto secundario
        accent: "#268bd2", // Acento en azul
        card: "#073642", // Fondo para tarjetas
      },
    }),
  ],
};

export default config;
