"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themeConfig } from "@utils/themeConfig";

const THEME_KEY = "theme";

export default function ThemeUpdater() {
  const { theme, setTheme } = useTheme();

  // Comprobar siempre si hay un tema almacenado o, en su defecto, detectar la preferencia del sistema
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme && themeConfig[storedTheme]) {
      if (theme !== storedTheme) {
        setTheme(storedTheme);
      }
    } else {
      // No hay tema almacenado: detecta la preferencia del sistema
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      // Por ejemplo: si el sistema es dark, asignamos "nord"; en caso contrario "light"
      const randomChance = Math.random();
      const defaultTheme = systemPrefersDark
        ? "dark"
        : randomChance < 0.01
        ? "pink"
        : "light";
      if (theme !== defaultTheme) {
        setTheme(defaultTheme);
      }
      localStorage.setItem(THEME_KEY, defaultTheme);
    }
  }, [theme, setTheme]);

  // Actualiza el DOM según el tema actual
  useEffect(() => {
    if (theme && themeConfig[theme]) {
      const { type, className } = themeConfig[theme];

      // Remueve las clases de tema previas
      Object.values(themeConfig).forEach(({ className: cn }) => {
        document.documentElement.classList.remove(cn);
      });

      // Agrega la clase del tema actual
      document.documentElement.classList.add(className);

      // Actualiza el atributo inline style para la propiedad color-scheme
      let currentStyle = document.documentElement.getAttribute("style") || "";
      // Elimina cualquier declaración previa de color-scheme
      currentStyle = currentStyle
        .replace(/color-scheme:\s*(light|dark);?/gi, "")
        .trim();
      const updatedStyle = `${currentStyle} color-scheme: ${type};`;
      document.documentElement.setAttribute("style", updatedStyle);
    }
  }, [theme]);

  return null;
}
