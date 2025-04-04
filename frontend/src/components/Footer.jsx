import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  // Debe de ir en los layouts de las páginas para
  // que se muestre en todas las páginas y mantener la consistencia.

  return (
    <>
      <div className="w-full bg-secundary text-gray-400 py-6 flex flex-col px-4 md:px-16 lg:px-80">
        <div className="flex flex-col justify-center items-center mb-4 sm:justify-start sm:items-start">
          <h3 className="bg-white/90 py-2 px-4 text-secundary font-semibold w-fit">
            MARCAS CON LAS QUE TRABAJAMOS
          </h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 px-16 sm:px-0 w-full place-items-center">
            {[
              {
                src: "/logos/EmpresasColaboradoras/Abai.webp",
                alt: "Logo Abai",
              },
              {
                src: "/logos/EmpresasColaboradoras/Idavinci.webp",
                alt: "Logo Idavinci",
              },
              {
                src: "/logos/EmpresasColaboradoras/logo-museo.webp",
                alt: "Logo Museo",
              },
              {
                src: "/logos/EmpresasColaboradoras/masorange.webp",
                alt: "Logo MasOrange",
              },
              {
                src: "/logos/EmpresasColaboradoras/MCNValencia.webp",
                alt: "Logo MCN Valencia",
              },
              {
                src: "/logos/EmpresasColaboradoras/Moss.webp",
                alt: "Logo Moss",
              },
              {
                src: "/logos/EmpresasColaboradoras/rtve.webp",
                alt: "Logo RTVE",
              },
              {
                src: "/logos/EmpresasColaboradoras/Talgo.webp",
                alt: "Logo Talgo",
              },
            ].map((logo, index) => (
              <div key={index} className="flex justify-center">
                {/* Aquí se establece un ancho fijo en móvil (w-20), que aumenta en pantallas mayores */}
                <div className="w-20 sm:w-24 md:w-full">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={100}
                    className="object-contain w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-5 w-full border-gray-600" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row justify-start items-center">
            <Image
              src={"/logos/logoUtadWhite.webp"}
              alt="Logo"
              width={200}
              height={50}
            />
            <div className="flex flex-col justify-center items-center pl-0 md:pl-12 mt-4 md:mt-0 sm:items-start sm:justify-start">
              <Link
                href="https://u-tad.com/politica-de-privacidad/"
                target="_blank"
                className="pointer font-semibold hover:text-white/90 mb-2"
              >
                POLITICA DE PRIVACIDAD
              </Link>
              <Link
                href="https://u-tad.com/politica-de-cookies/"
                target="_blank"
                className="pointer font-semibold hover:text-white/90 mb-2"
              >
                POLITICA DE COOKIES
              </Link>
              <p>&copy; U-tad 2025 | Uup marketing digital</p>
            </div>
          </div>
          <div className="flex flex-col justify-end items-center md:items-end mt-4 md:mt-0">
            <p className="text-center md:text-right">
              Calle Playa de Liencres, 2 bis. – Parque Europa Empresarial
            </p>
            <p className="text-center md:text-right">
              Edificio Bruselas – 28290 Las Rozas, Madrid
            </p>
            <p className="mt-2 text-center md:text-right">
              Tel: (+34) 900 373 379
            </p>
            <h3 className="bg-white/90 py-2 px-4 text-secundary font-semibold w-fit mt-2">
              DESARROLLADO POR ALUMNOS DE U-TAD
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
