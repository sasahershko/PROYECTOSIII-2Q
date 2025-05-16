"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "@/lib/projects";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import areaImages from "@/lib/areaImages";
import Link from "next/link";

export default function CarruselProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  const areaColors = {
    INSO: "bg-blue-400",
    MAIS: "bg-red-400",
    FIIS: "bg-green-400",
    DIPI: "bg-cyan-400",
    ANIV: "bg-yellow-400",
    DIDI: "bg-pink-400",
    OTROS: "bg-gray-400",
  };

  const statusColors = {
    "No iniciado": "bg-gray-500",
    "En proceso": "bg-blue-500",
    "En espera": "bg-orange-500",
    Completado: "bg-green-600",
  };

  const proyectosFiltrados = proyectos.filter(
    (p) => p._id !== proyectoSeleccionado?._id
  );
  const totalPages = Math.ceil(proyectosFiltrados.length / itemsPerPage);

  const proyectosAMostrar = proyectosFiltrados.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    getProjects().then((data) => {
      setProyectos(data);
      if (data.length > 0) setProyectoSeleccionado(data[0]);
      setLoading(false); // ← Cuando termina
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-10 mb-10 min-h-[120px]">
        <h2 className="text-5xl font-[730] inline-block text-primary-text">
          <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
            Proyectos
          </span>
          <span> Destacados</span>
        </h2>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-10 mb-10 min-h-[120px]">
        <h2 className="text-5xl font-[730] inline-block text-primary-text">
          <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
            Proyectos
          </span>
          <span> Destacados</span>
        </h2>
        <p className="mt-10 text-gray-400 text-center text-lg">
          No hay proyectos disponibles en este momento.
        </p>
      </div>
    );
  }
  console.log(proyectos)

  return (
    <div id="proyectos" className="w-full max-w-7xl px-10 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-5xl font-[730] inline-block text-primary-text">
          <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
            Proyectos
          </span>
          <span> Destacados</span>
        </h2>

        <Link href="/projects">
          <button className="mb-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
            Ver Más Proyectos
          </button>
        </Link>
      </div>

      {/* Contenedor de Imagen + Grid con más ancho para la imagen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Proyecto destacado */}
        <div className="relative rounded-lg overflow-hidden shadow-md flex flex-col h-[545px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={proyectoSeleccionado?._id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-[380px]"
            >
              <img
                src={
                  proyectoSeleccionado?.image ||
                  areaImages[proyectoSeleccionado?.area] ||
                  areaImages["OTROS"]
                }
                alt={proyectoSeleccionado?.name}
                className="w-full h-full object-cover"
              />

              {/* Info extra */}
              <div className="flex-col left-0 w-full h-[150px] bg-opacity-90 p-4">
                <span
                  className={`text-xs font-semibold text-white inline-block mb-2 px-2 py-1 rounded-full ${
                    areaColors[proyectoSeleccionado?.area] || "bg-gray-400"
                  }`}
                >
                  {proyectoSeleccionado?.area}
                </span>
                <h3 className="text-xl font-bold">
                  {proyectoSeleccionado?.name}
                </h3>
                <p className="text-sm line-clamp-2">
                  {proyectoSeleccionado?.description}
                </p>
                <Link href="/projects">
                  <span className="text-blue-600 text-sm font-semibold inline-block hover:underline">
                    Ver más →
                  </span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contenedor del grid con flechas a los lados */}
        <div className="relative w-full">
          {/* Flecha izquierda */}
          <button
            onClick={prevPage}
            className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 text-gray-700"
          >
            <FaChevronLeft size={10} />
          </button>

          {/* Grid de proyectos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {proyectosAMostrar.map((proyecto, idx) => (
              <motion.button
                key={idx}
                onClick={() => setProyectoSeleccionado(proyecto)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group rounded-lg overflow-hidden shadow hover:shadow-md transition-all text-left h-full min-h-[265px]
                  ${
                    proyectoSeleccionado?._id === proyecto._id
                      ? "shadow-lg shadow-gray-400/50"
                      : ""
                  }`}
              >
                {/* Imagen */}
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={
                      proyecto.image ||
                      areaImages[proyecto.area] ||
                      areaImages["OTROS"]
                    }
                    alt={proyecto.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información */}
                <div className="p-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
                      areaColors[proyecto.area] || "bg-gray-400"
                    }`}
                  >
                    {proyecto.area}
                  </span>
                  <h4 className="mt-2 font-bold text-md line-clamp-2 leading-tight">
                    {proyecto.name}
                  </h4>
                  <p className="text-xs dark:text-gray-400 line-clamp-2 mt-2">
                    {proyecto.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Flecha derecha */}
          <button
            onClick={nextPage}
            className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 text-gray-700"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
