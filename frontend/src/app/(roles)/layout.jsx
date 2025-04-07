// app/layout.js
import "@/app/globals.css";
import Header from "@/components/Header";
import ThemeUpdater from "@components/ThemeUpdater";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <div>
      <ThemeProvider attribute={"class"} enableColorScheme={false}>
        <ThemeUpdater />
        <Header />
        <div className="w-auto h-screen py-20 bg-primary-bg">{children}</div>
        {/* <Footer /> */}
      </ThemeProvider>
    </div>
  );
}
