"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getIdeaById, updateIdea, deleteIdea } from "@lib/ideas";
import { ArrowLeft, Edit2, Trash2, Save, X, Loader2, AlertCircle, User } from 'lucide-react';

// Paleta de colores moderna para las áreas (igual que en las páginas anteriores)
const areaColors = {
  INSO: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-600" },
  MAIS: { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-600" },
  FIIS: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-600" },
  DIPI: { bg: "bg-rose-50", border: "border-rose-400", text: "text-rose-600" },
  ANIV: { bg: "bg-violet-50", border: "border-violet-400", text: "text-violet-600" },
  DIDI: { bg: "bg-fuchsia-50", border: "border-fuchsia-400", text: "text-fuchsia-600" },
};

export default function IdeaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchIdea() {
      try {
        const data = await getIdeaById(id);
        setIdea(data);
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          grado: data.grado,
        });
      } catch (err) {
        setError(err.message || "No se pudo cargar la idea");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchIdea();
  }, [id]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const updated = await updateIdea(id, formData);
      setIdea(updated);
      setIsEditing(false);
      
      // Mostrar notificación de éxito
      const notification = document.getElementById('notification');
      notification.classList.remove('hidden');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteIdea(id);
      router.push("/admin/ideas");
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la idea");
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Obtener el color del área seleccionada
  const areaStyle = idea ? (areaColors[idea.grado] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-400" }) : { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-400" };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-black animate-spin" />
          <p className="text-slate-600 font-medium">Cargando idea...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">No se pudo cargar la idea</h2>
            <p className="text-slate-600">{error}</p>
            <Link
              href="/admin/ideas"
              className="mt-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a ideas</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Idea no encontrada</h2>
            <p className="text-slate-600">La idea que buscas no existe o ha sido eliminada</p>
            <Link
              href="/admin/ideas"
              className="mt-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a ideas</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Notificación de éxito */}
      <div
        id="notification"
        className="fixed top-4 right-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-md hidden transition-opacity duration-300 flex items-center gap-2 z-50"
      >
        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Save className="h-3 w-3 text-emerald-600" />
        </div>
        <p className="font-medium">Idea actualizada correctamente</p>
      </div>

      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-8 gap-4">
        <Link
          href="/admin/ideas"
          className="p-2 rounded-full hover:bg-primary-bg transition-colors"
          aria-label="Volver a ideas"
        >
          <ArrowLeft className="h-5 w-5 text-secundary-text" />
        </Link>
        <h1 className="text-3xl font-bold text-primary-text tracking-tight">
          {isEditing ? "Editar Idea" : "Detalles de la Idea"}
        </h1>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-secundary-text overflow-hidden">
        {isEditing ? (
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Nombre de la idea
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-secundary-text focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none bg-primary-bg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-secundary-text focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none resize-none bg-primary-bg"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Grado
                </label>
                <select
                  value={formData.grado}
                  onChange={(e) =>
                    setFormData({ ...formData, grado: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-secundary-text focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none appearance-none bg-primary-bg"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' strokeLinecap=\'round\' strokeLinejoin=\'round\' strokeWidth=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
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
              <div className="pt-4 border-t border-secundary-text">
                <p className="text-sm font-medium text-primary-text mb-2">
                  Vista previa de la etiqueta:
                </p>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${areaColors[formData.grado]?.bg || "bg-primary-bg"} ${areaColors[formData.grado]?.text || "text-primary-text"} border ${areaColors[formData.grado]?.border || "border-accent"}`}
                >
                  {formData.grado}
                </span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-secundary-text text-primary-text rounded-full font-medium hover:bg-primary-bg transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-secundary transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
        ) : (
          <>
            <div className={`${areaStyle.bg} p-8`}>
              <div className="mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${areaStyle.bg} ${areaStyle.text} border ${areaStyle.border}`}
                >
                  {idea.grado}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-black mb-6">
                {idea.nombre}
              </h1>
              <p className="text-secundary-text text-lg whitespace-pre-line mb-8">
                {idea.descripcion}
              </p>

              <div className="flex items-center pt-6 border-t border-secundary-text">
                <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-secundary-text" />
                </div>
                <div>
                  <p className="text-sm text-secundary-text">Creado por</p>
                  <p className="font-medium text-black">
                    {idea.usuario?.name || "Anónimo"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-secundary-text bg-primary-bg flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 border border-secundary-text bg-card text-primary-text rounded-full font-medium hover:bg-primary-bg transition-colors flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-full font-medium hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-semibold text-primary-text mb-2">
                ¿Eliminar esta idea?
              </h2>
              <p className="text-secundary-text">
                Esta acción no se puede deshacer. La idea será eliminada permanentemente.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 border border-secundary-text text-primary-text rounded-lg font-medium hover:bg-primary-bg transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
