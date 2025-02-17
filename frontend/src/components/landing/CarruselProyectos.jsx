"use client";

import React from "react";

const CarruselProyectos = () => {
  const proyectos = [
    { titulo: "Proyecto 1", imagen: "Imagen de Proyecto 1" },
    { titulo: "Proyecto 2", imagen: "Imagen de Proyecto 2" },
    { titulo: "Proyecto 3", imagen: "Imagen de Proyecto 3" },
    { titulo: "Proyecto 4", imagen: "Imagen de Proyecto 4" },
    { titulo: "Proyecto 5", imagen: "Imagen de Proyecto 5" },
  ];
  //Añado a mano distintos proyectos con sus nombres
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/*Creo el contenedor en el que estara toda la estructura*/}
      <h2 className="text-2xl bg-card-bg font-bold text-left mb-6 inline-block px-4 py-2">
        PROYECTOS EN DESARROLLO
      </h2>
      {/*Le pongo un titulo encima*/}
      <div className="overflow-x-auto flex gap-4 p-2 scrollbar-hide">
        {proyectos.map((proyecto, index) => (
          <div
            key={index}
            className="bg-card-bg h-48 w-64 flex items-center justify-center text-gray-500 shadow-md min-w-[250px] relative"
          >
            <div className="absolute top-2 left-2 bg-secundary text-white px-4 py-1 w-36 text-nowrap overflow-hidden">
              {proyecto.titulo}
            </div>
            <span>{proyecto.imagen}</span>
            {/*Le añado los proyectos, con el titulo de proyecto y la imagen de este*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselProyectos;
