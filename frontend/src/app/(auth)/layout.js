import "@/app/globals.css";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <html className="dark">
      <body className="font-sans text-copy-primary">
        <Link
          href="/"
          className="absolute text-white top-0 left-0 p-4 hover:opacity-85 py-5 px-7 font-bold"
        >
          ⭠ HOME
        </Link>
        {children}
      </body>
    </html>
  );
}
