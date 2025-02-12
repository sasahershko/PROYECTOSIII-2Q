"use client";

import React, { useState, useEffect } from "react";

const Carrusel = () => {
  const [index, setIndex] = useState(0);
  const imagenes = [
    "/images/proyecto1.jpg",
    "/images/proyecto2.jpg",
    "/images/proyecto3.jpg"
  ];
  //Aqui irian las imagenes que quisieramos meter

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  //crea una funcion que cada 3 segundos cambia de imagen y al llegar a la ultima vuelve a la primera

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

//Te deja moverte libremente entre las imagenes (anterior o siguiente)

export default Carrusel;
