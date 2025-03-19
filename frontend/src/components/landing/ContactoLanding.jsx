import React from "react";

const ContactoLanding = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-6">
        
        {/* Texto y botón centrados */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold mb-2">
            ¿QUIERES TRABAJAR CON NOSOTROS?
          </h3>
          <p>
            Si eres una empresa y necesitas una solución, <br />
            Contáctanos. <br />
            Déjalo en nuestras manos.
          </p>

          {/* Botón de información */}
          <button className="mt-4 px-6 py-2 bg-accent text-white rounded-lg shadow hover:bg-accent/90 transition-all">
            Más información
          </button>
        </div>

        {/* Imagen a la derecha */}
        <div className="bg-card h-48 flex items-center justify-center rounded-lg shadow">
          <span className="text-primary-text">Imagen 2</span>
        </div>
      </div>
    </div>
  );
};

export default ContactoLanding;
