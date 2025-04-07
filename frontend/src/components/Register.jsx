"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
  verifyUserCode,
  resendVerificationCode,
} from "@/lib/auth";
import {
  validarCorreo,
  validarDNI,
  validarPassword,
  validarConfirmacionPassword,
  validarGrado,
} from "../utils/validations";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    dni: "",
    password: "",
    confirmPassword: "",
    grado: "",
    codigoVerificacion: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [usuarioTemporal, setUsuarioTemporal] = useState(null);
  const [intentosRestantes, setIntentosRestantes] = useState(3); // Control de intentos
  const [cooldown, setCooldown] = useState(0); // Estado para el cooldown del botón
  const router = useRouter();

  const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores

    if (!validarCorreo(formData.correo)) {
      setError("El correo debe ser de la Universidad.");
      return;
    }

    if (!validarDNI(formData.dni)) {
      setError("El DNI no es válido.");
      return;
    }

    if (!validarPassword(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    if (
      !validarConfirmacionPassword(formData.password, formData.confirmPassword)
    ) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!validarGrado(formData.grado)) {
      setError("El grado seleccionado no es válido.");
      return;
    }

    // Si todo está correcto, enviar la solicitud
    const userData = {
      name: formData.nombre,
      surname: formData.apellido,
      email: formData.correo,
      password: formData.password,
      dni: formData.dni,
      grade: formData.grado,
    };

    try {
      await registerUser(userData);
      setUsuarioTemporal(userData);
      setCurrentStep(5);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.codigoVerificacion) {
      setError("Por favor, introduce el código de verificación.");
      return;
    }

    try {
      await verifyUserCode({
        email: usuarioTemporal.email,
        code: formData.codigoVerificacion,
      });

      alert("Verificación exitosa. Redirigiendo...");
      router.push("/login");
    } catch (error) {
      setIntentosRestantes(intentosRestantes - 1);

      if (intentosRestantes - 1 <= 0) {
        setError("Demasiados intentos fallidos. Regístrate de nuevo.");
        setTimeout(() => router.push("/register"), 2000); // Redirigir al usuario
      } else {
        setError(
          `Código incorrecto. Intentos restantes: ${intentosRestantes - 1}`
        );
      }
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return; // Si el cooldown está activo, no hacer nada

    try {
      await resendVerificationCode({ email: usuarioTemporal.email });
      setCooldown(50); // Iniciar cooldown de 50 segundos
    } catch (error) {
      setError("No se pudo reenviar el código. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0)); // Evita valores negativos
      }, 1000);

      return () => clearInterval(interval); // Limpieza del intervalo cuando cambia el cooldown
    }
  }, [cooldown]);

  const nextStep = () => {
    if (currentStep === 1 && (!formData.nombre || !formData.apellido)) {
      setError("Por favor, completa todos los campos de esta sección.");
      return;
    }

    if (currentStep === 2) {
      if (!validarCorreo(formData.correo)) {
        setError("El correo debe ser de la Universidad.");
        return;
      }
      if (!validarDNI(formData.dni)) {
        setError("El DNI no es válido.");
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Por favor, completa todos los campos de esta sección.");
        return;
      }

      if (!validarPassword(formData.password)) {
        setError(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
        );
        return;
      }

      if (
        !validarConfirmacionPassword(
          formData.password,
          formData.confirmPassword
        )
      ) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    if (currentStep === 4 && !validarGrado(formData.grado)) {
      setError("Por favor, selecciona un grado válido.");
      return;
    }

    // Avanzar al siguiente paso si no hay errores
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

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Solo permitir números

    const updatedCode = formData.codigoVerificacion.split("");
    updatedCode[index] = value;
    setFormData({ ...formData, codigoVerificacion: updatedCode.join("") });

    // Mover el foco al siguiente input automáticamente si el usuario ingresa un número
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const updatedCode = formData.codigoVerificacion.split("");

      if (!updatedCode[index] && index > 0) {
        // Si la casilla está vacía y se presiona "Backspace", eliminar el anterior y mover foco atrás
        updatedCode[index - 1] = "";
        setFormData({ ...formData, codigoVerificacion: updatedCode.join("") });
        document.getElementById(`code-${index - 1}`).focus();
      } else {
        // Si hay un número en la casilla actual, simplemente vaciarlo
        updatedCode[index] = "";
        setFormData({ ...formData, codigoVerificacion: updatedCode.join("") });
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Solo permitir un código numérico de 6 dígitos

    const updatedCode = pastedData.split("");
    setFormData({ ...formData, codigoVerificacion: updatedCode.join("") });

    // Enfocar el último input automáticamente
    document.getElementById(`code-${Math.min(updatedCode.length, 5)}`).focus();
  };

  // Progreso de la barra (porcentaje)
  const progress = Math.min(((currentStep - 1) / 4) * 100, 100);

  return (
    <motion.div
      className="flex-1 flex justify-center items-center px-8 py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Alerta de error animada */}
      {error && (
        <motion.div
          onClick={() => setError("")}
          className="absolute top-44 md:left-1/4 left-[50vw] min-w-[80%] max-w-[80vw] md:max-w-[40vw] md:min-w-min bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-slideUp cursor-default"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
      <motion.div
        className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative mb-10 flex flex-col gap-1">
          <div className="text-sm text-gray-700">{currentStep} de 5</div>
          <div className="w-full bg-gray-300 rounded-full h-2.5 flex flex-col gap-6">
            <motion.div
              className="bg-accent h-2.5 rounded-full transition-all duration-300 ease-in-out"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Vista 1: Nombre y Apellidos */}
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500 mb-6"
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
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500"
                  placeholder="Apellidos"
                  required
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Vista 2: Correo Electrónico y DNI */}
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500 mb-6"
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
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500"
                  placeholder="DNI"
                  required
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Vista 3: Contraseña y Confirmar Contraseña */}
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500 mb-6"
                  placeholder="Contraseña"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500"
                  placeholder="Confirmar Contraseña"
                  required
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Vista 4: Selección del grado */}
                <select
                  name="grado"
                  value={formData.grado}
                  onChange={(e) =>
                    setFormData({ ...formData, grado: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
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
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Paso 5: Verificación de código */}
                <p className="mb-4 text-gray-700">
                  Te hemos enviado un código de verificación a {formData.correo}
                  . Introduce el código para continuar.
                </p>
                <div className="flex justify-center gap-3 mb-4">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength="1"
                      className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 
                      rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 
                      transition-all duration-200 shadow-md bg-gray-100"
                      value={formData.codigoVerificacion[index] || ""}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/85 relative top-3"
                >
                  Verificar Código
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de navegación */}
          <div className="flex justify-between mt-6 gap-4">
            {currentStep > 1 && currentStep < 5 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full bg-secundary text-white py-3 rounded-lg font-semibold hover:bg-secundary/85"
              >
                Atrás
              </button>
            )}

            {/* Mostrar el botón "Siguiente" hasta el paso 4 */}
            {currentStep < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/85"
              >
                Siguiente
              </button>
            )}

            {/* Mostrar "Registrarse" solo en el paso 4 */}
            {currentStep === 4 && (
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Registrarse
              </button>
            )}
            {/* Mostrar "Reenviar código" solo en el paso 5 */}
            {currentStep === 5 && (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0}
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  cooldown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-secundary hover:bg-secundary/85"
                }`}
              >
                {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
              </button>
            )}
          </div>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-accent font-semibold">
            Inicia sesión
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
