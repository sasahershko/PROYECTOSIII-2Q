"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { getUserRole } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import UserCircle from '@components/UserMenu'

export default function Header() {
  const [userRole, setUserRole] = useState("guest");
  const router = useRouter();

  useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole();
      setUserRole(role);
    }
    fetchRole();
  }, []);

  return (
    <div className="flex items-center px-6 h-20 bg-secundary text-white fixed w-full z-50">
      {/* Logo alineado a la izquierda */}
      <div className="flex-none">
        <Link href="/">
          <Image src={"/logos/logoPC-White.webp"} alt="Logo" width={160} height={50} />
        </Link>
      </div>

      {/* Menú alineado a la derecha */}
      <div className="flex-1 flex justify-end items-center gap-5 font-semibold text-sm">
        {(userRole === "admin" || userRole === "user") ? (
          <>
            <Link
              href={userRole === "admin" ? "/admin/projects" : "/user/projects"}
              className="transition duration-300 hover:text-gray-500"
            >
              Proyectos
            </Link>
            <Link
              href={userRole === "admin" ? "/admin/reservations" : "/user/reservations"}
              className="transition duration-300 hover:text-gray-500"
            >
              Reservas
            </Link>
            {userRole === "admin" && (
              <>
                <Link href="/admin/users" className="transition duration-300 hover:text-gray-500">
                  Usuarios
                </Link>
                <Link href="/admin/calendar" className="transition duration-300 hover:text-gray-500">
                  Calendario
                </Link>
              </>
            )}


            <ThemeToggle />
            <UserCircle />
          </>
        ) : (
          <>
            <Link href="/login" className="">LOGIN</Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </div>
  );
}
