"use client";

import React, { useState } from "react";

const CarruselProyectos = () => {
  const proyectos = [
    "Imagen de Proyecto 1",
    "Imagen de Proyecto 2",
    "Imagen de Proyecto 3",
    "Imagen de Proyecto 4",
    "Imagen de Proyecto 5"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-2xl bg-gray-300 font-bold text-align-left mb-6">PROYECTOS EN DESARROLLO</h2>
      <div className="overflow-x-auto flex gap-4 p-2 scrollbar-hide">
        {proyectos.map((proyecto, index) => (
          <div key={index} className="bg-gray-300 h-48 w-64 flex items-center justify-center text-gray-500 rounded-md shadow-md min-w-[250px]">
            <span>{proyecto}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselProyectos;
