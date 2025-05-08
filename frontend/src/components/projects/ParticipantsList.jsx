"use client";

import React, { useEffect, useState } from "react";
import { getProjects } from "@/lib/projects";
import { getUsers } from "@/lib/users";
import SpinLoader from "@/components/SpinLoader";
import UserProfileModal from "@components/lists/UserProfileModal";

export default function ParticipantsList({ projectId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchParticipants = async () => {
      try {
        const projects = await getProjects();
        const project = projects.find((p) => p._id === projectId);
        if (!project) throw new Error("No se encontró el proyecto.");

        const users = await getUsers();

        const projectParticipants = project.users
          .map((userId) => users.find((u) => u._id === userId))
          .filter(Boolean);

        setParticipants(projectParticipants);
      } catch (err) {
        setError("No se pudieron obtener los participantes.");
        console.error(err);
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

  const getInitials = (user) => {
    const n = user.name?.charAt(0) || "";
    const s = user.surname?.charAt(0) || "";
    return (n + s).toUpperCase();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div
              key={participant._id}
              onClick={() => handleParticipantClick(participant)}
              className="flex items-center gap-4 p-4 bg-card rounded-md shadow-sm transition-shadow hover:shadow-md cursor-pointer"
            >
              {participant.profileImage ? (
                <img
                  src={participant.profileImage}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-bg/50 text-primary-text flex items-center justify-center text-base font-bold">
                  {getInitials(participant)}
                </div>
              )}
              <div>
                <p className="text-base font-medium text-primary-text">
                  {participant.name} {participant.surname}
                </p>
                {participant.rol && (
                  <p className="text-sm text-secundary-text">
                    {participant.rol}
                  </p>
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

      <UserProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
