"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ParticipantsPage = () => {
  const { id: projectId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Función para obtener el token desde las cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find(row => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchParticipants = async () => {
      try {
        console.log(`Obteniendo participantes del proyecto ${projectId}...`);

        // 🔍 Obtener el token desde las cookies
        const token = getTokenFromCookies();

        if (!token) throw new Error("No hay token disponible. Inicia sesión primero.");

        // 1️⃣ Obtener los detalles del proyecto
        const projectResponse = await fetch(
          `https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/projects/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!projectResponse.ok) throw new Error("Error al obtener el proyecto");

        const projectData = await projectResponse.json();
        const userIds = projectData.users?.map(user => user._id) || [];

        if (userIds.length === 0) {
          setParticipants([]);
          setLoading(false);
          return;
        }

        console.log("IDs de usuarios en el proyecto:", userIds);

        // 2️⃣ Obtener todos los usuarios con autenticación
        const usersResponse = await fetch(
          "https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/users",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!usersResponse.ok) throw new Error("Error al obtener los usuarios");

        const allUsers = await usersResponse.json();

        console.log("Usuarios obtenidos de API:", allUsers);

        // 3️⃣ Filtrar los usuarios del proyecto (Comparar `_id` con `id`)
        const projectParticipants = allUsers.filter(user => userIds.includes(user._id));

        console.log("Participantes filtrados:", projectParticipants);
        setParticipants(projectParticipants);
      } catch (error) {
        console.error("Error en fetchParticipants:", error);
        setError(error.message || "No se pudieron obtener los participantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [projectId]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Participantes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div key={participant._id} className="flex items-center bg-gray-300 p-4 rounded-lg shadow-md">
              <img
                src={participant.avatar || "https://via.placeholder.com/50"}
                alt={participant.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{participant.name} {participant.surname}</p>
                <p className="text-gray-600">{participant.role || "Estudiante"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hay participantes en este proyecto.</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPage;
