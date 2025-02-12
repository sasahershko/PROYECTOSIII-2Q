"use client";

import React, { useState, useEffect } from "react";

const Carrusel = () => {
  const [index, setIndex] = useState(0);
  const imagenes = [
    "/images/proyecto1.jpg",
    "/images/proyecto2.jpg",
    "/images/proyecto3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
      <img src={imagenes[index]} alt={`Imagen ${index + 1}`} className="w-full h-48 object-cover" />
      <div className="absolute top-1/2 left-4 text-white cursor-pointer" onClick={() => setIndex((index - 1 + imagenes.length) % imagenes.length)}>
        &#9664;
      </div>
      <div className="absolute top-1/2 right-4 text-white cursor-pointer" onClick={() => setIndex((index + 1) % imagenes.length)}>
        &#9654;
      </div>
    </div>
  );
};

export default Carrusel;
