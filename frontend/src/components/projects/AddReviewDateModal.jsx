// components/projects/AddReviewDateModal.jsx
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { updateProject } from "@/lib/projects";

export default function AddReviewDateModal({
  isOpen,
  onClose,
  onSave,         // callback para añadir el evento en local
  projectId,      // ID del proyecto a actualizar
  existingDates,  // array de Date o ISO strings con los reviewDates actuales
  initialDate,    // opcional, para prellenar el date picker
}) {
  const [date, setDate] = useState("");

  // Pre-fill cuando abra
  useEffect(() => {
    if (isOpen && initialDate) {
      const d = new Date(initialDate);
      const pad = (n) => (n < 10 ? "0" + n : n);
      setDate(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`);
    }
    if (!isOpen) {
      setDate("");
    }
  }, [isOpen, initialDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    const newDate = new Date(date);
    // Construye el nuevo array
    const updatedDates = [...(existingDates || []), newDate];

    try {
      // Persistimos en la API
      await updateProject(projectId, { reviewDates: updatedDates });
      // Avisamos al padre para que actualice UI
      onSave(newDate);
      onClose();
    } catch (err) {
      console.error("Error guardando reviewDate:", err);
      // Aquí podrías mostrar un toast de error
    }
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-card p-6 rounded-xl shadow-xl w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-primary-text mb-4">
              Añadir fecha de revisión
            </h2>
            <label className="block mb-4">
              <span className="text-secundary-text">Fecha</span>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-card text-secundary-text rounded hover:bg-gray-200"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
              >
                Guardar
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
