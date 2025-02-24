"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { getUserRole } from "@/lib/authClient";

export default function Header() {
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole();
      setUserRole(role);
    }
    fetchRole();
  }, []);

  const handleLogout = () => {
    console.log('implementar logout');
  };

  return (
    <div className="flex items-center px-6 h-20 bg-secundary text-white fixed w-full z-50">
      <div className="flex-none">
        <Link href="/">
          <Image src={"/logos/logoPC-White.webp"} alt="Logo" width={160} height={50} />
        </Link>
      </div>
  
      {/*solo si es admin o user*/}
      {(userRole === "admin" || userRole === "user") ? (
        <div className="flex-1 flex justify-center">
          <div className="flex gap-10 font-semibold text-lg">
            <Link href={userRole === "admin" ? "/admin/projects" : "/user/projects"} className="transition duration-300 hover:text-gray-500">
              Proyectos
            </Link>
            <Link href={userRole === "admin" ? "/admin/reservations" : "/user/reservations"} className="transition duration-300 hover:text-gray-500">
              Reservas
            </Link>
          </div>
        </div>
      ) : (
        // Si no es admin o user, dejamos el centro vacío
        <div className="flex-1"></div>
      )}
  

      <div className="flex-none flex items-center gap-6 font-semibold hover:text-white/90 text-lg">
        {userRole === "admin" || userRole === "user" ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
            <ThemeToggle />
          </>
        ) : (
          <>
            <Link href="/login">LOGIN</Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </div>
  );
  
}



