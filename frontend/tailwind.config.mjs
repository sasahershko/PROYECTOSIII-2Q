const { createThemes } = require("tw-colors");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class", "class"], // Activa el modo oscuro basado en clases
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/ui/**/*.{js,ts,jsx,tsx}" //PARA SHADCN/UI
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    createThemes({
      // Aquí se pueden definir colores segun el tema, deben tener el mismo nombre
      light: {
        "primary-bg": "#fff",
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
      require("tailwindcss-animate")
],
};

export default config;
