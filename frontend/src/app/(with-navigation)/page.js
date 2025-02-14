import React from "react";
import Carrusel from "@/components/landing/Carrusel";
import InfoLanding from "@/components/landing/InfoLanding";
import CarruselProyectos from "@/components/landing/CarruselProyectos";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Llamada a carrusel de imagenes */}
      <div className="w-full">
        <Carrusel />
      </div>

      <div
        className="h-20 min-w-full content-center flex justify-center items-center"
        id="info"
      >
        <a href="#info">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 animate-bounce fill-copy-primary"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M12.3704 15.8351L18.8001 9.20467C19.2013 8.79094 18.9581 8 18.4297 8H5.5703C5.04189 8 4.79869 8.79094 5.1999 9.20467L11.6296 15.8351C11.8427 16.055 12.1573 16.0549 12.3704 15.8351Z"
                fill="copy-primary"
              ></path>{" "}
            </g>
          </svg>
        </a>
      </div>

      {/* Llamada a info */}
      <div className="w-full max-w-6xl">
        <InfoLanding />
      </div>

      {/* Llamada a carrusel de proyectos */}
      <div className="w-full max-w-6xl mt-8">
        <CarruselProyectos />
      </div>
    </div>
  );
}
