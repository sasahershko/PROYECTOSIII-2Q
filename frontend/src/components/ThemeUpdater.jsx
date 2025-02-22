"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themeConfig } from "@utils/themeConfig";

export default function ThemeUpdater() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme && themeConfig[theme]) {
      const { type, className } = themeConfig[theme];

      if (themeConfig[theme]) {
        // Obtiene el estilo inline actual (si existe)
        let currentStyle = document.documentElement.getAttribute("style") || "";
        // Elimina cualquier declaración previa de color-scheme
        console.log("Estilo actual del <html>:", currentStyle);
        currentStyle = currentStyle
          .replace(/color-scheme:\s*(light|dark);?/gi, "")
          .trim();
        // Agrega el color-scheme deseado
        const updatedStyle = `${currentStyle}color-scheme: ${type};`;
        document.documentElement.setAttribute("style", updatedStyle);
      }

      // Remueve las clases de tema previas
      Object.values(themeConfig).forEach(({ className: cn }) => {
        document.documentElement.classList.remove(cn);
      });

      // Agrega la clase del tema actual
      document.documentElement.classList.add(className);

      console.log(
        "Estilo final del <html>:",
        document.documentElement.getAttribute("style")
      );
      console.log("Clases del <html>:", document.documentElement.className);
    }
  }, [theme]);

  return null;
}
