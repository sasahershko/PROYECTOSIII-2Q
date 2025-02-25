"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AdminNavBar from "@/components/admin/ProjectsNavBar";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const userRole = "admin"

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-primary-bg text-primary-text">Cargando...</div>;
  }

  const projects = [
    {
      id: 1,
      name: "Nombre del Proyecto",
      category: "Videojuegos",
      categoryColor: "bg-purple-400",
      status: "No iniciado",
      statusColor: "bg-gray-500",
      dates: ["20 Abr 2023", "20 Mar 2025", "20 Jun 2025"],
      users: ["/tempPhotos/img1.jpeg", "/tempPhotos/img2.jpeg"],
    },
    {
      id: 2,
      name: "Nombre del Proyecto",
      category: "Animación",
      categoryColor: "bg-yellow-300",
      status: "En curso",
      statusColor: "bg-green-500",
      dates: ["20 Abr 2023", "20 Mar 2025", "20 Jun 2025"],
      users: ["/tempPhotos/img1.jpeg", "/tempPhotos/img2.jpeg", "/tempPhotos/img5.jpg"],
    },
    {
      id: 3,
      name: "Nombre del Proyecto",
      category: "Ingeniería",
      categoryColor: "bg-blue-300",
      status: "En espera",
      statusColor: "bg-yellow-600",
      dates: ["20 Abr 2023", "20 Mar 2025", "20 Jun 2025"],
      users: ["/tempPhotos/img1.jpeg", "/tempPhotos/img2.jpeg"],
    },
    {
      id: 4,
      name: "Nombre del Proyecto",
      category: "Diseño Digital",
      categoryColor: "bg-pink-300",
      status: "Completado",
      statusColor: "bg-red-500",
      dates: ["20 Abr 2023", "20 Mar 2025", "20 Jun 2025"],
      users: ["/tempPhotos/img1.jpeg", "/tempPhotos/img2.jpeg", "/tempPhotos/img5.jpg"],
    },
  ];

    return (
      <div className="min-h-screen bg-primary-bg text-primary-text">
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} role={userRole} />
            ))}
          </div>
        </main>
      </div>
    );

}
