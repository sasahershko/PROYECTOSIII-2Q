import "@/app/globals.css";
import Footer from "@components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
          <div className="w-auto h-auto pt-20 bg-primary-bg">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
