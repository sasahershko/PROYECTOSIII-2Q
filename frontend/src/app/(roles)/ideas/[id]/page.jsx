"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


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
  const [isEditing, setIsEditing] = useState(false); // Alterna entre vista y modo edición
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  });

  useEffect(() => {
    // Carga los datos de la idea al montar el componente
    async function fetchIdea() {
      try {
        const res = await fetch(`https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/ideas/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar la idea");
        const data = await res.json();
        setIdea(data);
        // Rellena el formulario con los datos actuales de la idea
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

  // Envia los cambios realizados a la API
  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/ideas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al actualizar la idea");

      const updated = await res.json();
      setIdea(updated);
      setIsEditing(false); // Salimos del modo edicion
      alert("Idea actualizada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la idea");
    }
  };

  // Elimina la idea y vuelve a la pagina principal
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta idea?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/ideas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar la idea");

      alert("Idea eliminada correctamente");
      router.push("/ideas"); // Redirigimos tras eliminar
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
      <div className="border border-gray-300 rounded shadow-md overflow-hidden">
        {/* Banda de color segun el grado */}
        <div className={`${areaColors[idea.grado] || "bg-gray-100"} h-4 w-full`} />

        <div className="p-6 space-y-4">
          {isEditing ? (
            // Modo edicion
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
            // Vista normal de la idea
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
