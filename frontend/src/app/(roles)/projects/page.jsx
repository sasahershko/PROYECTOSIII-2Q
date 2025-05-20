"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useProjects from "@/hooks/useProjects";
import useUserRole from "@/hooks/useUserRole";
import ProjectCard from "@/components/projects/ProjectCard";
import SpinLoader from "@/components/SpinLoader";
import {
  LuSearch,
  LuFilter,
  LuClockArrowDown,
  LuClockArrowUp,
} from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

const estadosDisponibles = ["Completado", "No completado"];
const gradosDisponibles = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"];

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

// Mapear el nombre del estado al color correspondiente
const estadoColorsMap = {
  Completado: statusColors["Completado"],
  "No completado": statusColors["No iniciado"],
};

export default function AdminProjectDashboard() {
  const { projects, loading } = useProjects();
  const userRole = useUserRole();
  const router = useRouter();

  const [selectedEstados, setSelectedEstados] = useState([]);
  const [selectedGrados, setSelectedGrados] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Cerrar modal al clicar fuera
  const modalRef = useRef(null);
  useEffect(() => {
    function onClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    }
    if (showFilters) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showFilters]);

  const toggleItem = (item, list, setList) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const proyectosFiltrados = useMemo(() => {
    return projects
      .filter((p) => {
        if (!selectedEstados.length) return true;
        const estadoNorm =
          p.status === "COMPLETED" ? "Completado" : "No completado";
        return selectedEstados.includes(estadoNorm);
      })
      .filter((p) => {
        if (!selectedGrados.length) return true;
        return selectedGrados.includes(p.area);
      })
      .filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const fa = new Date(a.reviewDates?.[0] || 0);
        const fb = new Date(b.reviewDates?.[0] || 0);
        return ordenFecha === "asc" ? fa - fb : fb - fa;
      });
  }, [projects, selectedEstados, selectedGrados, searchText, ordenFecha]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      {/* Top bar */}
      <div className="w-[95%] max-w-8xl mx-auto mt-8 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Título y chips activos */}
        <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
          <h1 className="text-2xl font-bold select-none whitespace-nowrap">
            Dashboard Proyectos
          </h1>
          <div className="flex flex-wrap gap-2 ml-0 md:ml-4">
            {[
              ...selectedEstados.map((e) => ({
                label: e,
                color: estadoColorsMap[e],
                remove: () =>
                  toggleItem(e, selectedEstados, setSelectedEstados),
              })),
              ...selectedGrados.map((g) => ({
                label: g,
                color: areaColors[g],
                remove: () => toggleItem(g, selectedGrados, setSelectedGrados),
              })),
            ].map((chip) => (
              <div
                key={chip.label}
                className={`${chip.color} text-white rounded-full px-3 py-1 text-sm flex items-center gap-2 cursor-pointer select-none`}
                onClick={chip.remove}
              >
                <span>{chip.label}</span>
                <span className="font-bold">×</span>
              </div>
            ))}
          </div>
        </div>
        {/* Buscador, botón filtros y orden */}
        <div className="flex gap-2 items-center">
          <div className="relative group">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secundary-text group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-card border-2 border-secundary-text text-primary-text placeholder-secundary-text rounded px-10 py-2 focus:outline-none focus:border-accent h-10 w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="text-primary-text select-none hover:scale-105 transition duration-150 rounded-full"
            aria-label="Mostrar filtros"
          >
            <LuFilter className="w-6 h-6" />
          </button>
          <button
            onClick={() =>
              setOrdenFecha((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="hover:scale-105 transition duration-150 rounded-full text-primary-text select-none"
            title={`Ordenar por fecha (${ordenFecha})`}
            aria-label="Ordenar por fecha"
          >
            {ordenFecha === "asc" ? (
              <LuClockArrowUp className="w-6 h-6" />
            ) : (
              <LuClockArrowDown className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Filtros en modal animado */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 z-40 flex items-start justify-end modal-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              ref={modalRef}
              className="bg-card rounded-lg p-6 w-64 shadow-xl mt-44 mr-8 select-none"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-secundary-text select-none">
                  Filtros
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 select-none"
                >
                  ×
                </button>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 select-none">Estado</h4>
                <div className="flex flex-col gap-2">
                  {estadosDisponibles.map((est) => (
                    <label
                      key={est}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEstados.includes(est)}
                        onChange={() =>
                          toggleItem(est, selectedEstados, setSelectedEstados)
                        }
                      />
                      <span>{est}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grado */}
              <div>
                <h4 className="font-semibold mb-2 select-none">Grado</h4>
                <div className="flex flex-col gap-2">
                  {gradosDisponibles.map((gr) => (
                    <label
                      key={gr}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGrados.includes(gr)}
                        onChange={() =>
                          toggleItem(gr, selectedGrados, setSelectedGrados)
                        }
                      />
                      <span>{gr}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedEstados([]);
                      setSelectedGrados([]);
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 select-none"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones */}
      <div className="w-[95%] max-w-8xl mx-auto flex gap-2 mb-6 px-4">
        <Link
          href="/projects/newProject"
          className="flex items-center gap-2 px-4 select-none py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      {/* Grid de proyectos */}
      <div className="w-[95%] max-w-8xl mx-auto px-4 pb-8">
        {proyectosFiltrados.length === 0 ? (
          <p className="text-center py-12">No existen proyectos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {proyectosFiltrados.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <div
                    key={project._id}
                    onClick={() => router.push(`/projects/${project._id}`)}
                  >
                    <ProjectCard project={project} role={userRole} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
