"use client";

import React from "react";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { formatDate, getProjectDates } from "@/utils/projectUtils";

export default function ProjectCard({ project, role }) {

  const areaColors = {
    "INSO": "bg-blue-400",
    "MAIS": "bg-red-400",
    "FIIS": "bg-green-400",
    "DIPI": "bg-cyan-400",
    "ANIV": "bg-yellow-400",
    "DIDI": "bg-pink-400",
  };

  const statusColors = {
    "No iniciado": "bg-gray-500",
    "En curso": "bg-yellow-500",
    "En espera": "bg-orange-500",
    "Completado": "bg-green-500",
  };

  const icons = {
    calendar: (<svg key="calendar" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8 y2=6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>),
    clock: (<svg key="clock" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>),
    hourglass: (<svg key="hourglass" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12"></path><path d="M6 22h12"></path><path d="M6 2c0 4 6 4 6 8s-6 4-6 8"></path><path d="M18 2c0 4-6 4-6 8s6 4 6 8"></path></svg>)
  };

  const projectStatus = project.pStatus?.length > 0 ? project.pStatus[project.pStatus.length - 1].status : "No iniciado";
  project.categoryColor = areaColors[project.area] || "bg-gray-300";
  project.statusColor = statusColors[project.pStatus] || "bg-gray-500";
  const dates = getProjectDates(project);

  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-card hover-grow relative">
      {/* Imagen (Visible para todos) */}
      <div className="h-48 bg-primary text-primary-text flex items-center justify-center rounded-t-xl">
        Imagen
      </div>

      {/* Contenido */}
      <div className={`relative p-4 pt-10 flex flex-col justify-between flex-grow ${project.categoryColor}`}>
        <div className="absolute -top-4 left-4">
          <div className={`relative inline-block px-5 py-1 ${project.categoryColor} rounded-tl-lg rounded-lg`}>
            <span className="relative z-20 text-sm font-semibold text-white">{project.area}</span>
          </div>
        </div>

        <h3 className="text-primary-text font-bold text-lg">{project.name}</h3>
        <p className="text-sm text-gray-700 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {project.description}
        </p>


        {(role === "admin" || role === "user") && (
          <>
            {/* Avatares PROVISIONALES HASTA QUE TENGAMOS FOTOS DE PERFIL */}
            <div className="absolute top-1 right-5 flex -space-x-5">
              {project.users.map((user, i) => {
                const avatarURL = `https://ui-avatars.com/api/?name=User+${i + 1}&background=random&color=fff`;
                return (
                  <img
                    key={i}
                    src={avatarURL}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                );
              })}
            </div>


            {/* Estado del proyecto con etiqueta */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: project.statusColor }}>
              {/* {project.status === "Completado" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              )}
              {project.status === "En espera" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              )} */}
              {projectStatus}
            </div>

            {/* Fechas  */}
            <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
              {dates.map((date, i) => date && (
                <span key={i} className="flex items-center space-x-1">
                  {icons[date.icon]} {/* Si hay más fechas de revisión, usa el icono del reloj */}
                  <span>{formatDate(date.date)}</span>
                </span>
              ))}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
