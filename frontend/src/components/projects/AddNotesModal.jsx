"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addNote } from "@/lib/projects";
import ProjectUserSelector from "@/components/projects/ProjectUserSelector";

export default function AddNotesModal({ projectId, projectUsers, isOpen, onClose, onNoteAdded }) {
  if (typeof window === "undefined") return null;

  const [note, setNote] = useState("");
  const [tag, setTag] = useState("no completada");
  const [userWhoRecieves, setUserWhoRecieves] = useState([]); // IDs de usuarios seleccionados del proyecto
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (userWhoRecieves.length < 1) {
        setError('Debes seleccionar al menos un usuario');
        return;
      }
      const noteData = {
        note,
        tag,
        userWhoRecieves,
      };

      const createdNote = await addNote(noteData, projectId);
      
      console.log(createdNote);

      if (onNoteAdded) {
        const fullUsers = projectUsers.filter(user =>
          userWhoRecieves.includes(user._id)
        );

        onNoteAdded({
          ...createdNote,
          userWhoRecieves: fullUsers, 
        });
        
      }


      // Reiniciar estados y cerrar modal tras el éxito
      setNote("");
      setTag("no completada");
      setUserWhoRecieves([]);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-primary-bg p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Añadir nota</h2>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Nota</label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe aquí la nota..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Estado</label>
                  <select
                    className="w-full border rounded p-2"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option value="no completada">No completada</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>

                <ProjectUserSelector
                  label="Usuarios que reciben"
                  availableUsers={projectUsers || []} // Garantiza que sea un arreglo
                  selectedUsers={userWhoRecieves}
                  setSelectedUsers={setUserWhoRecieves}
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Agregando..." : "Agregar Nota"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
