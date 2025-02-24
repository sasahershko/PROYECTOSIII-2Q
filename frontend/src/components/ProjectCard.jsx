"use client";

import React from "react";

export default function ProjectCard ({ project, role }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-card hover-grow relative">
      {/* Imagen (Visible para todos) */}
      <div className="h-48 bg-primary text-primary-text flex items-center justify-center rounded-t-xl">
        Imagen
      </div>

      {/* Contenido */}
      <div className={`relative p-4 ${project.categoryColor}`}>
        {/* Categoría con diseño redondeado (Visible para todos) */}
        <div className="absolute -top-4 left-4">
          <div className={`relative inline-block px-5 py-1 ${project.categoryColor} rounded-tl-lg rounded-lg`}>
            <span className="relative z-20 text-sm font-semibold text-white">{project.category}</span>
          </div>
        </div>

        {/* Nombre del proyecto (Visible para todos) */}
        <h3 className="mt-6 text-primary-text font-bold text-lg">{project.name}</h3>

        {/* Breve descripción (Visible para todos) */}
        <p className="text-sm text-gray-700 mt-2">Descripción breve del proyecto...</p>

        {/* Solo se muestra al admin */}
        {role === "admin" && (
          <>
            {/* Avatares alineados */}
            <div className="absolute top-7 right-10 flex -space-x-5">
              {project.users.map((user, i) => (
                <img
                  key={i}
                  src={user}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>

            {/* Estado del proyecto con etiqueta */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold"
                 style={{ backgroundColor: project.statusColor }}>
              {project.status === "Completado" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              )}
              {project.status === "En espera" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              )}
              {project.status}
            </div>

            {/* Fechas centradas con íconos */}
            <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
              {project.dates.map((date, i) => {
                const icons = [
                  <svg key="calendar" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
                  <svg key="clock" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
                  <svg key="hourglass" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12"></path><path d="M6 22h12"></path><path d="M6 2c0 4 6 4 6 8s-6 4-6 8"></path><path d="M18 2c0 4-6 4-6 8s6 4 6 8"></path></svg>
                ];
                return (
                  <span key={i} className="flex items-center space-x-1">
                    {icons[i]}
                    <span>{date}</span>
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

