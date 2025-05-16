'use client'
import "@/app/globals.css";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathName = usePathname();

  return (
    <div
    >
      <ProjectsNavBar />
      <motion.div
        key={pathName} //cada vez que pathname cambia, pues se realiza la animación
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-auto h-auto bg-primary-bg">
        {children}
      </motion.div>
    </div>
  );
}
