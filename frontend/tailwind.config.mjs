const { createThemes } = require("tw-colors");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class", // Activa el modo oscuro basado en clases
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}", //PARA SHADCN/UI
  ],
  theme: {
    extend: {
      colors: {
        // Aquí se pueden definir colores que no se modifiquen segun el tema
      },
    },
  },
  plugins: [
    createThemes({
      // Aquí se pueden definir colores segun el tema, deben tener el mismo nombre
      light: {
        "primary-bg": "#ffffff",
        secundary: "#111827",
        "primary-text": "#000",
        "secundary-text": "#111827",
        accent: "#0068ee",
        card: "#f1f2f4",
      },
      dark: {
        "primary-bg": "#0D1117", // Fondo principal oscuro (azulado)
        secundary: "#1E293B", // Secundario un poco más claro que el fondo
        "primary-text": "#FFFFFF", // Texto principal en blanco
        "secundary-text": "#9CA3AF", // Texto secundario en gris claro
        accent: "#14b55a", // Se mantiene el verde que ya tenías
        card: "#21262D", // Fondo de "tarjeta" gris azulado
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
        "secundary-text": "#9aa8d5", // Texto secundario
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
    }),
  ],
};

export default config;
