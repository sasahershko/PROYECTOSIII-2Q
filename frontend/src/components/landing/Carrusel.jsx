"use client";

import React, { useState, useEffect } from "react";

const Carrusel = () => {
  const [index, setIndex] = useState(0);
  const imagenes = ["/carrusel/test.jpg"];
  //Aqui irian las imagenes que quisieramos meter

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  //crea una funcion que cada 3 segundos cambia de imagen y al llegar a la ultima vuelve a la primera

  return (
    <div className="w-full mx-auto relative">
      <div className="w-full min-h-[85vh] absolute bg-black/50"></div>
      <img
        src={imagenes[index]}
        alt={`Imagen ${index + 1}`}
        className="w-full h-[85vh] object-cover object-center"
      />
      <h1 className="absolute bottom-10 left-10 text-white text-7xl font-bold">
        ¡IMPULSA TUS IDEAS!
      </h1>
      <div
        className="absolute top-1/2 left-4 text-white cursor-pointer"
        onClick={() =>
          setIndex((index - 1 + imagenes.length) % imagenes.length)
        }
      >
        &#9664;
      </div>
      <div
        className="absolute top-1/2 right-4 text-white cursor-pointer"
        onClick={() => setIndex((index + 1) % imagenes.length)}
      >
        &#9654;
      </div>
    </div>
  );
};

//Te deja moverte libremente entre las imagenes (anterior o siguiente)

export default Carrusel;
