"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getIdeas } from "@lib/ideas"
import { PlusCircle, Loader2, AlertCircle, User } from "lucide-react"

// Paleta de colores moderna para las áreas
const areaColors = {
  INSO: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-600" },
  MAIS: { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-600" },
  FIIS: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-600" },
  DIPI: { bg: "bg-rose-50", border: "border-rose-400", text: "text-rose-600" },
  ANIV: { bg: "bg-violet-50", border: "border-violet-400", text: "text-violet-600" },
  DIDI: { bg: "bg-fuchsia-50", border: "border-fuchsia-400", text: "text-fuchsia-600" },
}

// Colores por defecto para áreas no definidas
const defaultAreaStyle = { bg: "bg-slate-50", border: "border-slate-400", text: "text-slate-600" }

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const data = await getIdeas()
        setIdeas(data)
      } catch (err) {
        setError(err.message || "Error al cargar las ideas")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-black animate-spin" />
          <p className="text-slate-600 font-medium">Cargando ideas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">No se pudieron cargar las ideas</h2>
            <p className="text-slate-600">{error}</p>
            <button
              className="mt-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all"
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado moderno */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">Ideas</h1>
          <p className="mt-2 text-slate-500">Explora y descubre nuevas ideas innovadoras</p>
        </div>
        <Link
          href="/admin/ideas/newIdeas"
          className="group px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Nueva Idea</span>
        </Link>
      </div>

      {/* Grid de tarjetas moderno */}
      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas.map((idea) => {
            const areaStyle = areaColors[idea.grado] || defaultAreaStyle

            return (
              <Link
                href={`/admin/ideas/${idea._id}`}
                key={idea._id}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-slate-100 hover:border-transparent"
              >
                <div className={`${areaStyle.bg} p-6 flex flex-col h-full`}>
                  <div className="mb-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${areaStyle.bg} ${areaStyle.text} border ${areaStyle.border}`}
                    >
                      {idea.grado || "General"}
                    </span>
                  </div>
                  <h2 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-black transition-colors line-clamp-2">
                    {idea.nombre}
                  </h2>
                  <p className="text-slate-600 line-clamp-3 mb-6 flex-grow">{idea.descripcion}</p>
                  <div className="flex items-center mt-auto pt-4 border-t border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-600">{idea.usuario?.name || "Desconocido"}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="max-w-md">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <PlusCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">No hay ideas todavía</h2>
            <p className="text-slate-600 mb-6">Sé el primero en compartir una idea innovadora con la comunidad</p>
            <Link
              href="/ideas/newIdeas"
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Crear la primera idea</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

