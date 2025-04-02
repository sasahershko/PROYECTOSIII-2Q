"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function ProjectsNavBar({ role }) {
  const { id: projectId } = useParams();
  const pathname = usePathname();

  const links = [
    {
      name: "Vista general",
      href: `/projects/${projectId}`,
      match: `/projects/${projectId}`,
    },
    {
      name: "Participantes",
      href: `/projects/${projectId}/participants`,
      match: `/projects/${projectId}/participants`,
    },
    { name: "Presupuesto", href: "/projects/areas", match: "/projects/areas" },
    {
      name: "Convocatorias",
      href: "/projects/calendar",
      match: "/projects/calendar",
    },
    {
      name: "Calendario",
      href: `/projects/${projectId}/calendar`,
      match: `/projects/${projectId}/calendar`,
    },
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
                isActive
                  ? "font-bold text-foreground dark:text-primary-foreground border-b-2 border-foreground dark:border-primary-foreground"
                  : "text-foreground dark:text-primary-foreground"
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
