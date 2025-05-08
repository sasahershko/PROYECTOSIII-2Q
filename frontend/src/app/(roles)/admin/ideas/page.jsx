"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIdeas } from "@lib/ideas";
import { PlusCircle, AlertCircle, User } from "lucide-react";
import SpinLoader from "@/components/SpinLoader";

const areaColors = {
  INSO: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/80",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  MAIS: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/80",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  FIIS: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/80",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  DIPI: {
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/80",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
  ANIV: {
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/80",
    border: "border-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  DIDI: {
    bg: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/80",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700",
    badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  },
};

// Default colors for undefined areas
const defaultAreaStyle = {
  bg: "bg-[#f5f5f5]", // Light gray
  shadow: "shadow-[2px_3px_10px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]",
  rotate: "rotate-[0deg]",
  text: "text-slate-800",
  badge: "bg-slate-100 text-slate-800 border-slate-200",
};

// Rotation variations for a more natural look
const rotations = [
  "rotate-[0.5deg]",
  "rotate-[-0.5deg]",
  "rotate-[1deg]",
  "rotate-[-1deg]",
  "rotate-[1.5deg]",
  "rotate-[-1.5deg]",
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const data = await getIdeas();
        setIdeas(data);
      } catch (err) {
        setError(err.message || "Error al cargar las ideas");
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    }

    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex flex-col gap-6">
            <SpinLoader size="86" />
            <p className="text-slate-700 font-medium">Cargando ideas</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-red-100">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                No se pudieron cargar las ideas
              </h2>
              <p className="text-slate-600">{error}</p>
            </div>
            <button
              className="mt-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Modern header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">
            Ideas
          </h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Explora y descubre nuevas ideas innovadoras
          </p>
        </div>
        <Link
          href="/admin/ideas/newIdeas"
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Nueva Idea</span>
        </Link>
      </div>

      {/* Post-it note style card grid */}
      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ideas.map((idea, index) => {
            const areaStyle = areaColors[idea.grado] || defaultAreaStyle;
            // Use a different rotation for each card to create a natural look
            const rotationClass = rotations[index % rotations.length];

            return (
              <Link
                href={`/admin/ideas/${idea._id}`}
                key={idea._id}
                className={`group flex flex-col h-full relative transition-all duration-300 hover:z-10 hover:-translate-y-1`}
              >
                {/* Post-it note card with dog-ear effect */}
                <div
                  className={`${areaStyle.bg} ${areaStyle.shadow} ${rotationClass} p-6 flex flex-col h-full rounded-sm transition-all duration-300 hover:shadow-lg relative overflow-hidden`}
                >
                  {/* Dog-ear corner effect */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-transparent shadow-[-2px_2px_3px_rgba(0,0,0,0.1)] z-10"></div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[rgba(0,0,0,0.06)]"></div>

                  <div className="mb-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-md ${areaStyle.badge} border transition-all duration-300 shadow-sm`}
                    >
                      {idea.grado || "General"}
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl text-slate-800 mb-3 transition-all duration-300 line-clamp-2 font-[system-ui]">
                    {idea.nombre}
                  </h2>
                  <p className="text-slate-700 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed font-[system-ui]">
                    {idea.descripcion}
                  </p>
                  <div className="flex items-center mt-auto pt-4 border-t border-slate-300/30 transition-colors duration-300">
                    <div className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center mr-3 transition-all duration-300 shadow-sm">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">
                      {idea.usuario?.name || "Desconocido"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#fff9c4] rounded-sm shadow-md border-b-[3px] border-b-yellow-300 transition-all duration-300 hover:shadow-lg rotate-[0.5deg]">
          <div className="max-w-md">
            <div className="h-16 w-16 rounded-full bg-white/70 shadow-sm flex items-center justify-center mx-auto mb-6 transition-all duration-300">
              <PlusCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              No hay ideas todavía
            </h2>
            <p className="text-slate-700 mb-6">
              Sé el primero en compartir una idea innovadora con la comunidad
            </p>
            <Link
              href="/ideas/newIdeas"
              className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 inline-flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Crear la primera idea</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
