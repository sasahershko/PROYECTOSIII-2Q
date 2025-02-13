import ThemeToggle from "./ThemeToggle";
import { cookies } from "next/headers";
import Image from "next/image";

export default function Header() {
  // 1. Leemos la cookie "theme"
  const themeCookie = cookies().get("theme")?.value;
  // 2. Decidimos la clase a poner en <html>
  //    Si hay cookie, la usamos; si no, por ejemplo "light".
  const theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <div className="flex items-center justify-between px-6 h-20 bg-accent text-white">
      <a href="/">
        <Image
          src={"/logos/logoPC-White.webp"}
          alt="Logo"
          width={160}
          height={50}
        />
      </a>
      <div className="flex items-center gap-6 pointer font-semibold hover:text-white/90 text-lg">
        <div className="flex gap-4">
          <a href="/login">LOGIN</a>
        </div>
        <ThemeToggle initialTheme={theme} />
      </div>
    </div>
  );
}
