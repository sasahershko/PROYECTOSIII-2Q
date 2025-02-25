import "@/app/globals.css";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <html className="dark">
      <body className="font-sans text-copy-primary">
        {/* Enlace a la página principal */}
        <Link
          href="/"
          className="absolute text-white top-0 left-0 p-4 hover:opacity-85 py-5 px-7 font-bold"
        >
          ⭠ HOME
        </Link>

        <div className="flex w-full min-h-screen bg-gray-900">
          {/* Sección izquierda con el formulario */}
          <div className="flex-1 items-center justify-center">
            {children} {/* Formularios de Login y Register */}
          </div>

          {/* Sección derecha con imagen */}
          <div className="hidden md:flex flex-1 bg-gray-300 items-center justify-center">
            <Image
              src="/foto-auth.webp"
              width={1100}
              height={1200}
              className="h-screen"
              alt="Imagen de autenticación"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
