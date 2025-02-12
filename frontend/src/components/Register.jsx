"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Register() {
  const [formData, setFormData] = useState({ nombre: "", correo: "", password: "", grado: "INSO" });
  const [error, setError] = useState("");
  const router = useRouter();

  const gradosPermitidos = ["INSO", "MAIS", "FIIS"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.mensaje);

      // Guardar el token JWT en el localStorage después del registro
      localStorage.setItem("jwt", responseData.token);

      router.push("/auth/login");
      
    } catch (error) {
      setError(error.message); // Mostrar mensaje de error si el correo ya está en uso
    }
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex w-full h-screen">
        <div className="flex-1 bg-gray-900 text-white flex flex-col justify-center items-center px-8 py-12">
          <h1 className="text-5xl font-bold mb-10" style={{ fontFamily: "Open Sans, sans-serif" }}>
            Project Center
          </h1>
          <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Open Sans, sans-serif" }}>
              Registro
            </h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Nombre"
                  required
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
              </div>

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

              <div>
                <select
                  name="grado"
                  value={formData.grado}
                  onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                  className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {gradosPermitidos.map((grado, index) => (
                    <option key={index} value={grado}>
                      {grado}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Registrarse
              </button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
              ¿Ya tienes cuenta? <a href="/auth/login" className="text-blue-500 font-semibold">Inicia sesión</a>
            </p>
          </div>
        </div>

        <div className="flex-1 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-lg">Imagen</span>
        </div>
      </div>
    </>
  );
}
