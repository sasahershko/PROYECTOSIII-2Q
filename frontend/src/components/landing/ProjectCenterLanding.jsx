import React from "react";

const ProjectCenterLanding = () => {
  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      {/* Contenedor de PROJECT CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Información del proyecto */}
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-card p-2 px-4 text-align-left inline-block">
            PROJECT CENTER
          </h2>
          <div className="bg-card p-4">
            <p className="text-primary-text text-justify">
              Lorem Ipsum es simplemente el texto de relleno de las imprentas y
              archivos de texto. Lorem Ipsum ha sido el texto de relleno
              estándar de las industrias desde el año 1500, cuando un impresor
              (N. del T. persona que se dedica a la imprenta) desconocido usó
              una galería de textos y los mezcló de tal manera que logró hacer
              un libro de textos especimen. No sólo sobrevivió 500 años, sino
              que también ingresó como texto de relleno en documentos
              electrónicos, quedando esencialmente igual al original. Fue
              popularizado en los 60s con la creación de las hojas "Letraset",
              las cuales contenían pasajes de Lorem Ipsum, y más recientemente
              con software de autoedición, como por ejemplo Aldus PageMaker, el
              cual incluye versiones de Lorem Ipsum.
            </p>
          </div>
        </div>

        {/* Imagen 1 */}
        <div className="bg-card h-100 flex items-center justify-center">
          <span className="text-primary-text">Imagen 1</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCenterLanding;
