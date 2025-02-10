// app/layout.js (Server Component)
import "./globals.css";
import { cookies } from "next/headers"; // Importante: esto es para leer cookies en el server
import Footer from "@components/Footer";
import ThemeToggle from "@components/ThemeToggle"; // el toggle del modo claro/oscuro

export default function RootLayout({ children }) {
  // 1. Leemos la cookie "theme"
  const themeCookie = cookies().get("theme")?.value;

  // 2. Decidimos la clase a poner en <html>
  //    Si hay cookie, la usamos; si no, por ejemplo "light".
  const theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="es" className={theme}>
      <body className="font-sans text-copy-primary">
        {/* El toggle, al montarse, recibirá el "tema actual" */}
        <ThemeToggle initialTheme={theme} />

        {children}
        <Footer />
      </body>
    </html>
  );
}
