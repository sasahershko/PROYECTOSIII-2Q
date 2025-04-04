"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIdeaById, updateIdea, deleteIdea } from "@lib/ideas";

const areaColors = {
  INSO: "bg-blue-100",
  MAIS: "bg-green-100",
  FIIS: "bg-yellow-100",
  DIPI: "bg-red-100",
  ANIV: "bg-purple-100",
  DIDI: "bg-pink-100",
};

export default function IdeaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  });

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchIdea();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updated = await updateIdea(id, formData);
      setIdea(updated);
      setIsEditing(false);
      alert("Idea actualizada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la idea");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta idea?");
    if (!confirmDelete) return;

    try {
      await deleteIdea(id);
      alert("Idea eliminada correctamente");
      router.push("/ideas");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la idea");
    }
  };

  if (loading) return <div className="p-6 text-center">Cargando...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!idea) return <div className="p-6 text-center">Idea no encontrada</div>;

  return (
    <div className="pt-12 px-4 max-w-3xl mx-auto">
      {/* 🔙 Botón para volver */}
      <button
        onClick={() => router.push("/ideas")}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <span className="text-2xl">&larr;</span>
        <span>Volver a ideas</span>
      </button>

      <div className="border border-gray-300 rounded shadow-md overflow-hidden">
        <div className={`${areaColors[idea.grado] || "bg-gray-100"} h-4 w-full`} />

        <div className="p-6 space-y-4">
          {isEditing ? (
            <>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
              <select
                value={formData.grado}
                onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="INSO">INSO</option>
                <option value="MAIS">MAIS</option>
                <option value="FIIS">FIIS</option>
                <option value="DIPI">DIPI</option>
                <option value="ANIV">ANIV</option>
                <option value="DIDI">DIDI</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{idea.nombre}</h1>
              <p className="text-gray-800 text-lg whitespace-pre-line">{idea.descripcion}</p>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Grado:</span> {idea.grado}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Creado por:</span> {idea.usuario?.name || "Anónimo"}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
