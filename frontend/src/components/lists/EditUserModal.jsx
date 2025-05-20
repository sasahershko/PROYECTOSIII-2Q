"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { updateUser } from "@/lib/users";
import Toast from "@/components/ui/Toast";
import { PencilIcon } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

export default function EditUserModal({ user, isOpen, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    dni: "",
    grade: "",
    rol: "",
    profileImage: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Estado para popup de cambio de rol a admin
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [pendingRole, setPendingRole] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        surname: user.surname ?? "",
        dni: user.dni ?? "",
        grade: user.grade ?? "",
        rol: user.rol ?? "",
        profileImage: user.profileImage ?? "",
      });
      setFile(null);
      setPreview(null);
    }
  }, [user]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "rol" && value === "admin" && form.rol !== "admin") {
  //     setPendingRole("admin");
  //     setShowRoleWarning(true);
  //     return;
  //   }
  //   setForm((f) => ({ ...f, [name]: value }));
  // };

const handleChange = e => {
  const { name, value } = e.target;
  setForm(fm => ({ ...fm, [name]: value }));
};


  const handleFileChange = e => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setForm(fm => ({ ...fm, file: f }));
  };



  const confirmRoleChange = () => {
    setForm((f) => ({ ...f, rol: pendingRole }));
    setShowRoleWarning(false);
    setPendingRole("");
  };

  const cancelRoleChange = () => {
    setShowRoleWarning(false);
    setPendingRole("");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!user) return;
  //   setSaving(true);

  //   try {
  //     const payload = {};
  //     Object.entries(form).forEach(([key, val]) => {
  //       if (val != null && val !== "null" && val !== "") {
  //         payload[key] = val;
  //       }
  //     });

  //     if (file) {
  //       const formData = new FormData();
  //       Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
  //       formData.append("file", file);
  //       await updateUser(user._id, formData);
  //     } else {
  //       await updateUser(user._id, payload);
  //     }

  //     showToast("✅ Usuario actualizado correctamente");
  //     onUpdated?.();
  //     onClose();
  //   } catch (err) {
  //     showToast(`❌ ${err.message}`, "error");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simplemente le pasas tu objeto `form`, que ya incluye `file` cuando se selecciona
      await updateUser(user._id, form);
      showToast("✅ Usuario actualizado correctamente");
      onUpdated?.();
      onClose();
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };


  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card rounded-lg w-[90%] max-w-2xl p-8 relative border border-card shadow"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-2xl text-secundary-text hover:text-accent transition"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-accent">
              Editar usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Imagen */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-accent bg-card">
                  {preview ? (
                    <img
                      src={preview}
                      alt="avatar-preview"
                      className="w-full h-full object-cover"
                    />
                  ) : form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-secundary-text bg-primary-bg">
                      <PencilIcon />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="cursor-pointer inline-block px-4 py-2 bg-accent rounded-md text-sm text-white hover:opacity-90 transition">
                    Seleccionar imagen
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {file && (
                    <span className="mt-1 text-xs text-secundary-text">
                      {file.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Dos columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="DNI"
                    name="dni"
                    value={form.dni}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Apellidos"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                  />
                  <Select
                    label="Grado"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    options={["INSO", "MAIS", "FIIS", "DIPI", "ANIV"]}
                  />
                </div>
              </div>

              {/* Rol separado */}
              <div>
                <Select
                  label="Rol"
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  options={ROLE_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>

            {/* POPUP CAMBIO A ADMIN */}
            <AnimatePresence>
              {showRoleWarning && (
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-[6px] flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={cancelRoleChange}
                  style={{ zIndex: 100 }}
                >
                  <motion.div
                    className="bg-card rounded-lg shadow-lg p-8 max-w-3xl relative border border-accent"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-2 text-accent">
                      ¡Atención!
                    </h3>
                    <p className="text-sm text-secundary-text mb-6">
                      Vas a asignar el rol{" "}
                      <b className="text-accent">Administrador</b> a este
                      usuario.
                      <br />
                      Un administrador puede modificar, borrar y gestionar
                      cualquier dato del sistema.
                      <br />
                      <span className="text-accent font-semibold">
                        ¿Estás seguro de que quieres continuar?
                      </span>
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelRoleChange}
                        className="px-4 py-2 rounded border border-secundary text-secundary-text bg-card hover:bg-accent/10 font-medium transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmRoleChange}
                        className="px-4 py-2 rounded border border-accent bg-accent text-white hover:opacity-90 font-semibold transition"
                      >
                        Sí, cambiar a admin
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {toast.visible && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((t) => ({ ...t, visible: false }))}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Componentes reutilizables
function Input({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm text-secundary-text mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-md border border-card bg-primary-bg text-primary-text focus:outline-accent"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm text-secundary-text mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-md border border-card bg-primary-bg text-primary-text focus:outline-accent"
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}