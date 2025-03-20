"use client";

import React, { useEffect, useState } from "react";
import { getProjects } from "@/lib/projects";
import { getUsers } from "@/lib/users"; // Obtener todos los usuarios
import SpinLoader from "@/components/SpinLoader";

//! POR AHORA LO ESTOY HACIENDO CON TODOS LOS USERS PORQUE NO TENEMOS GETUSERBYID

const ParticipantsList = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchParticipants = async () => {
      try {
        const projects = await getProjects();
        const project = projects.find((p) => p._id === projectId);
        if (!project) throw new Error("No se encontró el proyecto.");

        const users = await getUsers(); // Obtener todos los usuarios

        // Relacionar IDs con los usuarios completos
        const projectParticipants = project.users
          .map((userId) => users.find((user) => user._id === userId))
          .filter(Boolean); // Filtra valores null si un ID no coincide

        setParticipants(projectParticipants);
      } catch (err) {
        setError("No se pudieron obtener los participantes.");
        console.error("Error obteniendo participantes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [projectId]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants.length > 0 ? (
        participants.map((participant) => (
          <div className="flex items-center bg-gray-300 p-4 rounded-lg shadow-md transition-transform duration-500 ease-out hover:scale-105">
            <img
              src={'/tempPhotos/default-avatar.jpg'}
              alt={participant.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{participant.name}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 col-span-full">No hay participantes en este proyecto.</p>
      )}
    </div>
  );
};

export default ParticipantsList;
