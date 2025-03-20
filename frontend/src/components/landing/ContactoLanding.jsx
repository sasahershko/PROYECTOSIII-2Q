const ContactoLanding = () => {
  return (
    <div id="contacto" className="w-full bg-white py-16">
      <div className="container max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          
          {/* Texto y botón centrados */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-bold mb-6 bg-card p-2 px-4 inline-block">
              ¿QUIERES TRABAJAR CON NOSOTROS?
            </h2>
            <p className="text-gray-600">
              Si eres una empresa y necesitas una solución, <br />
              Contáctanos <br />
              ¡Déjalo en nuestras manos!
            </p>

            {/* Botón de información centrado */}
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition mx-auto">
              Quiero Más Información
            </button>
          </div>

          {/* Imagen */}
          <div className="w-full h-64 md:h-72 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
            <img src="/carrusel/image2.png" alt="Presentación" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoLanding;
