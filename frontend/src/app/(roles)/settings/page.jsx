"use client";

import { useEffect, useState, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { getProfile } from "@lib/profile";
import { updateUser } from "@lib/users";
import SpinLoader from "@components/SpinLoader";
import Toast from "@components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon } from "lucide-react";

// Drag & drop hook
function useDragDropImage(onFileSelected) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleAreaClick = () => inputRef.current?.click();
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return {
    inputRef,
    dragActive,
    handleAreaClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleChange,
  };
}

function ProfileImageSelector({ initialImage, onSubmit, saving }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImage);

  const {
    inputRef,
    dragActive,
    handleAreaClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleChange,
  } = useDragDropImage((f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  });

  useEffect(() => {
    if (!file) setPreview(initialImage);
    return () => file && URL.revokeObjectURL(preview);
    // eslint-disable-next-line
  }, [file, initialImage]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(file);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center gap-6 w-full"
    >
      <div
        className={`
          relative w-40 h-40 rounded-full overflow-hidden border-2
          flex items-center justify-center cursor-pointer transition
          ${
            dragActive
              ? "border-accent ring-4 ring-accent/30 bg-accent/10"
              : "border-accent bg-card"
          }
          hover:ring-2 hover:ring-accent/60
        `}
        tabIndex={0}
        role="button"
        title="Haz clic o arrastra una imagen"
        onClick={(e) => {
          // Evita que el input se dispare dos veces
          if (e.target.tagName !== "INPUT") {
            handleAreaClick();
          }
        }}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleAreaClick()
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragLeave}
        onDrop={handleDrop}
        style={{ outline: "none" }}
      >
        {preview ? (
          <img
            src={preview}
            alt="avatar-preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl text-secundary-text bg-primary-bg">
            <PencilIcon size={56} />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          tabIndex={-1}
          aria-hidden="true"
        />
        {dragActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/20 text-accent text-sm font-semibold z-10 pointer-events-none">
            Suelta la imagen aquí
          </div>
        )}
      </div>
      <span className="text-xs text-secundary-text mb-2 text-center">
        Haz clic o arrastra una imagen
      </span>
      <button
        type="submit"
        disabled={saving}
        className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition"
      >
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    grade: "",
    dni: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setForm({
          name: data.name,
          surname: data.surname,
          grade: data.grade,
          dni: data.dni,
        });
      } catch {
        showToast("Error al cargar el perfil.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((v) => ({ ...v, visible: false })), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // use user.id (from getProfile) always exists
      const updated = await updateUser(user.id, form);
      updated.id = updated._id;
      setUser(updated);
      showToast("✅ Perfil actualizado correctamente.");
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  // <<<<<<<< MODAL DE SUBIDA DE IMAGEN >>>>>>>>
  const handleImageFileSubmit = async (selectedFile) => {
    setModalSaving(true);
    try {
      const updated = await updateUser(user.id, { file: selectedFile });
      updated.id = updated._id;
      setUser(updated);
      showToast("✅ Imagen de perfil actualizada.");
      closeImageModal();
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    } finally {
      setModalSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg text-primary-text">
        <SpinLoader size="40px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text px-6 py-10 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-secundary-text">
          Configuración
        </h1>

        <section>
          <h2 className="text-xl font-medium mb-2 text-primary-text">Tema</h2>
          <div className="flex items-center justify-between bg-card p-4 rounded-md">
            <span className="text-sm text-secundary-text">
              Elige entre una selección de temas.
            </span>
            <ThemeToggle />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Imagen con hover overlay */}
          <div
            onClick={openImageModal}
            className="relative w-64 h-64 mx-auto ring-4 ring-card lg:mx-0 cursor-pointer rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
          >
            <img
              src={user.profileImage || "https://via.placeholder.com/150"}
              alt="Imagen de perfil"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <div className="p-2 border-2 border-dashed border-white rounded-full mb-2">
                  <PencilIcon size={24} />
                </div>
                <span className="text-sm font-medium">Cambiar imagen</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium text-primary-text mb-4">
              Editar perfil
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <Input
                  label="DNI"
                  name="dni"
                  value={form.dni}
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
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((v) => ({ ...v, visible: false }))}
        />
      )}

      <AnimatePresence>
        {showImageModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div
              className="bg-white rounded-lg p-8 w-[90%] max-w-md shadow-xl flex flex-col items-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center w-full mb-6">
                <h3 className="text-lg font-bold text-secundary-text">
                  Cambiar imagen de perfil
                </h3>
                <button onClick={closeImageModal} className="text-2xl">
                  ×
                </button>
              </div>
              <ProfileImageSelector
                initialImage={user.profileImage}
                onSubmit={handleImageFileSubmit}
                saving={modalSaving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// COMPONENTES REUTILIZABLES
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
        className="bg-primary-bg text-primary-text px-4 py-2 rounded-md border border-gray-300 focus:outline-accent"
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
        className="bg-primary-bg text-primary-text px-4 py-2 rounded-md border border-gray-300 focus:outline-accent"
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
