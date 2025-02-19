import "@/app/globals.css";
import Header from "@components/Header";
import { ThemeUpdater } from "@components/ThemeUpdater";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="text-primary-text bg-primary-bg">
        <ThemeUpdater />
        <Header />
        <div className="w-auto h-auto pt-20">{children}</div>
      </body>
    </html>
  );
}
