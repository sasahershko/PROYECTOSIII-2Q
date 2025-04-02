"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

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
    <div className="relative w-full h-[93vh] overflow-hidden">
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
              className="bg-accent text-white px-[24px] py-[11px] rounded-lg font-semibold hover:bg-accent/80 transition"
            >
              Explorar Proyectos
            </Link>
            <Link
              href="#info"
              className="border border-white text-white px-[24px] py-[11px] rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              ¡Trabaja Con Nosotros!
            </Link>
          </div>
        </div>
      </div>

      {/* Botones de navegación (Flechas en los bordes) */}
      <motion.button
        className="absolute text-3xl top-1/2 left-0 transform -translate-y-1/2 text-white p-3 z-20 h-[93vh] w-24 overflow-hidden"
        onClick={() =>
          setIndex((index - 1 + imagenes.length) % imagenes.length)
        }
      >
        {/* Overlay que anima la opacidad */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 90%)",
          }}
        />
        <FaChevronLeft className="text-3xl left-2 relative" />
      </motion.button>

      <motion.button
        className="absolute text-3xl top-1/2 right-0 transform -translate-y-1/2 text-white p-3 z-20 h-[93vh] w-24 overflow-hidden"
        onClick={() => setIndex((index + 1) % imagenes.length)}
      >
        {/* Overlay que anima la opacidad */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 90%)",
          }}
        />
        <FaChevronRight className="text-3xl -right-8 relative" />
      </motion.button>
    </div>
  );
};

export default Carrusel;
