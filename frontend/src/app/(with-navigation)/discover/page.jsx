"use client";

import useProjects from "@/hooks/useProjects";
import useUserRole from "@/hooks/useUserRole";
import ProjectCard from "@/components/projects/ProjectCard";
import SpinLoader from "@/components/SpinLoader";

export default function ProjectDashboard() {
  const { projects, loading } = useProjects();
  const userRole = useUserRole(); // Obtener rol del usuario


  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.length === 0 ? (
            <p>No existen proyectos</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} role={userRole} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
