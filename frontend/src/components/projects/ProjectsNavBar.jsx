"use client";  // 

import Link from "next/link";
import { useParams } from "next/navigation"; // Cambio aquí

export default function ProjectsNavBar({ role }) {
    const { id: projectId } = useParams(); // Obtiene el ID del proyecto

    return (
        <div className="border-b px-6 py-4 bg-primary text-white flex items-center justify-between">
            <div className="flex space-x-6">
                {role === 'admin' ? (
                    <>
                        <Link href="/admin/projects" className="font-bold text-primary-text text-lg transition duration-300 hover:text-gray-500 pointer-events-none">
                            Proyectos
                        </Link>
                        <Link href={`/admin/projects/${projectId}/participants`} className="text-primary-text transition duration-300 hover:text-gray-500">
                            Participantes
                        </Link>
                        <Link href="/admin/projects/areas" className="text-primary-text transition duration-300 hover:text-gray-500 pointer-events-none">
                            Presupuesto
                        </Link>
                        <Link href="/admin/projects/calendar" className="text-primary-text transition duration-300 hover:text-gray-500 pointer-events-none">
                            Convocatorias
                        </Link>
                        <Link href="/admin/projects/calendar" className="text-primary-text transition duration-300 hover:text-gray-500 pointer-events-none">
                            Cronograma
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/user/projects" className="font-bold text-primary-text text-lg transition duration-300 hover:text-gray-500 pointer-events-none">
                            Proyectos
                        </Link>
                        <Link href="/user/projects/calendar" className="text-primary-text transition duration-300 hover:text-gray-500 pointer-events-none">
                            Calendario
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
