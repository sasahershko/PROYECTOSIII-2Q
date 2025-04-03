"use client"
import { useState } from "react"
import AddNotesModal from "./AddNotesModal"

export default function NotesSection({ notes = [] }) {
    notes.map(n => console.log('USER WHO RECIEVES: ', n.userWhoReceives))
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
    const closeNoteModal = () => setIsNoteModalOpen(false)

    const handleNoteModal = (e) => {
        e.stopPropagation()
        setIsNoteModalOpen(!isNoteModalOpen)
    }

    // Función para obtener un color basado en el nombre (para los avatares)
    const getColorFromName = (name) => {
        const colors = [
            "bg-blue-100 text-blue-600",
            "bg-green-100 text-green-600",
            "bg-purple-100 text-purple-600",
            "bg-amber-100 text-amber-600",
            "bg-rose-100 text-rose-600",
            "bg-cyan-100 text-cyan-600",
        ]

        console.log('GETCOLORFROMNAME', name)
        // Usar la suma de los códigos de caracteres para seleccionar un color
        // const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // return colors[sum % colors.length]
    }

    // Función para obtener iniciales del nombre
    const getInitials = (name) => {
        // return name
        //   .split(" ")
        //   .map((part) => part[0])
        //   .join("")
        //   .toUpperCase()
        console.log('GETINITIALS', name)
    }

    return (
        <div className="border rounded-xl shadow-lg overflow-hidden bg-white">
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-800">Notas</h2>
                </div>
                <button
                    onClick={handleNoteModal}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-all border border-gray-200 hover:shadow flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Añadir
                </button>
            </div>

            <AddNotesModal isOpen={isNoteModalOpen} onClose={closeNoteModal} />

            {/* Contenido */}
            <div className="p-4 h-[320px] overflow-auto bg-gray-50">
                {notes.length > 0 ? (
                    <div className="space-y-4">
                        {notes.map((nota, index) => {
                            const fromColor = getColorFromName(nota.userWhoWrites)
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${fromColor}`}>
                                            {getInitials(nota.userWhoWrites)}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{nota.userWhoWrites}</span>
                                                    <span className="text-gray-400">→</span>
                                                    {Array.isArray(nota.userWhoReceives) &&
                                                        nota.userWhoReceives.map((userId, i) => (
                                                            <span key={i} className="text-gray-600">
                                                                {userId.toString()}
                                                            </span>
                                                        ))}
                                                    <span className="text-gray-600">{nota.userWhoRecieves}</span>
                                                </div>
                                                <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-full">
                                                    {nota.timeStamp}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-2">{nota.note}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mb-2 opacity-30"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p>No existen notas pendientes</p>
                    </div>
                )}
            </div>
        </div>
    )
}

