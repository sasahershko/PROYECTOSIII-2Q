'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "@/lib/projects";
import areaImages from "@/lib/areaImages";
import Link from "next/link";

export default function CarruselProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const areaColors = {
    "INSO": "bg-blue-400",
    "MAIS": "bg-red-400",
    "FIIS": "bg-green-400",
    "DIPI": "bg-cyan-400",
    "ANIV": "bg-yellow-400",
    "DIDI": "bg-pink-400",
    "OTROS": "bg-gray-400"
  };

  const statusColors = {
    "No iniciado": "bg-gray-500",
    "En proceso": "bg-blue-500",
    "En espera": "bg-orange-500",
    "Completado": "bg-green-600"
  };

  useEffect(() => {
    getProjects().then((data) => {
      setProyectos(data);
      if (data.length > 0) setProyectoSeleccionado(data[0]); // Selecciona el primero por defecto
    });
  }, []);

  if (proyectos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 min-h-[120px]">
        <h2 className="text-2xl font-bold mb-4 bg-card p-2 px-4 text-align-left inline-block">
          PROYECTOS EN DESARROLLO
        </h2>
        <p className="text-gray-400 text-center text-lg">
          No hay proyectos disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div id="proyectos" className="w-full max-w-7xl px-10 mb-12"> {/* Se añadió mb-28 para margen inferior */}
      <h2 className="text-2xl font-bold mb-6 bg-card p-2 px-4 inline-block">
        PROYECTOS EN DESARROLLO
      </h2>

      {/* Contenedor de Imagen + Grid con más ancho para la imagen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4"> {/* Aumentamos el ancho de la imagen */}

        {/* Imagen del Proyecto Seleccionado con Animación */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center w-full h-[400px] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={proyectoSeleccionado?._id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <img
                src={areaImages[proyectoSeleccionado?.area] || areaImages["Otros"]}
                alt={proyectoSeleccionado?.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Grid de Proyectos */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full">
          {proyectos.slice(0, 8).map((proyecto, idx) => (
            <motion.button
              key={idx}
              onClick={() => setProyectoSeleccionado(proyecto)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white w-full h-[120px] p-0
                ${proyectoSeleccionado?._id === proyecto._id ? 'shadow-lg shadow-gray-400/50' : ''}
              `}
            >
              {/* Imagen según el área */}
              <div className="w-full h-[75%] bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={areaImages[proyecto.area] || areaImages["Otros"]} alt={proyecto.name} className="w-full h-full object-cover" />
              </div>
            
              {/* Área del grado */}
              <div
                className={`w-full h-[25%] flex items-center justify-center text-white text-xs font-semibold transition-all
                  ${areaColors[proyecto.area] || 'bg-gray-400'}
                `}
              >
                {proyecto.area}
              </div>
            </motion.button> 
          ))}

          {/* Ver más proyectos */}
          <Link
            href="/admin/projects"
            className="border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all text-center h-[105px]"
          >
            + Ver más
            <br />
            proyectos
          </Link>
        </div>
      </div>

      {/* Detalle del Proyecto Seleccionado con Animación */}
      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={proyectoSeleccionado?._id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md border p-4 rounded-lg"
          >
            <h3 className="text-lg font-bold">{proyectoSeleccionado?.name}</h3>
            <p className="mt-2 text-gray-600">{proyectoSeleccionado?.description}</p>
            <div className="mt-3 flex gap-3">
              <span
                className={`px-2 py-1 rounded-md text-white text-xs ${
                  areaColors[proyectoSeleccionado?.area] || 'bg-gray-400'
                }`}
              >
                {proyectoSeleccionado?.area}
              </span>
              <span
                className={`px-2 py-1 rounded-md text-white text-xs ${
                  statusColors[
                    proyectoSeleccionado?.pStatus?.[proyectoSeleccionado.pStatus.length - 1]?.status
                  ] || 'bg-gray-400'
                }`}
              >
                {proyectoSeleccionado?.pStatus?.[proyectoSeleccionado.pStatus.length - 1]?.status || 'Sin estado'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
);

}
