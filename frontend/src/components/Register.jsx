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
    grado: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de correo u-tad
    const correoRegex = /@u-tad\.com$|@live\.u-tad\.com$/;
    if (!correoRegex.test(formData.correo)) {
      setError("El correo debe ser de la Universidad.");
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

  const nextStep = () => {
    // Validación de los campos según el paso actual
    if (currentStep === 1) {
      if (!formData.nombre || !formData.apellido) {
        setError("Por favor, completa todos los campos de esta sección.");
        return;
      }
    }
    if (currentStep === 2) {
      // Validación de correo electrónico
      const correoRegex = /@u-tad\.com$|@live\.u-tad\.com$/;
      if (!formData.correo || !correoRegex.test(formData.correo)) {
        setError("El correo debe ser de la Universidad.");
        return;
      }

      // Validación de DNI (8 números seguidos de 1 letra)
      const dniRegex = /^[0-9]{8}[A-Za-z]$/;
      if (!formData.dni || !dniRegex.test(formData.dni)) {
        setError("El DNI debe tener 8 números seguidos de una letra.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Por favor, completa todos los campos de esta sección.");
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.grado) {
        setError("Por favor, selecciona un grado.");
        return;
      }
    }

    // Si pasa la validación, avanzar al siguiente paso
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Progreso de la barra (porcentaje)
  const progress = Math.min(((currentStep - 1) / 3) * 100, 100);

  return (
    <div className="flex-1 flex justify-center items-center px-8 py-12">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Barra de progreso */}
        <div className="relative mb-10">
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute top-4 left-0 w-full text-center text-sm text-gray-700">
            {currentStep} de 4
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vista 1: Nombre y Apellidos */}
          {currentStep === 1 && (
            <>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Apellidos"
                required
              />
            </>
          )}

          {/* Vista 2: Correo Electrónico y DNI */}
          {currentStep === 2 && (
            <>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Correo Electrónico"
                required
              />
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={(e) =>
                  setFormData({ ...formData, dni: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="DNI"
                required
              />
            </>
          )}

          {/* Vista 3: Contraseña y Confirmar Contraseña */}
          {currentStep === 3 && (
            <>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Contraseña"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Confirmar Contraseña"
                required
              />
            </>
          )}

          {/* Vista 4: Selección del grado */}
          {currentStep === 4 && (
            <select
              name="grado"
              value={formData.grado}
              onChange={(e) =>
                setFormData({ ...formData, grado: e.target.value })
              }
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Selecciona un grado
              </option>
              {gradosPermitidos.map((grado, index) => (
                <option key={index} value={grado}>
                  {grado}
                </option>
              ))}
            </select>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-6 gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-700 font-semibold hover:text-blue-600"
              >
                Atrás
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Registrarse
              </button>
            )}
          </div>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-500 font-semibold">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
