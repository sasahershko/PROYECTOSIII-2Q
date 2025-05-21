"use client";

import React, { useState, useMemo } from "react";
import useProjects from "@/hooks/useProjects";
import SpinLoader from "@/components/SpinLoader";
import EventModal from "@/components/projects/EventModal";
import AddReviewDateModal from "@/components/projects/AddReviewDateModal";
import {
  LuCalendarClock,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuFastForward,
} from "react-icons/lu";
import { motion } from "framer-motion";

export default function ProjectCalendar() {
  const { projects, loading } = useProjects();

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCellDate, setSelectedCellDate] = useState(null);

  // Calendar navigation
  const [monthOffset, setMonthOffset] = useState(0);

  // Area colors
  const areaColors = {
    INSO: "#1f77b4",
    MAIS: "#ff7f0e",
    FIIS: "#2ca02c",
    DIPI: "#d62728",
    ANIV: "#9467bd",
    DIDI: "#8c564b",
  };

  // Build flat list of events
  const events = useMemo(() => {
    if (loading) return [];
    return projects.flatMap((p) => {
      const base = {
        title: p.name,
        color: areaColors[p.area] || "#000",
        projectId: p._id,
      };
      const evts = [];
      evts.push({ ...base, type: "start", date: new Date(p.startDate) });
      (p.reviewDates || []).forEach((d, i) => {
        evts.push({
          ...base,
          type: "review",
          date: new Date(d),
          reviewIndex: i,
        });
      });
      evts.push({ ...base, type: "end", date: new Date(p.endDate) });
      return evts;
    });
  }, [projects, loading]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const key = e.date.toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  // Current view month
  const today = new Date();
  const view = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const monthName = view.toLocaleDateString("es-ES", { month: "long" });

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary-text truncate">
        Calendario General de Proyectos
      </h1>

      <div className="mx-auto mt-6 p-4 bg-card shadow-md rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonthOffset(monthOffset - 1)}>
            <LuChevronLeft className="w-6 h-6 text-secundary-text hover:text-primary-text transition" />
          </button>
          <p className="text-xl font-semibold text-primary-text capitalize">
            {monthName} {year}
          </p>
          <button onClick={() => setMonthOffset(monthOffset + 1)}>
            <LuChevronRight className="w-6 h-6 text-secundary-text hover:text-primary-text transition" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className="text-xs font-semibold text-secundary-text">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {(() => {
            const cells = [];
            for (let i = 0; i < offset; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(d);
            return cells.map((day, idx) => {
              const dateObj = day ? new Date(year, month, day) : null;
              const dateKey = dateObj?.toDateString();
              const cellEvents = dateKey ? eventsByDate[dateKey] || [] : [];
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <motion.div
                  key={idx}
                  className={`group relative overflow-visible aspect-[13/8] flex flex-col justify-start p-2 rounded-lg bg-primary-bg shadow-sm transition-transform ${
                    isToday ? "ring-2 ring-accent" : ""
                  }`}
                >
                  {day && (
                    <span className="text-sm font-medium text-primary-text">
                      {day}
                    </span>
                  )}

                  {/* Event list: ocultar scroll hasta hover */}
                  <div className="mt-1 flex flex-col space-y-1 overflow-hidden max-h-28 group-hover:overflow-visible">
                    {cellEvents.map((evt, i) => {
                      let Icon;
                      if (evt.type === "start") Icon = LuFastForward;
                      else if (evt.type === "review") Icon = LuCalendarClock;
                      else if (evt.type === "end") Icon = LuCheck;

                      return (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.08 }}
                          className="relative z-10 flex items-center space-x-1 px-1 py-0.5 rounded-md shadow-sm cursor-pointer overflow-hidden"
                          style={{ backgroundColor: evt.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent({
                              ...evt,
                              date: evt.date,
                              title: evt.title,
                            });
                            setIsEventModalOpen(true);
                          }}
                          title={evt.title}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 text-white" />
                          <span className="text-xs text-white truncate">
                            {evt.title}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            });
          })()}
        </div>
      </div>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
      <AddReviewDateModal
        date={selectedCellDate}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
