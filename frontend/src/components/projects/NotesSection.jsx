"use client";
import { useState } from "react";
import AddNotesModal from "@components/projects/AddNotesModal";
import EditNoteModal from "@components/projects/EditNoteModal";
import { updateNote } from "@lib/projects";

export default function NotesSection({ notes = [], projectUsers, projectId }) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("todas");
  const closeNoteModal = () => setIsNoteModalOpen(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const openEditModal = (nota, index) => {
    console.log(index);
    setNoteToEdit({ ...nota, index });
    setIsEditModalOpen(true);
  };

  const handleNoteModal = (e) => {
    e.stopPropagation();
    setIsNoteModalOpen(!isNoteModalOpen);
  };

  const handleNoteAdded = (newNote) => {
    setLocalNotes((prev) => [...prev, newNote]);
  };

  const handleNoteEdited = (updatedNote, index) => {
    setLocalNotes((prev) => {
      const updated = [...prev];
      if (updatedNote === null) {
        updated.splice(index, 1); // eliminar
      } else {
        updated[index] = updatedNote; // actualizar
      }
      return updated;
    });
  };

  const handleMarkAsCompleted = async (noteIndex) => {
    const currentTag = localNotes[noteIndex].tag;
    const newTag = currentTag === "completada" ? "no completada" : "completada";

    try {
      const updatedNote = { noteIndex, tag: newTag };
      await updateNote(updatedNote, projectId);

      setLocalNotes((prev) => {
        const updated = [...prev];
        updated[noteIndex] = { ...updated[noteIndex], tag: newTag };
        return updated;
      });

      console.log(`Nota actualizada a ${newTag}`, noteIndex);
    } catch (error) {
      console.error("Error al actualizar la nota:", error.message);
    }
  };

  const getColorFromName = (name) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
      "bg-cyan-100 text-cyan-600",
    ];
    const sum =
      name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[sum % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  const getStatusInfo = (tag) => {
    if (tag === "completada") {
      return {
        barColor: "bg-green-400",
        label: "Completada",
        badgeColor: "bg-green-50 text-green-700 border-green-200",
        isComplete: true,
      };
    }
    return {
      barColor: "bg-rose-400",
      label: "No completada",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      isComplete: false,
    };
  };

  const filteredNotes = localNotes.filter((nota) => {
    const { isComplete } = getStatusInfo(nota.tag);
    if (activeFilter === "todas") return true;
    if (activeFilter === "no completada") return !isComplete;
    if (activeFilter === "completada") return isComplete;
    return true;
  });

  return (
    <div className="border rounded-xl shadow-lg overflow-hidden bg-primary-bg">
      {/* Cabecera */}
      <div className="bg-primary-bg px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary-text">
          Notas Pendientes
        </h2>
        <button
          onClick={handleNoteModal}
          className="bg-primary-bg hover:bg-primary-bg/80 text-primary-text px-4 py-2 rounded-md shadow-sm transition-all border border-slate-200 hover:shadow flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Añadir
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-card px-6 py-2 border-t border-b flex items-center gap-2">
        <span className="text-sm text-secundary-text">Filtrar:</span>
        <div className="flex bg-primary-bg rounded-md border border-slate-200 p-0.5">
          {["todas", "no completada", "completada"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors ${
                activeFilter === filter
                  ? filter === "no completada"
                    ? "bg-rose-600 text-white"
                    : filter === "completada"
                    ? "bg-emerald-600 text-white"
                    : "bg-card text-secundary-text"
                  : "bg-primary-bg text-secundary-text hover:bg-card"
              }`}
            >
              {filter === "no completada" && (
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
              )}
              {filter === "completada" && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              )}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AddNotesModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        projectId={projectId}
        projectUsers={projectUsers}
        onNoteAdded={handleNoteAdded}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={projectId}
        projectUsers={projectUsers}
        noteToEdit={noteToEdit}
        onNoteEdited={handleNoteEdited}
      />

      {/* Contenido */}
      <div className="p-4 overflow-auto bg-primary-bg">
        {filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((nota, index) => {
              const originalIndex = localNotes.indexOf(nota);
              const { barColor, label, badgeColor } = getStatusInfo(nota.tag);
              const assigned = Array.isArray(nota.userWhoRecieves)
                ? nota.userWhoRecieves
                : [nota.userWhoRecieves];

              return (
                <div
                  key={index}
                  onClick={() => openEditModal(nota, originalIndex)}
                  className="relative overflow-hidden rounded-lg border border-slate-200 bg-primary-bg shadow-sm transition-all hover:shadow cursor-pointer"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${barColor}`}
                  ></div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-2 py-1 rounded-md mb-1">
                        {nota.userWhoWrites?.name || "Usuario desconocido"}{" "}
                        {nota.userWhoWrites?.surname || ""}
                      </h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${badgeColor}`}
                      >
                        {label}
                      </span>
                    </div>

                    <p className="text-sm text-primary-text mb-4">
                      <span className="font-semibold">
                        {nota.note || "Nota sin título"}
                      </span>
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsCompleted(originalIndex);
                        }}
                        className={`text-xs px-3 py-1 rounded-md border transition-all ${
                          nota.tag === "completada"
                            ? "bg-accent/10 text-accent border-accent/30"
                            : "bg-card hover:bg-card/80 text-secundary-text border border-slate-300"
                        }`}
                      >
                        {nota.tag === "completada"
                          ? "✓ Completada"
                          : "Marcar como completada"}
                      </button>

                      <div className="flex items-center gap-2 flex-wrap">
                        {assigned.map((user, i) => {
                          const name =
                            user?.name || user?.toString() || "Usuario";
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-card text-primary-text ${getColorFromName(
                                user.name
                              )} border border-slate-300`}
                              title={user.email || ""}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${getColorFromName(
                                  user.name
                                )}`}
                              >
                                {getInitials(user.name)}
                              </div>
                              <span>
                                {user.name} {user.surname}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
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
            <p className="text-lg font-medium">
              {activeFilter === "todas"
                ? "No existen notas"
                : activeFilter === "no completadas"
                ? "No hay notas no completadas"
                : "No hay notas completadas"}
            </p>
            <p className="text-sm mt-2 text-secundary-text">
              {activeFilter === "todas"
                ? 'Haz clic en "Añadir" para crear una nueva nota'
                : "Cambia el filtro o añade nuevas notas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
