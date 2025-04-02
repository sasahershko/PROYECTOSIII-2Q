const ContactoLanding = () => {
  return (
    <div id="contacto" className="w-full py-16">
      <div className="container max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Texto y botón centrados */}
          <div className="flex flex-col items-center justify-center text-center gap-9">
            <h2 className="text-5xl font-[730] inline-block text-primary-text">
              <span>¿QUIERES TRABAJAR CON </span>
              <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
                NOSOTROS
              </span>
              <span>?</span>
            </h2>
            <p className="text-secundary-text text-base">
              Si eres una empresa y necesitas una solución, <br />
              Contáctanos <br />
              ¡Déjalo en nuestras manos!
            </p>

            {/* Botón de información centrado */}
            <button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold shadow hover:accent/80 transition mx-auto">
              Quiero Más Información
            </button>
          </div>

          {/* Imagen */}
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
            <img
              src="/carrusel/image2.png"
              alt="Presentación"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoLanding;
