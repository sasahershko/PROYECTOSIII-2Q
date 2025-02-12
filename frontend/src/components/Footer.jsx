import Image from "next/image";

export default function Footer() {
  // Debe de ir en los layouts de las páginas para
  // que se muestre en todas las páginas y mantener la consistencia.

  return (
    <>
      <footer className="w-full bg-accent text-gray-400 py-6 mt-4 flex justify-start items-left text-left flex-col px-80">
        <div>
          <h3 className="bg-white/90 py-2 px-4 text-accent font-semibold w-fit justify-start">
            MARCAS CON LAS QUE TRABAJAMOS
          </h3>
        </div>
        <hr className="my-5 w-full" /> {/* Línea divisoria */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center">
            <Image
              src={"/logos/logoUtadWhite.webp"}
              alt="Logo"
              width={200}
              height={50}
            />
            <div className="flex flex-col justify-start items-start pl-12">
              <a
                href="https://u-tad.com/politica-de-privacidad/"
                target="_blank"
                className="pointer font-semibold hover:text-white/90"
              >
                POLITICA DE PRIVACIDAD
              </a>
              <a
                href="https://u-tad.com/politica-de-cookies/"
                target="_blank"
                className="pointer font-semibold hover:text-white/90"
              >
                POLITICA DE COOKIES
              </a>
              <br />
              <p>&copy; U-tad 2025 | Uup marketing digital</p>
              {/* Temporal, lo del copy es de la web de la U-tad */}
            </div>
          </div>
          <div className="flex flex-col justify-end items-end h-full">
            <p>Calle Playa de Liencres, 2 bis. – Parque Europa Empresarial</p>
            <p>Edificio Bruselas – 28290 Las Rozas, Madrid</p>
            <p className="mt-2">Tel 999 999 999</p>
            <h3 className="bg-white/90 py-2 px-4 text-accent font-semibold w-fit justify-start mt-2">
              DESARROLLADO POR LA U-TAD
            </h3>
          </div>
        </div>
      </footer>
    </>
  );
}
