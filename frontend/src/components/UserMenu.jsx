"use client";

import { useEffect, useState, useRef } from "react";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/profile";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchUser();
  }, []);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = () => {
    if (!user) return "";
    const name = user.name?.charAt(0) || "";
    const surname = user.surname?.charAt(0) || "";
    return `${name}${surname}`.toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={() => setIsOpen((o) => !o)}
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt="Foto de perfil"
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        ) : (
          <span className="text-gray-700 font-semibold text-sm">
            {getInitials()}
          </span>
        )}
      </div>

      {/* Animación del dropdown con Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <button
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Perfil
            </button>
            <button
              onClick={() => {
                router.push("/settings");
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Ajustes
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
