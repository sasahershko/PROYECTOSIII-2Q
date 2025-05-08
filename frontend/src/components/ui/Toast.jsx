"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }} // entra desde la derecha
          animate={{ opacity: 1, x: 0 }} // se estabiliza
          exit={{ opacity: 0, x: -50 }} // sale hacia la izquierda
          transition={{ duration: 0.3 }}
          className={`fixed top-[85px] right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-base font-semibold flex items-center justify-between min-w-[280px] max-w-md
            ${
              type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
        >
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 font-bold text-xl">
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
