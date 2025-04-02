"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";

const CalendarPage = () => {
  const { id: projectId } = useParams(); // Obtiene el ID del proyecto desde la URL

  return (
    <>
      {/* Barra de navegación del proyecto con "Calendario" como pestaña activa */}
      <ProjectsNavBar role="admin" activeTab="calendario" />

      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Calendario del Proyecto</h2>
        {/* Se llama al nuevo componente pasando el projectId */}
        <ProjectCalendar projectId={projectId} />
      </div>
    </>
  );
};

export default CalendarPage;
