"use client";

//! LO DEL ACTIVE BAR HACERLO DESDE LA URL SABIENDO DONDE ESTAS!!!
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Image from 'next/image';

export default function ProjectsNavBar({ role }) {
  const { id: projectId } = useParams();
  const pathname = usePathname();

    const links = [
        { name: "Vista general", href: `/projects/${projectId}`, match: `/projects/${projectId}` },
        { name: "Participantes", href: `/projects/${projectId}/participants`, match: `/projects/${projectId}/participants` },
        { name: "Presupuesto", href: `/projects/${projectId}/budget`, match: `/projects/${projectId}/budget` },
        { name: "Convocatorias", href: `/projects/${projectId}/call`, match:`/projects/${projectId}/call` },
        { name: "Calendario", href: `/projects/${projectId}/calendar`, match: `/projects/${projectId}/calendar` }
    ];

    return (
        <div className="border-b px-6 py-4 bg-background text-foreground dark:bg-primary dark:text-primary-foreground flex items-center justify-between">
            <div className="flex space-x-6">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.match);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-all duration-300 hover:text-gray-500 dark:hover:text-gray-300 ${
                                isActive ? "font-bold text-foreground dark:text-primary-foreground border-b-2 border-foreground dark:border-primary-foreground" : "text-foreground dark:text-primary-foreground"
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
            <Link href={`/projects/${id}/modify-project`} className="flex gap-2 bg-secundary py-2 px-4 rounded-lg text-white">
                <Image src={'/svg/settings-svgrepo-com.svg'} alt='settings' width={20} height={20} className="invert"></Image>
                <p>Gestionar Proyecto</p>
            </Link>
        </div>
    );
}
