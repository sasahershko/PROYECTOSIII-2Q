'use client';
import ModifyProjectForm from '@/components/projects/ModifyProjectForm';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SpinLoader from "@components/SpinLoader";
import { getProjectById } from '@lib/projects';

export default function ModifyProject() {

  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      getProjectById(id)
        .then(setProject)
        .catch((error) => console.error("Error al obtener proyecto:", error));
    }
  }, [id]);

  if (!project) return <SpinLoader />;

  return (
    <>
      <ModifyProjectForm project={project} />
    </>
  )
}