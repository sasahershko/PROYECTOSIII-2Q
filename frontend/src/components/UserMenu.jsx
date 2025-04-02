"use client";

import { useState } from "react";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      
      router.push('/login')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10 bg-gray-700 rounded-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      ></div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
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
