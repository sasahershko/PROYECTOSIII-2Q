"use client"
import { useState } from "react"
import AddNotesModal from "./AddNotesModal"

export default function NotesSection({ notes = [] , projectUsers}) {

    console.log(projectUsers)
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

        // Usar la suma de los códigos de caracteres para seleccionar un color
        const sum = name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
        return colors[sum % colors.length]
    }

    // Función para obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
    }

    // Función para determinar el color de la barra lateral y el estado
    const getStatusInfo = (tag) => {
        if (tag === "completada") {
            return {
                barColor: "bg-accent",
                label: "Completada",
                badgeClass: "bg-accent/10 text-accent border border-accent/30",
            };
        }
        return {
            barColor: "bg-amber-400",
            label: "No completada",
            badgeClass: "bg-card text-secundary-text border border-slate-300",
        };
    };



    return (
        <div className="border rounded-xl shadow-lg overflow-hidden bg-primary-bg">
            {/* Cabecera */}
            <div className="bg-primary-bg px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary-text">Notas Pendientes</h2>
                <button
                    onClick={handleNoteModal}
                    className="bg-primary-bg hover:bg-primary-bg/80 text-primary-text px-4 py-2 rounded-md shadow-sm transition-all border border-slate-200 hover:shadow flex items-center gap-1"
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

            <AddNotesModal isOpen={isNoteModalOpen} onClose={closeNoteModal} projectUsers={projectUsers}/>

            {/* Contenido */}
            <div className="p-4 h-[320px] overflow-auto bg-primary-bg">
                {notes.length > 0 ? (
                    <div className="space-y-4">
                        {notes.map((nota, index) => {
                            const { barColor, label, badgeClass  } = getStatusInfo(nota.tag);
                            const assignedTo = nota.userWhoRecieves?.name || 'Usuario';
                            const assigneeInitial = getInitials(assignedTo).charAt(0);
                            const assigneeColor = getColorFromName(assignedTo);

                            return (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-lg border border-slate-200 bg-primary-bg shadow-sm transition-all hover:shadow"
                                >
                                    <div className={`absolute left-0 top-0 h-full w-1 ${barColor}`}></div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-primary-text">{nota.note || 'Nota sin título'}</h4>
                                            <span className={`text-xs px-3 py-1 rounded-full ${badgeClass}`}>
                                                {label}
                                            </span>
                                        </div>


                                        <p className="text-sm text-primary-text mb-4">
                                            {nota.userWhoWrites?.name ? `${nota.userWhoWrites.name}: ` : ''}
                                            Verificar cumplimiento con estándares de seguridad actuales
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => console.log('Marcar como completada', nota)}
                                                className={`text-xs px-3 py-1 rounded-md border transition-all ${nota.tag === "completada"
                                                    ? "bg-accent/10 text-accent border-accent/30"
                                                    : "bg-card hover:bg-card/80 text-secundary-text border border-slate-300"
                                                    }`}
                                            >
                                                {nota.tag === "completada" ? "✓ Completada" : "Marcar como completada"}
                                            </button>


                                            <div className="flex items-center gap-2 flex-wrap">
                                                {Array.isArray(nota.userWhoRecieves) && nota.userWhoRecieves.map((user, i) => {
                                                    const name = user.name || user.toString();
                                                    const initials = getInitials(user.name);
                                                    const color = getColorFromName(user.name);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-card text-primary-text border border-slate-300`}
                                                            title={user.email || ''}
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-white bg-opacity-30 text-xs flex items-center justify-center font-semibold">
                                                                {initials}
                                                            </div>
                                                            <span>{user.name} {user.surname}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-primary-text bg-primary-bg rounded-lg border border-slate-200 p-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4 opacity-30"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-lg font-medium">No existen notas pendientes</p>
                        <p className="text-sm mt-2 text-secundary-text">Haz clic en "Añadir" para crear una nueva nota</p>
                    </div>
                )}
            </div>
        </div>
    )
}