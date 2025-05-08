"use client";

import { useEffect, useState } from "react";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/profile";
import Image from "next/image";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

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
    <div className="relative">
      <div
        className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
          <button
            onClick={() => {
              router.push("/profile");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={() => {
              router.push("/settings");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
