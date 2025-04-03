"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@lib/profile";
import { createIdea } from "@lib/ideas";

export default function NewIdeaPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grado: "INSO",
  });

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("No se ha podido obtener el usuario autenticado.");
      return;
    }

    const ideaData = {
      ...formData,
      usuario: user.id,
    };

    try {
      await createIdea(ideaData); 
      alert("¡Idea creada con éxito!");
      router.push("/ideas");
    } catch (error) {
      console.error(error);
      alert("Error al crear la idea");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
            className="w-full border border-gray-300 rounded p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grado</label>
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
        </div>

        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          Crear
        </button>
      </form>
    </div>
  );
}
