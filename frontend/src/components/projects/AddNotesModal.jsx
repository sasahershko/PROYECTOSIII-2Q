import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserSelector from "@/components/UserSelector";

export default function AddNotesModal({ user, isOpen, onClose }) {
  if (typeof window === "undefined") return null;

  const [note, setNote] = useState("");
  const [tag, setTag] = useState("no completada");
  const [userWhoRecieves, setuserWhoRecieves] = useState([]); // por ahora vacío

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
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
            className="relative bg-primary-bg p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8 "
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
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

              {/* Placeholder para selección de usuarios */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Usuarios que reciben</label>
                <p className="text-sm text-secundary-text">(pendiente de implementar buscador o selección)</p>
              </div>
              {/* <UserSelector
                label="Destinatarios"
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                availableUsers={projectUsers}
              /> */}

              {/* Aquí luego pondrás el botón de enviar */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}