"use client";

import React from "react";
import { formatDate, getProjectDates } from "@/utils/projectUtils";
import { LuCalendar, LuClock, LuHourglass } from "react-icons/lu";
import Image from "next/image";

const areaColors = {
  INSO: "bg-blue-400",
  MAIS: "bg-red-400",
  FIIS: "bg-green-400",
  DIPI: "bg-cyan-400",
  ANIV: "bg-yellow-400",
  DIDI: "bg-pink-400",
};

const statusColors = {
  "No iniciado": "bg-gray-500",
  "En curso": "bg-yellow-500",
  "En espera": "bg-orange-500",
  Completado: "bg-green-500",
};

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-cyan-500",
  "bg-orange-500",
];

export default function ProjectCard({ project, role }) {
  const icons = {
    calendar: <LuCalendar className="w-4 h-4" />,
    clock: <LuClock className="w-4 h-4" />,
    hourglass: <LuHourglass className="w-4 h-4" />,
  };

  const getInitials = (user) => {
    if (!user || (!user.name && !user.surname)) return "??";
    const nameInitial = user.name?.charAt(0).toUpperCase() || "";
    const surnameInitial = user.surname?.charAt(0).toUpperCase() || "";
    return `${nameInitial}${surnameInitial}`;
  };

  const projectStatus =
    project.pStatus?.length > 0
      ? project.pStatus[project.pStatus.length - 1].status
      : "No iniciado";

  project.categoryColor = areaColors[project.area] || "bg-gray-300";
  project.statusColor = statusColors[projectStatus] || "bg-gray-500";
  const dates = getProjectDates(project);

  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-card hover-grow relative">
      {/* Imagen de cabecera */}
      <div className="h-48 relative w-full">
        {project.image && (
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover rounded-t-xl"
          />
        )}
      </div>

      {/* Contenido */}
      <div
        className={`relative p-4 pt-10 flex flex-col justify-between flex-grow ${project.categoryColor}`}
      >
        <div className="absolute -top-4 left-4">
          <div
            className={`inline-block px-5 py-1 ${project.categoryColor} rounded-tl-lg rounded-lg`}
          >
            <span className="text-sm font-semibold text-white">
              {project.area}
            </span>
          </div>
        </div>

        <h3 className="text-primary-text font-bold text-lg">{project.name}</h3>
        <p className="text-sm text-gray-700 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {project.description}
        </p>

        {(role === "admin" || role === "user") && (
          <>
            {/* Avatares */}
            <div className="absolute top-1 right-5 flex -space-x-5">
              {project.users.map((u, i) =>
                u.profileImage ? (
                  <Image
                    key={u._id}
                    src={u.profileImage}
                    alt={`${u.name} ${u.surname}`}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div
                    key={u._id}
                    className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-sm font-semibold border-2 border-white`}
                  >
                    {getInitials(u)}
                  </div>
                )
              )}
            </div>

            {/* Estado del proyecto */}
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: project.statusColor }}
            >
              {projectStatus}
            </div>

            {/* Fechas del proyecto */}
            <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
              {dates.map(
                (date, i) =>
                  date && (
                    <span key={i} className="flex items-center space-x-1">
                      {icons[date.icon]}
                      <span>{formatDate(date.date)}</span>
                    </span>
                  )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
