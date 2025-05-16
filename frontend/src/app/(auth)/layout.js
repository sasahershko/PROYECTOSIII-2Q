import "@/app/globals.css";
import Link from "next/link";
import Image from "next/image";
import ThemeUpdater from "@/components/ThemeUpdater";
import { ThemeProvider } from "next-themes";

export default function AuthLayout({ children }) {
  return (
    <div>
      <ThemeProvider attribute={"class"} enableColorScheme={false}>
        <ThemeUpdater />
        <Link
          href="/"
          className="absolute text-white top-0 left-0 p-4 hover:opacity-85 py-5 px-7 font-bold"
        >
          ⭠ HOME
        </Link>

        <div className="flex w-full min-h-screen bg-secundary">
          <div className="flex-1 items-center justify-center">{children}</div>

          <div className="hidden md:flex flex-1 bg-gray-300 items-center justify-center">
            <Image
              src="tempPhotos/u-tad-2.jpeg"
              width={1100}
              height={1200}
              className="h-screen object-cover"
              alt="Imagen de autenticación"
              priority
            />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
