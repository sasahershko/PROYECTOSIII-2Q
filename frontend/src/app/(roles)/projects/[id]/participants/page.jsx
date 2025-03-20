"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useProjects from "@/hooks/useProjects";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";
import SpinLoader from "@/components/SpinLoader";

const ParticipantsPage = () => {
  // Obtiene el id del proyecto desde la url
  const { id: projectId } = useParams();


  const [participants, setParticipants] = useState([]);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtiene la lista de proyectos
  const { projects, loading: projectsLoading } = useProjects();

  useEffect(() => {
    // Evita la ejecucion si los proyectos aun estan cargando o no hay projectId
    if (!projectId || projectsLoading) return;

    const fetchParticipants = async () => {
      try {
        // Busca el proyecto por su id dentro de la lista de proyectos
        const projectData = projects.find(p => p._id === projectId);
        if (!projectData) throw new Error("No se encontró el proyecto.");

        // Se detiene la carga si el proyecto no tiene usuarios asociados 
        if (!projectData.users || projectData.users.length === 0) {
          setParticipants([]);
          setLoading(false);
          return;
        }

        setParticipants(projectData.users);
      } catch (error) {
        
        setError(error.message || "No se pudieron obtener los participantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [projectId, projects, projectsLoading]);

  
    if (loading) {
      return (
        <div className="pt-44 flex items-center justify-center">
          <SpinLoader size="49px" />
        </div>
      );
    }
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      {/* Mantiene la barra de navegacion del proyecto con "Participantes" como pestaña activa */}
      <ProjectsNavBar role="admin" activeTab="participantes" />

      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Participantes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <div 
                key={participant._id} 
                className="flex items-center bg-gray-300 p-4 rounded-lg shadow-md"
              >
                {/* Imagen del participante o imagen por defecto */}
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
    </>
  );
};

export default ParticipantsPage;
