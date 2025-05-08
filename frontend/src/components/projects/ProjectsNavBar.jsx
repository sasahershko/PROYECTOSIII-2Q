"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";

export default function ProjectsNavBar({ role }) {
  const { id: projectId } = useParams();
  const pathname = usePathname();

  const rootPath = `/projects/${projectId}`;
  const links = [
    {
      name: "Vista general",
      href: rootPath,
      match: rootPath,
    },
    {
      name: "Participantes",
      href: `${rootPath}/participants`,
      match: `${rootPath}/participants`,
    },
    {
      name: "Presupuesto",
      href: `${rootPath}/budget`,
      match: `${rootPath}/budget`,
    },
    {
      name: "Calendario",
      href: `${rootPath}/calendar`,
      match: `${rootPath}/calendar`,
    },
    {
      name: "Resumen",
      href: `${rootPath}/resume`,
      match: `${rootPath}/resume`,
    },
  ];

  return (
    <div className="border-b px-6 py-4 bg-background text-foreground dark:bg-primary dark:text-primary-foreground flex items-center justify-between">
      <div className="flex space-x-6">
        {links.map((link) => {
          // Solo el rootPath usa comparación exacta; el resto, startsWith
          const isActive =
            link.match === rootPath
              ? pathname === rootPath
              : pathname.startsWith(link.match);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-all duration-150 hover:text-gray-500 dark:hover:text-gray-300 ${
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

      <Link
        href={`${rootPath}/modify-project`}
        className="flex gap-2 bg-secundary py-2 px-4 rounded-lg text-white"
      >
        <Image
          src={"/svg/settings-svgrepo-com.svg"}
          alt="settings"
          width={20}
          height={20}
          className="invert"
        />
        <p>Gestionar Proyecto</p>
      </Link>
    </div>
  );
}
