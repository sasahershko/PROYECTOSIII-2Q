"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getProfile } from "@lib/profile"
import { createIdea } from "@lib/ideas"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Save } from "lucide-react"

// Paleta de colores moderna para las áreas (igual que en la página de ideas)
const areaColors = {
  INSO: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-600" },
  MAIS: { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-600" },
  FIIS: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-600" },
  DIPI: { bg: "bg-rose-50", border: "border-rose-400", text: "text-rose-600" },
  ANIV: { bg: "bg-violet-50", border: "border-violet-400", text: "text-violet-600" },
  DIDI: { bg: "bg-fuchsia-50", border: "border-fuchsia-400", text: "text-fuchsia-600" },
}

export default function NewIdeaPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  })

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile()
        setUser(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
        setError("No se pudo cargar tu perfil. Por favor, inténtalo de nuevo.")
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!user) {
      setError("No se ha podido obtener el usuario autenticado.")
      setSubmitting(false)
      return
    }

    const ideaData = {
      ...formData,
      usuario: user.id,
    }

    try {
      await createIdea(ideaData)
      setSuccess(true)

      // Redirigir después de mostrar el mensaje de éxito brevemente
      setTimeout(() => {
        router.push("/admin/ideas")
      }, 1500)
    } catch (error) {
      console.error(error)
      setError("Error al crear la idea. Por favor, inténtalo de nuevo.")
      setSubmitting(false)
    }
  }

  // Obtener el color del área seleccionada para la vista previa
  const selectedAreaStyle = areaColors[formData.grado] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-400",
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-black animate-spin" />
          <p className="text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-8 gap-4">
        <Link
          href="/admin/ideas"
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Volver a ideas"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Crear Nueva Idea</h1>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <p className="text-emerald-700 font-medium">¡Idea creada con éxito! Redirigiendo...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <p className="text-rose-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la idea</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Escribe un nombre descriptivo"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black transition-colors outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                placeholder="Describe tu idea en detalle"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black transition-colors outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Grado</label>
              <select
                value={formData.grado}
                onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black transition-colors outline-none appearance-none bg-white"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="INSO">INSO</option>
                <option value="MAIS">MAIS</option>
                <option value="FIIS">FIIS</option>
                <option value="DIPI">DIPI</option>
                <option value="ANIV">ANIV</option>
                <option value="DIDI">DIDI</option>
              </select>
            </div>

            {/* Vista previa de la etiqueta */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-2">Vista previa de la etiqueta:</p>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${selectedAreaStyle.bg} ${selectedAreaStyle.text} border ${selectedAreaStyle.border}`}
              >
                {formData.grado}
              </span>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/admin/ideas"
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting || success}
                className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Crear Idea</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

