import React from "react";
import Carrusel from "@/components/landing/Carrusel";
import InfoLanding from "@/components/landing/InfoLanding";
import CarruselProyectos from "@/components/landing/CarruselProyectos";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* Llamada a carrusel de imagenes */}
      <div className="w-full max-w-6xl">
        <Carrusel />
      </div>

      {/* Llamada a info */}
      <div className="w-full max-w-6xl mt-8">
        <InfoLanding />
      </div>

      {/* Llamada a carrusel de proyectos */}
      <div className="w-full max-w-6xl mt-8">
        <CarruselProyectos />
      </div>
    </div>
  );
}
