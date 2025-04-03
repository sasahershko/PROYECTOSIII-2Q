"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getIdeas } from "@lib/ideas"; 

const areaColors = {
  INSO: "bg-blue-100",
  MAIS: "bg-green-100",
  FIIS: "bg-yellow-100",
  DIPI: "bg-red-100",
  ANIV: "bg-purple-100",
  DIDI: "bg-pink-100",
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, []);

  if (loading) return <div className="p-6">Cargando ideas...</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ideas</h1>
        <Link
          href="/ideas/newIdeas"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Crear Nueva Idea
        </Link>
      </div>

      {/* Grid de tarjetas */}
      <div className="flex flex-wrap justify-center gap-6">
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <Link
              href={`/ideas/${idea._id}`}
              key={idea._id}
              className="w-[25%] aspect-square border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <div className={`${areaColors[idea.grado] || "bg-gray-100"} h-2 w-full`} />
              <div className="p-4 flex flex-col justify-between h-[calc(100%-0.5rem)]">
                <div>
                  <h2 className="font-bold text-lg">{idea.nombre}</h2>
                  <p className="text-sm text-gray-600">{idea.descripcion}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Creado por: {idea.usuario?.name || "Desconocido"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No hay ideas para mostrar</p>
        )}
      </div>
    </div>
  );
}
