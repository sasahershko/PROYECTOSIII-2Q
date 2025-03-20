"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isAfter } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { getProjectById } from "@/lib/projects";

export default function ProjectCalendar({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <Card className="shadow-sm p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" /> Calendario del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Cargando datos del proyecto...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" /> Calendario del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!project) return null;

  const events = [
    { title: "Inicio del Proyecto", date: new Date(project.startDate), type: "start" },
    { title: "Fin del Proyecto", date: new Date(project.endDate), type: "end" },
    ...(project.reviewDates
      ? project.reviewDates.map((date) => ({
          title: "Fecha de Revisión",
          date: new Date(date),
          type: "review",
        }))
      : []),
  ].sort((a, b) => a.date - b.date);

  const eventsForSelectedDate = events.filter((event) => isSameDay(event.date, selectedDate));

  const upcomingEvents = events
    .filter((event) => isAfter(event.date, selectedDate))
    .slice(0, 3);

  return (
    <Card className="shadow-sm p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" /> Calendario del Proyecto
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col items-center w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ highlighted: events.map((e) => e.date) }}
            modifiersStyles={{ highlighted: { position: "relative", fontWeight: "bold" } }}
          />
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-3">Eventos del {format(selectedDate, "dd/MM/yyyy")}</h3>
          {eventsForSelectedDate.length > 0 ? (
            <ul className="space-y-3">
              {eventsForSelectedDate.map((event, index) => (
                <li key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Badge
                    variant={
                      event.type === "start"
                        ? "success"
                        : event.type === "end"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {event.title}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-2">No hay eventos para esta fecha.</p>
          )}
          {upcomingEvents.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-4 mb-2">Próximos eventos</h3>
              <ul className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {format(event.date, "dd/MM/yyyy")}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
