"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useProjects from "@/hooks/useProjects";
import SpinLoader from "@/components/SpinLoader";
import EventModal from "@/components/projects/EventModal";
import AddReviewDateModal from "@/components/projects/AddReviewDateModal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

export default function ProjectCalendar() {
  const { id } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find((p) => p._id === id);

  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estado para el modal de "añadir review"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCellDate, setSelectedCellDate] = useState(null);

  const areaColors = {
    INSO: "#1f77b4",
    MAIS: "#ff7f0e",
    FIIS: "#2ca02c",
    DIPI: "#d62728",
    ANIV: "#9467bd",
    DIDI: "#8c564b",
  };

  useEffect(() => {
    if (!loading && project) {
      const toDate = (d) => (d instanceof Date ? d : new Date(d));
      const color = areaColors[project.area] || "#000";
      const title = project.name;
      setEvents([
        { id: "start", title: `${title} ⇢ Inicio`, start: toDate(project.startDate), allDay: true, color },
        ...(project.reviewDates || []).map((d, i) => ({
          id: `rev-${i}`,
          title: `${title} ⇢ Review ${i + 1}`,
          start: toDate(d),
          allDay: true,
          color,
        })),
        { id: "end", title: `${title} ⇢ Fin`, start: toDate(project.endDate), allDay: true, color },
      ]);
    }
  }, [projects, loading, project]);

  if (loading) {
    return (
      <div className="pt-44 flex justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="p-8 text-center text-secundary-text">
        Proyecto no encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={esLocale}
        themeSystem="standard"
        initialView="dayGridMonth"

        // Toolbar con botón custom "Añadir"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "addReview",
        }}
        customButtons={{
          addReview: {
            text: "Añadir",
            click: () => {
              // Abrir modal de añadir review. 
              // Por defecto usamos hoy; cambiar si necesitas otro valor.
              setSelectedCellDate(new Date());
              setIsAddModalOpen(true);
            },
          },
        }}

        events={events}
        height="auto"
        eventDisplay="block"
        eventBorderColor="transparent"

        // 1) Celdas más altas y sin overflow
        dayCellClassNames={() => ["h-56", "overflow-hidden"]}

        // 2) Solo pintamos el número a la izquierda
        dayCellContent={(arg) => (
          <span className="text-sm text-secundary-text">
            {arg.dayNumberText}
          </span>
        )}

        // 3) Preparamos cabecera y empujamos eventos hacia abajo
        dayCellDidMount={(info) => {
          const top = info.el.querySelector(".fc-daygrid-day-top");
          if (top) {
            top.classList.add("relative", "w-full", "h-6", "p-1");
          }
          const eventsCt = info.el.querySelector(".fc-daygrid-day-events");
          if (eventsCt) {
            eventsCt.classList.add("mt-6", "px-1");
          }
        }}

        // 4) Click en cualquier parte vacía de la celda abre el modal
        dateClick={(info) => {
          setSelectedCellDate(info.date);
          setIsAddModalOpen(true);
        }}

        // 5) Click en evento abre tu EventModal
        eventClick={(info) => {
          setSelectedEvent(info.event);
          setIsEventModalOpen(true);
        }}
      />

      {/* Modal para ver/editar evento */}
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

      {/* Modal para añadir review date */}
      <AddReviewDateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={id}
        existingDates={project.reviewDates}
        initialDate={selectedCellDate}
        onSave={(newDate) => {
          const title = project.name;
          const color = areaColors[project.area];
          setEvents((prev) => [
            ...prev,
            { id: `rev-${prev.length}`, title: `${title} ⇢ Review`, start: newDate, allDay: true, color },
          ]);
        }}
      />
    </div>
  );
}
