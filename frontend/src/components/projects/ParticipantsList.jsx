"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    if (!projectId) return; // No ejecutar si no hay projectId

    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          `https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/users?projectId=${projectId}`
        );
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        setParticipants(data);
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
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center bg-gray-300 p-4 rounded-lg shadow-md">
            <img
              src={participant.avatar || "https://via.placeholder.com/50"}
              alt={participant.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{participant.name}</p>
              <p className="text-gray-600">{participant.role || "Estudiante"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
