"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Carrusel = () => {
  const [index, setIndex] = useState(0);
  const imagenes = [
    "/carrusel/image.jpeg",
    "/carrusel/image2.png",
    "/carrusel/test.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Animación de imágenes */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {imagenes.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt={`Slide ${i + 1}`}
              className="absolute w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: index === i ? 1 : 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Contenido del carrusel con fondo difuminado */}
      <div className="absolute bottom-[60px] left-[200px] flex justify-start items-end">
        <div className="w-[720px] h-[320px] p-10 bg-gray-900/50 backdrop-blur-lg rounded-lg text-white flex flex-col justify-center items-start gap-3.5 max-w-[630px]">
          <h1 className="text-[40px] font-bold leading-tight">
            Bienvenido al <br /> Project Center de la U-Tad
          </h1>
          <p className="text-[16px] font-normal">
            Conecta, colabora y gestiona proyectos innovadores en un solo lugar
          </p>
          <div className="flex gap-[24px] mt-[14px]">
            <Link
              href="#proyectos"
              className="bg-blue-600 text-white px-[24px] py-[11px] rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explorar Proyectos
            </Link>
            <Link
              href="#contacto"
              className="border border-white text-white px-[24px] py-[11px] rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              ¡Trabaja Con Nosotros!
            </Link>
          </div>
        </div>
      </div>

      {/* Botones de navegación (Flechas en los bordes) */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 p-3 rounded-full z-20 hover:bg-black/70"
        onClick={() => setIndex((index - 1 + imagenes.length) % imagenes.length)}
      >
        &#9664;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 p-3 rounded-full z-20 hover:bg-black/70"
        onClick={() => setIndex((index + 1) % imagenes.length)}
      >
        &#9654;
      </button>
    </div>
  );
};

export default Carrusel;
