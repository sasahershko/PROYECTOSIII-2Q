"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    dni: "",
    password: "",
    confirmPassword: "",
    grado: "INSO",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const gradosPermitidos = ["INSO", "MAIS", "FIIS"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de correo u-tad
    const correoRegex = /@u-tad\.com$|@live\.u-tad\.com$/;
    if (!correoRegex.test(formData.correo)) {
      setError("El correo debe ser del dominio @u-tad.com o @live.u-tad.com.");
      return;
    }

    // Validación de contraseña
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Construcción del objeto según el backend
    const userData = {
      name: formData.nombre,
      surname: formData.apellido,
      email: formData.correo,
      password: formData.password,
      dni: formData.dni,
      grade: formData.grado,
    };

    try {
      const response = await registerUser(userData);
      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center px-8 py-12">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Apellidos"
            required
          />
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Correo Electrónico"
            required
          />
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="DNI"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Contraseña"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="Confirmar Contraseña"
            required
          />
          <select
            name="grado"
            value={formData.grado}
            onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {gradosPermitidos.map((grado, index) => (
              <option key={index} value={grado}>
                {grado}
              </option>
            ))}
          </select>
          <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
            Registrarse
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-500 font-semibold">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
