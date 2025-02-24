
"use client";

import { useEffect, useState } from "react";
import AdminNavBar from "@/components/admin/ProjectsNavBar";
import ProjectCard from "@/components/ProjectCard";
import { getUserRole } from "@/lib/authClient";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([{
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
  },]);
  const [userRole, setUserRole] = useState("guest"); //por defecto, invitado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        console.log("Ejecutando getUserRole() en cliente...");
        const role = await getUserRole();
        console.log("Rol obtenido antes de setUserRole:", role);
        setUserRole(prevRole => {
          console.log("Estado userRole antes de actualizar:", prevRole);
          return role;
        });
      } catch (error) {
        console.error("Error obteniendo el rol en cliente", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchUserRole();
  }, []);
  


  if (loading) {
    return <div className="min-h-screen bg-primary-bg text-primary-text flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      <AdminNavBar />
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
