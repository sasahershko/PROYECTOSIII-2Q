"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { updateNote, deleteNote } from "@/lib/projects"
import ProjectUserSelector from "@/components/projects/ProjectUserSelector"
import DeleteConfirmModal from "@/components/DeleteConfirmModal"

export default function EditNoteModal({ isOpen, onClose, projectId, projectUsers, noteToEdit, onNoteEdited }) {
  if (typeof window === "undefined") return null

  const [note, setNote] = useState("")
  const [tag, setTag] = useState("no completada")
  const [userWhoRecieves, setUserWhoRecieves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (noteToEdit) {
      setNote(noteToEdit.note || "")
      setTag(noteToEdit.tag || "no completada")
      setUserWhoRecieves(
        Array.isArray(noteToEdit.userWhoRecieves)
          ? noteToEdit.userWhoRecieves.map((u) => u._id || u)
          : []
      )
    }
  }, [noteToEdit])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (userWhoRecieves.length < 1) {
        setError("Debes seleccionar al menos un usuario")
        setIsLoading(false)
        return
      }

      await updateNote(
        {
          note,
          tag,
          userWhoRecieves,
          noteIndex: noteToEdit.index,
        },
        projectId
      )

      if (onNoteEdited) {
        const fullUsers = projectUsers.filter((user) =>
          userWhoRecieves.includes(user._id)
        )
        onNoteEdited(
          { ...noteToEdit, note, tag, userWhoRecieves: fullUsers },
          noteToEdit.index
        )
      }

      onClose()
    } catch (err) {
      setError(err.message || "Error al modificar la nota")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!noteToEdit) return
    setIsLoading(true)
    try {
      await deleteNote({ noteIndex: noteToEdit.index }, projectId)

      if (onNoteEdited) {
        onNoteEdited(null, noteToEdit.index)
      }

      onClose()
    } catch (err) {
      setError(err.message || "Error al eliminar la nota")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && noteToEdit && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
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
                <h2 className="text-xl font-semibold mb-6">Modificar nota</h2>

                <div className="mb-4">
                  <label className="block font-medium mb-1">Nota</label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Edita el contenido de la nota..."
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
                  label="Usuarios asignados"
                  availableUsers={projectUsers || []}
                  selectedUsers={userWhoRecieves}
                  setSelectedUsers={setUserWhoRecieves}
                />

                {error && <p className="text-red-500 mt-4">{error}</p>}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-300 rounded transition duration-500 hover:bg-gray-400"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-500"
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="¿Eliminar esta nota?"
        description="Esta acción no se puede deshacer. La nota será eliminada permanentemente."
      />
    </>,
    document.body
  )
}
