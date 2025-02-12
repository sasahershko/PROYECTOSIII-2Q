import React from "react";

const InfoLanding = () => {
  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Sección de texto */}
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-gray-300 p-2 rounded-md text-center">PROJECT CENTER</h2>
          <div className="bg-gray-200 p-4 rounded-md">
            <p className="text-gray-700">
            Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.
            </p>
          </div>
        </div>
        
        {/* Primera Imagen */}
        <div className="bg-gray-300 h-48 flex items-center justify-center">
          <span className="text-gray-500">Imagen 1</span>
        </div>
      </div>
      
      {/* Sección de contacto */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-center p-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 p-1 rounded-md">¿QUIERES TRABAJAR CON NOSOTROS?</h3>
          <div className="p-2 rounded-md">
            <p className="text-gray-700">Si eres una empresa y necesitas una solución, Contáctanos.                 
                Dejalo en nuestras manos.
            </p>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
            Más información
          </button>
        </div>
        
        {/* Segunda Imagen */}
        <div className="bg-gray-300 h-48 flex items-center justify-center">
          <span className="text-gray-500">Imagen 2</span>
        </div>
      </div>
    </div>
  );
};

export default InfoLanding;
