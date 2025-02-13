import React from "react";

const InfoLanding = () => {
  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      {/* Creo el contenedor donde ira toda la informacion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Y ahora creo donde ira el nombre del proyecto con la informacion sobre este */}
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-card-bg p-2 px-4 text-align-left inline-block">
            PROJECT CENTER
          </h2>
          <div className="bg-card-bg p-4 ">
            <p className="text-copy-primary">
              Lorem Ipsum es simplemente el texto de relleno de las imprentas y
              archivos de texto. Lorem Ipsum ha sido el texto de relleno
              estándar de las industrias desde el año 1500, cuando un impresor
              (N. del T. persona que se dedica a la imprenta) desconocido usó
              una galería de textos y los mezcló de tal manera que logró hacer
              un libro de textos especimen. No sólo sobrevivió 500 años, sino
              que tambien ingresó como texto de relleno en documentos
              electrónicos, quedando esencialmente igual al original. Fue
              popularizado en los 60s con la creación de las hojas "Letraset",
              las cuales contenian pasajes de Lorem Ipsum, y más recientemente
              con software de autoedición, como por ejemplo Aldus PageMaker, el
              cual incluye versiones de Lorem Ipsum.
            </p>
          </div>
        </div>

        {/* Aqui iria la primera imagen */}
        <div className="bg-card-bg h-96 flex items-center justify-center">
          <span className="text-copy-primary">Imagen 1</span>
        </div>
      </div>

      {/* Creo el contenedor donde ira la informacion de contacto */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-center p-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 p-1 rounded-md">
            ¿QUIERES TRABAJAR CON NOSOTROS?
          </h3>
          <div className="p-2 rounded-md">
            <p className="">
              Si eres una empresa y necesitas una solución, <br />
              Contáctanos. <br />
              Dejalo en nuestras manos.
            </p>
          </div>
          {/* Creo el boton para mas informacion */}
          <button className="mt-4 px-6 py-2 bg-utad text-white rounded-lg">
            Más información
          </button>
        </div>

        {/* Aqui iria la segunda imagen */}
        <div className="bg-card-bg h-48 flex items-center justify-center">
          <span className="text-copy-primary">Imagen 2</span>
        </div>
      </div>
    </div>
  );
};

export default InfoLanding;
