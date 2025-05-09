"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carrusel = () => {
  // Lista de imágenes hardcodeada
  const imagenes = [
    "/carrusel/image.jpeg",
    "/carrusel/image2.png",
    "/carrusel/inso.jpg",
    "/carrusel/inso.png",
    "/carrusel/test.jpg",
    "/carrusel/videojuegos.png",
  ];

  const [index, setIndex] = useState(0);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % imagenes.length),
      5000
    );
    return () => clearInterval(interval);
  }, [index]);

  const prev = () =>
    setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  const next = () => setIndex((prev) => (prev + 1) % imagenes.length);

  return (
    <div className="relative w-full h-[93vh] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {imagenes.map((src, i) =>
            i === index ? (
              <motion.img
                key={src}
                src={src}
                alt={`Slide ${i + 1}`}
                className="absolute w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 1 }}
              />
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Contenido texto */}
      <div className="absolute bottom-16 left-16">
        <div className="w-[650px] p-8 bg-gray-900/50 backdrop-blur-lg rounded-lg text-white flex flex-col gap-3">
          <h1 className="text-[40px] font-bold leading-tight">
            Bienvenido al <br /> Project Center de la U-Tad
          </h1>
          <p className="text-[16px]">
            Conecta, colabora y gestiona proyectos innovadores en un solo lugar
          </p>
          <div className="flex gap-6 mt-4">
            <Link
              href="#proyectos"
              className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent/80 transition"
            >
              Explorar Proyectos
            </Link>
            <Link
              href="#info"
              className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              ¡Trabaja Con Nosotros!
            </Link>
          </div>
        </div>
      </div>

      {/* Botones prev/next */}
      <motion.button
        onClick={prev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-24 h-[93vh] flex items-center justify-start p-3 z-20 text-white text-3xl overflow-hidden"
      >
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
        <FaChevronLeft />
      </motion.button>

      <motion.button
        onClick={next}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-24 h-[93vh] flex items-center justify-end p-3 z-20 text-white text-3xl overflow-hidden"
      >
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
        <FaChevronRight />
      </motion.button>
    </div>
  );
};

export default Carrusel;
