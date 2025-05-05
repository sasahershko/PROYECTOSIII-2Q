import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";


export default function EventModal({ event, isOpen, onClose }) {
  if (typeof window === "undefined") return null;
  if (!event) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Puedes acceder a más propiedades en event.extendedProps si pasas customProps
  const { title, start } = event;
  const formattedDate = new Date(start).toLocaleString();

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
            className="relative bg-white dark:bg-card p-6 rounded-xl shadow-2xl w-[90%] max-w-2xl mx-4 my-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4">
              <h2 className="text-xl font-bold text-primary-text">{title}</h2>
              <p className="text-sm text-secundary-text">{formattedDate}</p>
            </header>
            <div>
              {/* Aquí puedes incluir más detalles o formularios para notas */}
              <p className="text-primary-text">Detalles del evento selecciondo...</p>
            </div>
            <button
              className="mt-6 inline-block px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
              onClick={onClose}
            >Cerrar</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
