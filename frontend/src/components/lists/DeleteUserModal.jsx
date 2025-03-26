import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteUserModal({ isOpen, onCancel, onConfirm }) {
  if (typeof window === "undefined") return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {/* Icono opcional */}
              <div className="text-red-500 text-3xl">⚠️</div>

              {/* Título */}
              <h2 className="text-xl font-semibold text-gray-800">
                ¿Eliminar usuario?
              </h2>

              {/* Descripción opcional */}
              <p className="text-sm text-gray-500 -mt-2">
                <span>¿Estas seguro de que quieres eliminarlo?</span>
                <br />
                <span>Esta acción no se puede deshacer.</span>
              </p>

              {/* Botones */}
              <div className="flex justify-center gap-3 mt-4 w-full">
                <button
                  onClick={onCancel}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-150"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
