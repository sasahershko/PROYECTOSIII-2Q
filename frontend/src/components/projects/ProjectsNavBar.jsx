"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function ProjectsNavBar({ role }) {
    const { id: projectId } = useParams();
    const pathname = usePathname();

    const links = [
        { name: "Proyectos", href: `/admin/projects/${projectId}`, match: `/admin/projects/${projectId}` },
        { name: "Participantes", href: `/admin/projects/${projectId}/participants`, match: `/admin/projects/${projectId}/participants` },
        { name: "Presupuesto", href: "/admin/projects/areas", match: "/admin/projects/areas" },
        { name: "Convocatorias", href: "/admin/projects/calendar", match: "/admin/projects/calendar" },
        { name: "Cronograma", href: "/admin/projects/calendar", match: "/admin/projects/calendar" }
    ];

    return (
        <div className="border-b px-6 py-4 bg-primary text-white flex items-center justify-between">
            <div className="flex space-x-6">
                {links.map((link) => {
                    const isActive = pathname === link.match;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-primary-text transition-all duration-300 hover:text-gray-500 ${
                                isActive ? "font-bold text-lg scale-105" : "text-black"
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
