"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import { getProjectById } from "@/lib/projects";
import SpinLoader from "@/components/SpinLoader";
import Image from "next/image";
import ProjectInUser from "@/components/lists/ProjectInUser"; // Asegúrate de tener este componente

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);

        if (userData.projects?.length > 0) {
          setProjectsLoading(true);
          try {
            const fetchedProjects = await Promise.all(
              userData.projects.map((p) => getProjectById(p._id))
            );
            const validProjects = fetchedProjects.filter((p) => p !== null);
            setProjects(validProjects);
          } catch (err) {
            console.error("Error al obtener los proyectos:", err);
          } finally {
            setProjectsLoading(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg">
        <SpinLoader size="49px" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg text-primary-text">
        <p>No se encontró información del usuario.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-bg px-4 py-8">
      <div className="bg-card shadow-xl rounded-[32px] w-full max-w-4xl p-10 text-primary-text">
        {/* Avatar + nombre */}
        <div className="flex flex-col items-center text-center mb-10">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="Foto de perfil"
              width={100}
              height={100}
              className="rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-primary-bg flex items-center justify-center text-secundary-text text-3xl font-semibold shadow-md">
              {user.name.charAt(0)}
            </div>
          )}
          <h1 className="text-2xl font-semibold mt-4 text-secundary-text">
            {user.name} {user.surname}
          </h1>
          <p className="text-sm text-secundary-text">{user.email}</p>
        </div>

        {/* Formulario de solo lectura */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyInput label="Nombre" value={user.name} />
          <ReadOnlyInput label="Apellidos" value={user.surname} />
          <ReadOnlyInput label="Email" value={user.email} />
          <ReadOnlyInput label="DNI" value={user.dni} />
          <ReadOnlyInput label="Rol" value={capitalize(user.rol)} />
          <ReadOnlyInput
            label="Grado"
            value={
              user.grade === "null" ? "Sin grado" : user.grade ?? "Sin grado"
            }
          />
        </form>

        {/* Sección de Proyectos */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-secundary-text mb-3">
            Proyectos
          </h2>
          {projectsLoading ? (
            <div className="flex items-center gap-2">
              <SpinLoader size="24px" />
              <p className="text-sm text-gray-500 font-medium">
                Cargando proyectos...
              </p>
            </div>
          ) : projects.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-52 overflow-y-auto pr-2">
              {projects.map((project) => (
                <ProjectInUser key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-medium">
              No hay proyectos asignados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyInput({ label, value }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-secundary-text mb-1">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="bg-primary-bg text-primary-text px-4 py-2 rounded-md border border-gray-300 focus:outline-none cursor-not-allowed"
      />
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
