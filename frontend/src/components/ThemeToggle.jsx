// components/ThemeToggle.js
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { themeConfig } from "@utils/themeConfig";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="px-3 py-1 rounded bg-accent text-primary-bg transition-colors duration-300 w-28"
    >
      {Object.entries(themeConfig).map(([key, { displayName }]) => (
        <option key={key} value={key}>
          {displayName}
        </option>
      ))}
    </select>
  );
}
