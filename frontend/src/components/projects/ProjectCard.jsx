"use client";

import React, { useState, useEffect } from "react";
import { formatDate, getProjectDates } from "@/utils/projectUtils";
import { getProfileById } from "@/lib/profile";
import { LuCalendar, LuClock, LuHourglass } from "react-icons/lu";
import Image from "next/image";

export default function ProjectCard({ project, role }) {
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

  // map our utility icons
  const icons = {
    calendar: <LuCalendar className="w-4 h-4" />,
    clock: <LuClock className="w-4 h-4" />,
    hourglass: <LuHourglass className="w-4 h-4" />,
  };

  // load full user profiles
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  useEffect(() => {
    async function load() {
      if (!project.users?.length) {
        setParticipants([]);
        setLoadingParticipants(false);
        return;
      }
      setLoadingParticipants(true);
      const all = await Promise.all(
        project.users.map((id) => getProfileById(id).catch(() => null))
      );
      setParticipants(all.filter(Boolean));
      setLoadingParticipants(false);
    }
    load();
  }, [project.users]);

  const getInitials = (u) =>
    ((u.name?.[0] || "") + (u.surname?.[0] || "")).toUpperCase();

  const projectStatus =
    project.pStatus?.length > 0
      ? project.pStatus[project.pStatus.length - 1].status
      : "No iniciado";

  const areaColor = areaColors[project.area] || "bg-gray-300";
  const statusColor = statusColors[projectStatus] || "bg-gray-500";
  const dates = getProjectDates(project);

  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-card hover-grow relative">
      {/* Imagen */}
      <div className="h-48 bg-primary select-none text-primary-text flex items-center justify-center rounded-t-xl">
        {project.image ? (
          <Image
            src={project.image || "/placeholder.svg?height=350&width=700"}
            alt={project.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium">
              Imagen no disponible
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div
        className={`relative p-4 pt-10 flex flex-col justify-between flex-grow ${areaColor}`}
      >
        <div className="absolute -top-4 left-4">
          <div
            className={`inline-block px-5 py-1 ${areaColor} rounded-tl-lg rounded-lg`}
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
              {loadingParticipants
                ? project.users.map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))
                : participants.map((u) =>
                    u.profileImage ? (
                      <img
                        key={u.id}
                        src={u.profileImage}
                        alt={`${u.name} ${u.surname}`}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div
                        key={u.id}
                        className="w-10 h-10 rounded-full bg-primary-bg text-primary-text flex items-center justify-center text-sm font-bold border-2 border-white"
                      >
                        {getInitials(u)}
                      </div>
                    )
                  )}
            </div>

            {/* Estado */}
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: statusColor }}
            >
              {projectStatus}
            </div>

            {/* Fechas */}
            <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
              {dates.map(
                (d, i) =>
                  d && (
                    <span key={i} className="flex items-center space-x-1">
                      {icons[d.icon]}
                      <span>{formatDate(d.date)}</span>
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
