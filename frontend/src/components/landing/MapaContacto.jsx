import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const MapaContacto = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-10 mb-24">
      <h2 className="text-5xl font-bold text-center mb-12">
        ¿Tienes preguntas? &nbsp;
        <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
          Contáctanos
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className=" p-6 rounded-lg">
          <form>
            <label className="block text-primary-text font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3 rounded-lg mb-4 border border-transparent focus:border-accent focus:outline focus:outline-accent bg-card"
            />

            <label className="block text-primary-text font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full p-3 rounded-lg border border-transparent focus:border-accent focus:outline focus:outline-accent mb-4 bg-card"
            />

            <label className="block text-primary-text font-semibold mb-2">
              Mensaje
            </label>
            <textarea
              placeholder="Tu mensaje"
              className="w-full p-3 border border-transparent focus:border-accent focus:outline focus:outline-accent rounded-lg h-32 mb-4 bg-card"
            />

            <button className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/80 transition">
              Enviar Mensaje
            </button>
          </form>
        </div>

        {/* Información de contacto y mapa */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>

          <div className="flex items-center gap-3 mb-3">
            <FaMapMarkerAlt className="text-accent" />
            <span>Plz. de la Almunia de Doña Godina, 6, 28031 Madrid</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <FaEnvelope className="text-accent" />
            <span>saudade.artiaga@u-tad.com</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <FaPhone className="text-accent" />
            <span>+34 900 373 379</span>
          </div>

          {/* Mapa Integrado */}
          <iframe
            title="Mapa U-TAD"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6064.213767579035!2d-3.8932692999999996!3d40.5392277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4182c527808345%3A0xd99cf803771e7271!2sU-tad%20%7C%20Centro%20Universitario%20de%20Tecnolog%C3%ADa%20y%20Arte%20Digital!5e0!3m2!1ses!2ses!4v1742497616901!5m2!1ses!2ses"
            className="w-full h-64 rounded-lg border"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapaContacto;
