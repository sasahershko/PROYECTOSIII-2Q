"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"; 
import { loginUser } from "@/lib/auth";

export default function Login() {
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamar a la función del archivo Auth.js para hacer login
      const responseData = await loginUser(formData);

      router.push("/");
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        {/* Importar fuente desde Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex w-full h-screen">
        {/* Sección izquierda con el formulario */}
        <div className="flex-1 bg-gray-900 text-white flex flex-col justify-center items-center px-8 py-12">
          <h1 className="text-5xl font-bold mb-10" style={{ fontFamily: "Open Sans, sans-serif" }}>
            Project Center
          </h1>
          <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Open Sans, sans-serif" }}>
              Iniciar Sesión
            </h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Correo Electrónico"
                  required
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Contraseña"
                  required
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Iniciar sesión
              </button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
              ¿No tienes cuenta? <a href="/auth/register" className="text-blue-500 font-semibold">Regístrate</a>
            </p>
          </div>
        </div>

        {/* Sección derecha con imagen */}
        <div className="flex-1 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-lg">Imagen</span>
        </div>
      </div>
    </>
  );
}
