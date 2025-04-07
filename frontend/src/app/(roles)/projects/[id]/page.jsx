'use client';
import { useEffect, useState } from "react";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";
import ProjectDescription from "@/components/projects/ProjectDescription";
import SpinLoader from "@components/SpinLoader";
import { getProjectById } from '@lib/projects';
import { useParams } from 'next/navigation';


export default function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (id) {
            getProjectById(id)
                .then(setProject)
                .catch((error) => console.error("Error al obtener proyecto:", error));
        }
    }, [id]);

    if (!project) {
        return (
            <div className="pt-44 flex items-center justify-center">
                <SpinLoader size="49px" />
            </div>
        );
    }

    return (
        <>
            <ProjectDescription project={project} />
        </>
    );
}