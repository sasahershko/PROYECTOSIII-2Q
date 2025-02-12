import React from "react";
import Carrusel from "./Landingcomponents/Carrusel";
import InfoLanding from "./Landingcomponents/InfoLanding";
import CarruselProyectos from "./Landingcomponents/CarruselProyectos";

const Landing = () => {
  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* Carrusel principal */}
      <div className="w-full max-w-6xl">
        <Carrusel />
      </div>
      
      {/* Sección de información */}
      <div className="w-full max-w-5xl mt-8">
        <InfoLanding />
      </div>
      
      {/* Carrusel de proyectos */}
      <div className="w-full max-w-6xl mt-8">
        <CarruselProyectos />
      </div>
    </div>
  );
};

export default Landing; 