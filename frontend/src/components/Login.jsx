"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { motion } from "framer-motion";
import Toast from "@/components/ui/Toast";

export default function Login() {
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correo.trim() || !formData.password.trim()) {
      setError("Por favor, ingrese su correo y contraseña.");
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email: formData.correo, password: formData.password });
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setShowToast(true);
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
      {showToast && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => {
            setShowToast(false);
            setError("");
          }}
        />
      )}

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
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
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
