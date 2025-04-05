"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación antes de enviar la solicitud
    if (!formData.correo.trim() || !formData.password.trim()) {
      setError("Por favor, ingrese su correo y contraseña.");
      return;
    }

    try {
      await loginUser({ email: formData.correo, password: formData.password });
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      className="flex-1 flex justify-center items-center px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            onClick={() => setError("")}
            className="absolute top-60 md:left-1/4 left-[50vw] min-w-[80%] md:min-w-min max-w-[80vw] md:max-w-[40vw] bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-slideUp cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setError("");
                }}
                className="ml-4 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Correo Electrónico"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="Contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-accent font-semibold">
            Regístrate
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
