// app/(admin)/ideas/page.jsx o pages/admin/ideas/index.jsx
"use client";

import { useState, useEffect } from "react";
import SpinLoader from "@/components/SpinLoader";
import { AlertCircle, PlusCircle } from "lucide-react";
import { getIdeas } from "@lib/ideas";
import IdeaCard from "@/components/IdeaCard";
import { motion } from "framer-motion";

const rotations = [
  "rotate-[0.5deg]",
  "rotate-[-0.5deg]",
  "rotate-[1deg]",
  "rotate-[-1deg]",
  "rotate-[1.5deg]",
  "rotate-[-1.5deg]",
];

// Variants for staggering card animations
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
            <SpinLoader />
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
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No se pudieron cargar las ideas
            </h2>
            <p className="text-slate-600">{error}</p>
            <button
              className="mt-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900"
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-text">
            Ideas
          </h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Explora y descubre nuevas ideas innovadoras
          </p>
        </div>
        <PlusCircleLink />
      </div>

      {ideas.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ideas.map((idea, idx) => (
            <motion.div
              key={idea._id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, zIndex: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <IdeaCard
                idea={idea}
                rotationClass={rotations[idx % rotations.length]}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function PlusCircleLink() {
  return (
    <a
      href="/admin/ideas/newIdeas"
      className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-slate-900"
    >
      <PlusCircle className="h-5 w-5" />
      <span>Nueva Idea</span>
    </a>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#fff9c4] rounded-sm shadow-md border-b-[3px] border-b-yellow-300 hover:shadow-lg rotate-[0.5deg]">
      <div className="h-16 w-16 rounded-full bg-white/70 shadow-sm flex items-center justify-center mx-auto mb-6">
        <PlusCircle className="h-8 w-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-3">
        No hay ideas todavía
      </h2>
      <p className="text-slate-700 mb-6">
        Sé el primero en compartir una idea innovadora con la comunidad
      </p>
      <a
        href="/ideas/newIdeas"
        className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium inline-flex items-center gap-2 hover:bg-slate-900"
      >
        <PlusCircle className="h-5 w-5" />
        <span>Crear la primera idea</span>
      </a>
    </div>
  );
}
