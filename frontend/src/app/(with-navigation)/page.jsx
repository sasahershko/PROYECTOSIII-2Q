import React from "react";
import Carrusel from "@/components/landing/Carrusel";
import ProjectCenterLanding from "@/components/landing/ProjectCenterLanding"; // Nombre actualizado
import ContactoLanding from "@/components/landing/ContactoLanding"; // Nombre actualizado
import CarruselProyectos from "@/components/landing/CarruselProyectos"; // Se mantiene

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Carrusel de imágenes (ancho completo) */}
      <div className="w-full">
        <Carrusel />
      </div>

      {/* Flecha animada */}
      <div
        className="h-20 min-w-full content-center flex justify-center items-center"
        id="info"
      >
        <Link href="#info">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 animate-bounce fill-secundary-text"
          >
            <path
              d="M12.3704 15.8351L18.8001 9.20467C19.2013 8.79094 18.9581 8 18.4297 8H5.5703C5.04189 8 4.79869 8.79094 5.1999 9.20467L11.6296 15.8351C11.8427 16.055 12.1573 16.0549 12.3704 15.8351Z"
              fill=""
            ></path>
          </svg>
        </Link>
      </div>

      {/* Contenido principal con ancho unificado */}
      <div className="w-full max-w-5xl px-4 flex flex-col gap-6"> 
        {/* PROJECT CENTER */}
        <ProjectCenterLanding />

        {/* PROYECTOS EN DESARROLLO */}
        <CarruselProyectos />

        {/* CONTACTO */}
        <div className="w-full max-w-6xl mb-12">
          <ContactoLanding />
        </div>
      </div>
    </div>
  );
}
