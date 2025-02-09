import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans bg-foreground text-background">
        {children}
        <Footer />
      </body>
    </html>
  );
}
