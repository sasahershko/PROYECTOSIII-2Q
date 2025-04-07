"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import SpinLoader from "@/components/SpinLoader";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Muestra un spinner mientras cargan los datos
  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  // Si no hay usuario, muestra un mensaje
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary-bg text-primary-text">
        <p>No se encontró información del usuario.</p>
      </div>
    );
  }

  // Si hay usuario, renderiza su información
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-bg text-primary-text">
      <h1 className="text-2xl font-bold mb-8">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded p-6 max-w-md w-full text-gray-800">
        <div className="mb-4">
          <span className="font-bold">ID: </span>
          {user.id}
        </div>
        <div className="mb-4">
          <span className="font-bold">Nombre: </span>
          {user.name}
        </div>
        <div className="mb-4">
          <span className="font-bold">Email: </span>
          {user.email}
        </div>
      </div>
    </div>
  );
}
