"use client";

import useProjects from "@/hooks/useProjects";
import useUserRole from "@/hooks/useUserRole";
import ProjectCard from "@/components/projects/ProjectCard";
import SpinLoader from "@/components/SpinLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

const estados = ["No completado", "Completado"];
const grados = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"];

export default function AdminProjectDashboard() {
  const { projects, loading } = useProjects();
  const userRole = useUserRole();
  const router = useRouter();

  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const proyectosFiltrados = useMemo(() => {
    let filtrados = [...projects];

    if (filtroEstado) {
      filtrados = filtrados.filter((p) => {
        const estadoNormalizado = p.status === "COMPLETED" ? "Completado" : "No completado";
        return estadoNormalizado === filtroEstado;
      });
    }

    if (filtroGrado) {
      filtrados = filtrados.filter((p) => p.area === filtroGrado);
    }

    if (searchText) {
      filtrados = filtrados.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    filtrados.sort((a, b) => {
      const aFecha = new Date(a.reviewDates?.[0]);
      const bFecha = new Date(b.reviewDates?.[0]);
      return ordenFecha === "asc" ? aFecha - bFecha : bFecha - aFecha;
    });

    return filtrados;
  }, [projects, filtroEstado, filtroGrado, searchText, ordenFecha]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-4">
        {/* Botones superiores */}
        <div className="flex gap-2">
          <Link
            href="/projects/newProject"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo Proyecto
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
          >
            Opciones
          </Link>
        </div>

        {/* Filtro + búsqueda */}
        <div className="flex items-center gap-4 relative">
          {/* Buscador */}
          <div className="relative">
            <input type="text" placeholder="Buscar proyectos..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="px-4 py-2 pl-8 border border-gray-300 rounded"/>
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-4.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </button>

          {/* Botón para ordenar por fecha */}
          <button
            onClick={() =>
              setOrdenFecha((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="p-2 hover:bg-gray-200 rounded transition"
            title={`Ordenar por fecha (${ordenFecha === "asc" ? "ascendente" : "descendente"})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>

          {/* Mini menú desplegable */}
          {mostrarFiltros && (
            <div className="absolute top-12 right-0 z-10 mt-2 bg-white border border-gray-300 rounded shadow-md w-56 p-3">
              <div className="mb-2">
                <p className="text-sm font-semibold mb-1">Estado</p>
                {estados.map((estado) => (
                  <button
                    key={estado}
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                      filtroEstado === estado ? "bg-gray-200 font-semibold" : ""
                    }`}
                    onClick={() =>
                      setFiltroEstado(filtroEstado === estado ? "" : estado)
                    }
                  >
                    {estado}
                  </button>
                ))}
              </div>
              <hr className="my-2" />
              <div>
                <p className="text-sm font-semibold mb-1">Grado</p>
                {grados.map((grado) => (
                  <button
                    key={grado}
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                      filtroGrado === grado ? "bg-gray-200 font-semibold" : ""
                    }`}
                    onClick={() =>
                      setFiltroGrado(filtroGrado === grado ? "" : grado)
                    }
                  >
                    {grado}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de proyectos */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {proyectosFiltrados.length === 0 ? (
            <p>No existen proyectos</p>
          ) : (
            proyectosFiltrados.map((project) => (
              <div
                key={project._id}
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <ProjectCard project={project} role={userRole} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
