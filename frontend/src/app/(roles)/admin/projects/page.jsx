"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Card from "@components/Card";
import AdminNavBar from "@/components/admin/AdminNavBar";

export default function ProjectDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
      <AdminNavBar />

      {/* Grid de proyectos */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl overflow-hidden shadow-lg bg-card hover-grow relative">
              {/* Imagen */}
              <div className="h-48 bg-primary text-primary-text flex items-center justify-center rounded-t-xl">
                Imagen
              </div>

              {/* Contenido */}
              <div className={`relative p-4 ${project.categoryColor}`}>


                {/* Categoría con diseño redondeado */}
                <div className="absolute -top-4 left-4">
                  {/* Contenedor de la categoría con bordes curvados */}
                  <div className={`relative inline-block px-5 py-1 ${project.categoryColor} rounded-tl-lg rounded-lg`}>
                    {/* Texto de la categoría */}
                    <span className="relative z-20 text-sm font-semibold text-white">{project.category}</span>
                  </div>
                </div>


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

                {/* Nombre del proyecto */}
                <h3 className="mt-6 text-primary-text font-bold text-lg">{project.name}</h3>

                {/* Estado del proyecto con bolita de color */}
                <div className="flex items-center mt-1">
                  <span className={`w-3 h-3 rounded-full ${project.statusColor} mr-2`} />
                  <span className="text-sm">{project.status}</span>
                </div>

                {/* Fechas centradas - PONGO LOS SVGS PORQUE SE PUEDEN PONER EN EL COLOR QUE QUERAMOS*/}
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
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

}
