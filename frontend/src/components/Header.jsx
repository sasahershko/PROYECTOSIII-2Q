"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getUserRole } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import UserCircle from "@components/UserMenu";

export default function Header() {
  const [userRole, setUserRole] = useState("guest"); // <-- aquí quitamos el <...>
  const router = useRouter();

  useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole();
      setUserRole(role);
    }
    fetchRole();
  }, []);

  return (
    <div
      className="
        flex items-center
        px-6 h-20
        bg-secundary text-white
        fixed w-full z-50
        select-none
      "
    >
      {/* Logo */}
      <div className="flex-none">
        <Link href="/" draggable={false} className="select-none">
          <Image
            src="/logos/logoPC-White.webp"
            alt="Logo"
            width={160}
            height={50}
            draggable={false}
          />
        </Link>
      </div>

      {/* Menú */}
      <div className="flex-1 flex justify-end items-center gap-5 font-semibold text-sm">
        {userRole === "admin" || userRole === "user" ? (
          <>
            <Link
              href="/projects"
              className="transition hover:text-gray-500 select-none"
            >
              Proyectos
            </Link>
            <Link
              href={
                userRole === "admin"
                  ? "/admin/reservations"
                  : "/user/reservations"
              }
              className="transition hover:text-gray-500 select-none"
            >
              Reservas
            </Link>
            {userRole === "admin" && (
              <>
                <Link
                  href="/admin/users"
                  className="transition hover:text-gray-500 select-none"
                >
                  Usuarios
                </Link>
                <Link
                  href="/admin/calendar"
                  className="transition hover:text-gray-500 select-none"
                >
                  Calendario
                </Link>
                <Link
                  href="/admin/ideas"
                  className="transition hover:text-gray-500 select-none"
                >
                  Ideas
                </Link>
              </>
            )}
            <UserCircle />
          </>
        ) : (
          <Link href="/login" className="select-none">
            LOGIN
          </Link>
        )}
      </div>
    </div>
  );
}
