"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Loader2 } from "lucide-react"

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "¿Eliminar este elemento?",
  description = "Esta acción no se puede deshacer. El elemento será eliminado permanentemente.",
}) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="delete-modal"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 shadow-sm">
              <Trash2 className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-600">{description}</p>
          </div>
          <div className="flex gap-3 justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
