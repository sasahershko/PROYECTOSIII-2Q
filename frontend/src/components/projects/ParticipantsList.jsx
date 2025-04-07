"use client";

import React, { useEffect, useState } from "react";
import { getProjects } from "@/lib/projects";
import { getUsers } from "@/lib/users"; // Obtener todos los usuarios
import SpinLoader from "@/components/SpinLoader";
import UserProfileModal from "@components/lists/UserProfileModal"; // Ajusta la ruta según tu proyecto

const ParticipantsList = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleParticipantClick = (participant) => {
    setSelectedUser(participant);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      {/* Lista de participantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div
              key={participant._id}
              onClick={() => handleParticipantClick(participant)}
              className="flex items-center gap-4 p-4 bg-card rounded-md shadow-sm
                         transition-shadow duration-300 hover:shadow-md 
                         hover:cursor-pointer"
            >
              <img
                src="/tempPhotos/default-avatar.jpg"
                alt={participant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-medium text-primary-text">
                  {participant.name}
                </p>
                {participant.role && (
                  <p className="text-sm text-gray-500">{participant.role}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No hay participantes en este proyecto.
          </p>
        )}
      </div>

      {/* Modal para el usuario seleccionado */}
      <UserProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ParticipantsList;
