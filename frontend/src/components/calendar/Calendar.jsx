"use client";

import { useState, useEffect } from "react";
import useProjects from "@/hooks/useProjects";
import SpinLoader from "@/components/SpinLoader";
import AddReviewDateModal from "@/components/projects/AddReviewDateModal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function ProjectCalendar() {
  const { projects, loading } = useProjects();
  const [events, setEvents] = useState([]);

  // estado para el modal de añadir review
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
    if (!loading) {
      const evts = projects.flatMap((p) => {
        const color = areaColors[p.area] || "#000";
        const title = p.name;
        return [
          { title: `${title} (Inicio)`, start: p.startDate, allDay: true, color },
          ...(p.reviewDates || []).map((d, i) => ({
            title: `${title} (Review ${i + 1})`,
            start: d,
            allDay: true,
            color,
          })),
          { title: `${title} (Fin)`, start: p.endDate, allDay: true, color },
        ];
      });
      setEvents(evts);
    }
  }, [projects, loading]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "addReview",       // nuestro botón custom
        }}
        customButtons={{
          addReview: {
            text: "Añadir",         // el texto que queremos
            click: () => {
              // al hacer click abrimos el modal
              setSelectedCellDate(new Date());
              setIsAddModalOpen(true);
            },
          },
        }}
        events={events}
        height="auto"

        // 1) Celdas más altas y sin overflow
        dayCellClassNames={() => ["h-56", "overflow-hidden"]}

        // 2) Solo pintamos el número del día a la izquierda
        dayCellContent={(arg) => (
          <span className="text-sm text-secundary-text">
            {arg.dayNumberText}
          </span>
        )}

        // 3) Preparo cabecera y empujo eventos
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

        // 4) Click en cualquier parte vacía de la celda → abrir modal
        dateClick={(info) => {
          setSelectedCellDate(info.date);
          setIsAddModalOpen(true);
        }}

        // 5) Click en evento → aquí podrías abrir tu EventModal
        eventClick={(info) => {
          console.log("Evento clickado:", info.event);
        }}
      />

      <AddReviewDateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={null}         // ajusta según tu lógica
        existingDates={[]}       // ajusta según tu lógica
        initialDate={selectedCellDate}
        onSave={(newDate) => {
          // lógica para guardar el nuevo review
        }}
      />
    </div>
  );
}
