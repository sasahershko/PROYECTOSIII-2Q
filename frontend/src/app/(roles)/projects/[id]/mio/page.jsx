'use client';
import { useEffect, useState } from "react";
import ProjectDescription2 from "@/components/projects/ProjectDescription2";
import SpinLoader from "@components/SpinLoader";
import { getProjectById } from '@lib/projects';
import {useParams} from 'next/navigation';


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

    if (!project) return <SpinLoader />;

    return (
        <>
            <ProjectDescription2 project={project} />
        </>
    );
}