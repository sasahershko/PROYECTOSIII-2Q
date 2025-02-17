import "@/app/globals.css";
import Header from "@components/Header";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="text-primary-text bg-primary-bg">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
          <div className="w-auto h-auto pt-20">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
