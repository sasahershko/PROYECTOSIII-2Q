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
} from "@/utils/validations";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/ui/Toast";

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
  const [toastType, setToastType] = useState("error"); // "error" or "success"
  const [showToast, setShowToast] = useState(false);

  const [usuarioTemporal, setUsuarioTemporal] = useState(null);
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];

  const notifyError = (msg) => {
    setError(msg);
    setToastType("error");
    setShowToast(true);
  };
  const notifySuccess = (msg) => {
    setError(msg);
    setToastType("success");
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validations
    if (!validarCorreo(formData.correo)) {
      return notifyError("El correo debe ser de la Universidad.");
    }
    if (!validarDNI(formData.dni)) {
      return notifyError("El DNI no es válido.");
    }
    if (!validarPassword(formData.password)) {
      return notifyError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
    }
    if (
      !validarConfirmacionPassword(formData.password, formData.confirmPassword)
    ) {
      return notifyError("Las contraseñas no coinciden.");
    }
    if (!validarGrado(formData.grado)) {
      return notifyError("El grado seleccionado no es válido.");
    }

    try {
      const userData = {
        name: formData.nombre,
        surname: formData.apellido,
        email: formData.correo,
        password: formData.password,
        dni: formData.dni,
        grade: formData.grado,
      };
      await registerUser(userData);
      setUsuarioTemporal(userData);
      notifySuccess("¡Registro exitoso! Revisa tu correo.");
      setCurrentStep(5);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.codigoVerificacion) {
      return notifyError("Por favor, introduce el código de verificación.");
    }
    try {
      await verifyUserCode({
        email: usuarioTemporal.email,
        code: formData.codigoVerificacion,
      });
      notifySuccess("Verificación exitosa. Redirigiendo...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      const restantes = intentosRestantes - 1;
      setIntentosRestantes(restantes);
      if (restantes <= 0) {
        notifyError("Demasiados intentos fallidos. Regístrate de nuevo.");
        setTimeout(() => router.push("/register"), 2000);
      } else {
        notifyError(`Código incorrecto. Intentos restantes: ${restantes}`);
      }
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    try {
      await resendVerificationCode({ email: usuarioTemporal.email });
      notifySuccess("Código reenviado. Revisa tu correo.");
      setCooldown(50);
    } catch {
      notifyError("No se pudo reenviar el código. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(
        () => setCooldown((c) => Math.max(c - 1, 0)),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const nextStep = () => {
    // step-specific validation omitted for brevity; same as before
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      setShowToast(false);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      setShowToast(false);
    }
  };

  const handleCodeChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const arr = formData.codigoVerificacion.split("");
    arr[idx] = val;
    setFormData({ ...formData, codigoVerificacion: arr.join("") });
    if (val && idx < 5) {
      document.getElementById(`code-${idx + 1}`)?.focus();
    }
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      const arr = formData.codigoVerificacion.split("");
      if (!arr[idx] && idx > 0) {
        arr[idx - 1] = "";
        setFormData({ ...formData, codigoVerificacion: arr.join("") });
        document.getElementById(`code-${idx - 1}`)?.focus();
      } else {
        arr[idx] = "";
        setFormData({ ...formData, codigoVerificacion: arr.join("") });
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    setFormData((f) => ({ ...f, codigoVerificacion: paste }));
    document.getElementById(`code-${5}`)?.focus();
  };

  const progress = Math.min(((currentStep - 1) / 4) * 100, 100);

  return (
    <motion.div
      className="flex-1 flex justify-center items-center px-8 py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <AnimatePresence>
        {showToast && error && (
          <Toast
            message={error}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white p-12 rounded-lg shadow-lg w-full max-w-lg text-black relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Progress bar */}
        <div className="relative mb-8">
          <div className="text-sm text-gray-700">{`${currentStep} de 5`}</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <motion.div
              className="bg-accent h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellidos"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  className="w-full mt-4 px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo Electrónico"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="text"
                  name="dni"
                  placeholder="DNI"
                  value={formData.dni}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                  className="w-full mt-4 px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full mt-4 px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                  {gradosPermitidos.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-4 text-gray-700">
                  Te hemos enviado un código de verificación a {formData.correo}
                  . Introduce el código para continuar.
                </p>
                <div className="flex justify-center gap-3 mb-4">
                  {[...Array(6)].map((_, idx) => (
                    <input
                      key={idx}
                      id={`code-${idx}`}
                      type="text"
                      maxLength="1"
                      className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                      value={formData.codigoVerificacion[idx] || ""}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/85"
                >
                  Verificar Código
                </button>
              </motion.div>
            )}
          </AnimatePresence>

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
            {currentStep < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/85"
              >
                Siguiente
              </button>
            )}
            {currentStep === 4 && (
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Registrarse
              </button>
            )}
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
