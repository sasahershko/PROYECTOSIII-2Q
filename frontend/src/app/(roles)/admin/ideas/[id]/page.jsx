// app/(admin)/ideas/[id]/page.jsx (or pages/admin/ideas/[id].jsx)
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getIdeaById, updateIdea, deleteIdea } from "@lib/ideas";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import DeleteConfirmModal from "@components/DeleteConfirmModal";
import SpinLoader from "@/components/SpinLoader";

// Color palette for different areas
const areaColors = {
  INSO: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  MAIS: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  FIIS: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  DIPI: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
  },
  ANIV: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
  DIDI: {
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    badge: "bg-fuchsia-100 text-fuchsia-700",
  },
};
const defaultArea = {
  bg: "bg-card",
  border: "border-secondary",
  badge: "bg-card text-secondary-text",
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
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    getIdeaById(id)
      .then((data) => {
        setIdea(data);
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          grado: data.grado,
        });
      })
      .catch((err) => setError(err.message || "No se pudo cargar la idea"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const updated = await updateIdea(id, formData);
      setIdea(updated);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
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
    } catch {
      setError("Error al eliminar la idea");
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-primary-bg">
        <SpinLoader size="32px" />
        <p className="mt-2 text-secondary-text">Cargando idea...</p>
      </div>
    );

  if (error)
    return (
      <CenteredCard bg="bg-primary-bg" border="border-red-100">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
        <h2 className="text-lg font-semibold text-primary-text">Oops!</h2>
        <p className="text-secondary-text mb-4">{error}</p>
        <Link
          href="/admin/ideas"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-bg rounded-lg hover:bg-accent/90 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </CenteredCard>
    );

  const area = areaColors[idea.grado] || defaultArea;

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto space-y-6 bg-primary-bg">
      {showToast && (
        <Toast title="¡Listo!" message="Idea actualizada correctamente" />
      )}

      <header className="flex items-center space-x-3">
        <Link
          href="/admin/ideas"
          className="p-2 bg-primary-bg rounded-full shadow hover:bg-card transition"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-text" />
        </Link>
        <h1 className="text-2xl font-bold text-primary-text">
          {isEditing ? "Editar Idea" : "Detalles de la Idea"}
        </h1>
      </header>

      {isEditing ? (
        <form className="bg-primary-bg p-6 rounded-xl shadow-md space-y-5">
          <FormField
            label="Nombre de la idea"
            value={formData.nombre}
            onChange={(v) => setFormData((s) => ({ ...s, nombre: v }))}
          />
          <FormField
            label="Descripción"
            type="textarea"
            value={formData.descripcion}
            onChange={(v) => setFormData((s) => ({ ...s, descripcion: v }))}
            rows={4}
          />
          <SelectField
            label="Grado"
            value={formData.grado}
            options={Object.keys(areaColors)}
            onChange={(v) => setFormData((s) => ({ ...s, grado: v }))}
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-secondary text-secondary-text rounded-lg hover:bg-card transition"
            >
              <X className="inline h-4 w-4 mr-1" /> Cancelar
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="px-4 py-2 bg-accent text-primary-bg rounded-lg hover:bg-accent/90 transition flex items-center"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}{" "}
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-card rounded-xl shadow-md overflow-hidden">
          <div
            className={`${area.bg} p-6 border-b ${area.border}`}
            style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
          >
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${area.badge}`}
            >
              {idea.grado}
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-black">
              {idea.nombre}
            </h2>
            <p className="mt-2 text-black leading-relaxed whitespace-pre-line">
              {idea.descripcion}
            </p>
          </div>
          <div
            className={`${area.bg} flex items-center justify-between px-6 py-4`}
          >
            <div className="flex items-center space-x-3">
              {idea.usuario?.profileImage ? (
                <img
                  src={idea.usuario.profileImage}
                  alt={idea.usuario.name}
                  className="h-12 w-12 rounded-full object-cover shadow"
                />
              ) : (
                <div className="h-12 w-12 bg-card rounded-full flex items-center justify-center text-black font-semibold">
                  {(idea.usuario?.name || "A")[0]}
                </div>
              )}
            </div>
            <div className="flex-1 pl-4">
              <p className="text-sm text-black">Creado por</p>
              <p className="text-black font-medium">
                {idea.usuario?.name || "Anónimo"}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 border border-secondary text-black rounded-lg hover:bg-card transition flex items-center"
              >
                <Edit2 className="h-4 w-4 mr-1" /> Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          isLoading={isSubmitting}
          title="Eliminar idea"
          description="Esta acción no se puede deshacer."
        />
      )}
    </div>
  );
}

// Reusable components
function CenteredCard({
  children,
  bg = "bg-primary-bg",
  border = "border-secondary",
}) {
  return (
    <div
      className={`max-w-md mx-auto p-6 ${bg} rounded-xl shadow-md border ${border} text-center space-y-4`}
    >
      {children}
    </div>
  );
}

function Toast({ title, message }) {
  return (
    <div className="fixed top-5 right-5 bg-accent/10 border border-accent text-accent px-4 py-3 rounded-lg shadow-lg flex items-start space-x-3 animate-fade-in-down">
      <div className="p-1 bg-accent rounded-full">
        <Check className="h-5 w-5 text-primary-bg" />
      </div>
      <div>
        <p className="font-semibold text-primary-text">{title}</p>
        <p className="text-sm text-secondary-text">{message}</p>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", rows = 3 }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-secondary-text">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-secondary rounded-lg focus:ring-2 focus:ring-accent outline-none transition"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-secondary rounded-lg focus:ring-2 focus:ring-accent outline-none transition"
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-secondary-text">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-secondary rounded-lg focus:ring-2 focus:ring-accent outline-none transition appearance-none bg-primary-bg"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
