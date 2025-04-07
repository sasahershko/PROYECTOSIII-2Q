"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getIdeaById, updateIdea, deleteIdea } from "@lib/ideas"
import { ArrowLeft, Edit2, Trash2, Save, X, Loader2, AlertCircle, User, Check } from "lucide-react"
import DeleteConfirmModal from "@components/DeleteConfirmModal"


// Color palette for different areas - more subtle and professional
const areaColors = {
  INSO: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  MAIS: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  FIIS: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  DIPI: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
  ANIV: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  DIDI: {
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700",
    badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  },
}

// Default colors for undefined areas
const defaultAreaStyle = {
  bg: "bg-slate-50",
  border: "border-slate-200",
  text: "text-slate-700",
  badge: "bg-slate-100 text-slate-700 border-slate-200",
}

export default function IdeaDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    async function fetchIdea() {
      try {
        const data = await getIdeaById(id)
        setIdea(data)
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          grado: data.grado,
        })
      } catch (err) {
        setError(err.message || "No se pudo cargar la idea")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchIdea()
  }, [id])

  const handleUpdate = async () => {
    setIsSubmitting(true)
    try {
      const updated = await updateIdea(id, formData)
      setIdea(updated)
      setIsEditing(false)

      // Show success notification
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setError("Error al actualizar la idea")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteIdea(id)
      router.push("/admin/ideas")
    } catch (err) {
      console.error(err)
      setError("Error al eliminar la idea")
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Get the color of the selected area
  const areaStyle = idea ? areaColors[idea.grado] || defaultAreaStyle : defaultAreaStyle
  const formAreaStyle = areaColors[formData.grado] || defaultAreaStyle

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-slate-800 animate-[spin_1.2s_linear_infinite]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-slate-700 font-medium">Cargando idea...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-red-100">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">No se pudo cargar la idea</h2>
              <p className="text-slate-600">{error}</p>
            </div>
            <Link
              href="/admin/ideas"
              className="mt-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a ideas</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-slate-200">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Idea no encontrada</h2>
              <p className="text-slate-600">La idea que buscas no existe o ha sido eliminada</p>
            </div>
            <Link
              href="/admin/ideas"
              className="mt-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a ideas</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Success notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-emerald-600" />
          </div>
          <p className="font-medium">Idea actualizada correctamente</p>
        </div>
      )}

      {/* Header with back button */}
      <div className="flex items-center mb-8 gap-4">
        <Link
          href="/admin/ideas"
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Volver a ideas"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {isEditing ? "Editar Idea" : "Detalles de la Idea"}
        </h1>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la idea</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Grado</label>
                <select
                  value={formData.grado}
                  onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors outline-none appearance-none"
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

              {/* Label preview */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Vista previa de la etiqueta:</p>
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md ${formAreaStyle.badge}`}>
                  {formData.grado}
                </span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className={`${areaStyle.bg} p-8`}>
            <div className="mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${areaStyle.badge}`}>{idea.grado}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{idea.nombre}</h1>
            <p className="text-slate-600 text-lg whitespace-pre-line mb-8 leading-relaxed">{idea.descripcion}</p>

            <div className="flex items-center pt-6 border-t border-slate-200">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Creado por</p>
                <p className="font-medium text-slate-800">{idea.usuario?.name || "Anónimo"}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 border border-slate-300 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="h-4 w-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-medium hover:bg-rose-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          isLoading={isSubmitting}
          title="¿Eliminar esta idea?"
          description="Esta acción no se puede deshacer. La idea será eliminada permanentemente."
        />

      )}
    </div>
  )
}

