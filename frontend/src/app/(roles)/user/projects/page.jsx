"use client";

import useProjects from "@/hooks/useProjects";
import useUserRole from "@/hooks/useUserRole";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectDashboard() {
  const { projects, loading } = useProjects();
  const userRole = useUserRole(); 

  if (loading) {
    return <p className="min-h-screen bg-primary-bg text-primary-text">Cargando proyectos...</p>;
  }

  return (
    <>
    <div className="bg-primary-bg text-primary-text">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.length === 0 ? (
            <p className="text-center">No existen proyectos</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} role={userRole} />
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}
