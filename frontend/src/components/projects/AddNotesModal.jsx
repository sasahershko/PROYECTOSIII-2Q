import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import GradeChip from "@components/ui/chip";

export default function AddNotesModal({ user, isOpen, onClose }) {
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
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del modal
          >
            <div>
              <p>hola</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
