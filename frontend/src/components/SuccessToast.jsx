"use client"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function SuccessToast({ isOpen = false, message = "Operación realizada con éxito" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
