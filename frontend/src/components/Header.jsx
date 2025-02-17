"use c";

import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 h-20 bg-secundary text-white fixed w-full z-50">
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
          <Link href="/login">LOGIN</Link>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
