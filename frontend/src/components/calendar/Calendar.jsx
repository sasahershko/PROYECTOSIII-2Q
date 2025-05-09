"use client";

import { useState, useEffect } from "react";
import useProjects from "@/hooks/useProjects";
import SpinLoader from "@/components/SpinLoader";
import AddReviewDateModal from "@/components/projects/AddReviewDateModal";
import esLocale from '@fullcalendar/core/locales/es';
import EventModal from "@/components/projects/EventModal";
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

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);


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
            title: `${title} (Revisión ${i + 1})`,
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
    <div className="max-h-screen bg-primary-bg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        dayMaxRow={false} // asegura que no se apilen varios eventos
        fixedWeekCount={false} 
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

        dayCellClassNames={() => ["h-36", "overflow-hidden"]}

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
            top.style.height = "1rem";
            top.style.padding = "2px 4px";
          }

          const eventsCt = info.el.querySelector(".fc-daygrid-day-events");
          if (eventsCt) {
            eventsCt.style.marginTop = "1rem";
            eventsCt.style.paddingLeft = "0.25rem";
            eventsCt.style.paddingRight = "0.25rem";
          }
        }}

        dateClick={(info) => {
          setSelectedCellDate(info.date);
          setIsAddModalOpen(true);
        }}

        eventClick={(info) => {
          setSelectedEvent(info.event);
          setIsEventModalOpen(true);
        }}

      />

      <AddReviewDateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={null}         // ajusta según tu lógica
        existingDates={[]}       // ajusta según tu lógica
        initialDate={selectedCellDate}
        onSave={(newDate) => {
        }}
      />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
        />
      )}

    </div>
  );
}
