import ThemeToggle from "./ThemeToggle";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { jwtVerify } from 'jose';


export default function Header() {
  // 1. Leemos la cookie "theme"
  const themeCookie = cookies().get("theme")?.value;
  // 2. Decidimos la clase a poner en <html>
  //    Si hay cookie, la usamos; si no, por ejemplo "light".
  const theme = themeCookie === "dark" ? "dark" : "light";
  const token = cookies().get("token")?.value;

  return (
    <div className="flex items-center justify-between px-6 h-20 bg-accent text-white fixed w-full z-50">
      <Link href="/">
        <Image
          src={"/logos/logoPC-White.webp"}
          alt="Logo"
          width={160}
          height={50}
        />
      </Link>
      <div className="flex items-center gap-6 pointer font-semibold hover:text-white/90 text-lg">
        <div className="flex gap-4">
          {token ?
            <div className="flex justify-between gap-4">
              <Link href='/'>Perfil</Link>
              <Link className="text-red-400" href='/' >Cierra sesión</Link >
            </div>
            : <Link href="/login">LOGIN</Link>}

        </div>
        <ThemeToggle initialTheme={theme} />
      </div>
    </div>
  );
}
