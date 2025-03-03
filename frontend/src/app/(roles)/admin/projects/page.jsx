"use client";

import useProjects from "@/hooks/useProjects";
import useUserRole from "@/hooks/useUserRole";
import ProjectCard from "@/components/projects/ProjectCard";
import SpinLoader from "@/components/SpinLoader";
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function ProjectDashboard() {
  const { projects, loading } = useProjects();
  const userRole = useUserRole();
  const router = useRouter();

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="48px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      <div className="flex py-2 px-2 gap-4">
        <Link href='/admin/projects/newProject' className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          Nuevo Proyecto
        </Link>

        <Link href='/' className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-500">
          Opciones
        </Link>

      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.length === 0 ? (
            <p>No existen proyectos</p>
          ) : (
            projects.map((project) => (
              <div onClick={() => router.push(`/admin/projects/${project._id}`)}>
                <ProjectCard
                  key={project._id}
                  project={project}
                  role={userRole}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
