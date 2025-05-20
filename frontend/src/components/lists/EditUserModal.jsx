"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { updateUser } from "@/lib/users";
import Toast from "@/components/ui/Toast";
import { PencilIcon } from "lucide-react";


export default function EditUserModal({ user, isOpen, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "", surname: "", grade: "", profileImage: ""
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Inicializar form cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        surname: user.surname ?? "",
        grade: user.grade ?? "",
        profileImage: user.profileImage ?? "",
      });
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleFileChange = e => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setForm(prev => ({ ...prev, file: f }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Llamamos a la única función updateUser
      const updated = await updateUser(user._id, form);
      showToast("✅ Usuario actualizado correctamente");
      onUpdated?.();
      onClose();
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // No renderizamos en SSR
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
            className="bg-card rounded-lg w-[90%] max-w-lg p-6 relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">Editar usuario</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border">
                  <img
                    src={preview || form.profileImage || "/placeholder.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="cursor-pointer inline-block px-4 py-2 bg-accent rounded-md text-sm text-secundary-text hover:bg-primary-bg transition duration-300 ">
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
                    <span className="mt-2 text-xs text-secundary-text">
                      {file.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Campos de texto */}
              <Input
                label="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>

            {toast.visible && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(t => ({ ...t, visible: false }))}
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
        className="px-4 py-2 rounded-md border bg-primary-bg text-primary-text focus:outline-accent"
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
        className="px-4 py-2 rounded-md border bg-primary-bg text-primary-text focus:outline-accent"
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
