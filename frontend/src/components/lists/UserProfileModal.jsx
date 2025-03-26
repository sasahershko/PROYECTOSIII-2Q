import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import GradeChip from "@components/ui/chip";

export default function UserProfileModal({ user, isOpen, onClose }) {
  if (typeof window === "undefined") return null;

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
          onClick={handleBackdropClick} // Cierra si clicas el fondo
        >
          <motion.div
            className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del modal
          >
            {/* Cabecera */}
            <div className="flex justify-between items-start flex-wrap gap-4">
              {/* Izquierda */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name} {user.surname}
                  </h2>
                  <p className="text-md text-gray-700 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Derecha */}
              <div className="flex flex-col items-end gap-2 justify-center text-sm text-gray-600">
                <span className="font-semibold text-base">{user.rol}</span>
                <GradeChip grado={user.grade} />
              </div>
            </div>

            {/* Datos extra */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
