"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";
import ParticipantsList from "@/components/projects/ParticipantsList"; // Importamos el componente

const ParticipantsPage = () => {
  const { id: projectId } = useParams(); // Obtiene el ID del proyecto desde la URL


  return (
    <>
      {/* Barra de navegación del proyecto con "Participantes" como pestaña activa */}
      <ProjectsNavBar role="admin" activeTab="participantes" />

      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Participantes</h2>
        {/* Se llama al nuevo componente pasando el projectId */}
        <ParticipantsList projectId={projectId} />
      </div>
    </>
  );
};

export default ParticipantsPage;
