"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function ProjectCalendarGrid() {
  const { id } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find((p) => p._id === id);

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCellDate, setSelectedCellDate] = useState(null);

  // Calendar navigation
  const [monthOffset, setMonthOffset] = useState(0);

  // Prepare dates
  const [reviewDates, setReviewDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [areaColor, setAreaColor] = useState("#000");
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
      const sorted = (project.reviewDates || [])
        .slice()
        .sort((a, b) => new Date(a) - new Date(b));
      setReviewDates(sorted);
      setStartDate(new Date(project.startDate));
      setEndDate(new Date(project.endDate));
      setAreaColor(areaColors[project.area] || "#000");
    }
  }, [loading, project]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="p-6">
        <p className="text-red-500">Proyecto no encontrado.</p>
      </div>
    );
  }

  // Calendar math
  const today = new Date();
  const viewDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const monthName = viewDate.toLocaleDateString("es-ES", { month: "long" });

  // Handlers
  const handleCellClick = (day) => {
    setSelectedCellDate(new Date(year, month, day));
    setIsAddModalOpen(true);
  };
  const handleIconClick = (type, date) => {
    setSelectedEvent({ type, date, title: project.name });
    setIsEventModalOpen(true);
  };
  const openAddModal = () => {
    setSelectedCellDate(new Date());
    setIsAddModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary-text truncate">
        {project.name}
      </h1>
      <div className="mx-auto mt-6 p-4 bg-card shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setMonthOffset(monthOffset - 1)}>
              <LuChevronLeft className="w-5 h-5 text-secundary-text hover:text-primary-text transition" />
            </button>
            <p className="text-xl font-semibold text-primary-text capitalize">
              {monthName} {year}
            </p>
            <button onClick={() => setMonthOffset(monthOffset + 1)}>
              <LuChevronRight className="w-5 h-5 text-secundary-text hover:text-primary-text transition" />
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="px-3 py-1 bg-accent text-white rounded-md hover:bg-accent-dark transition"
          >
            Añadir revisión
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className="text-xs font-semibold text-secundary-text">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {(() => {
            const cells = [];
            for (let i = 0; i < offset; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(d);
            return cells.map((day, idx) => {
              const dateObj = day ? new Date(year, month, day) : null;
              const dateStr = dateObj?.toDateString();
              const isReview = reviewDates.some(
                (d) => new Date(d).toDateString() === dateStr
              );
              const reviewIndex = isReview
                ? reviewDates.findIndex(
                    (d) => new Date(d).toDateString() === dateStr
                  )
                : -1;
              const isEnd = dateStr === endDate?.toDateString();
              const isStart = dateStr === startDate?.toDateString();
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <motion.div
                  key={idx}
                  className={`group relative aspect-[13/8] flex flex-col justify-between p-2 rounded-lg bg-primary-bg shadow-sm transition-transform hover:scale-105 cursor-pointer ${
                    isToday ? "ring-2 ring-accent" : ""
                  }`}
                  onClick={() => day && handleCellClick(day)}
                >
                  {day && (
                    <span className="text-sm font-medium text-primary-text">
                      {day}
                    </span>
                  )}

                  {/* Event icons */}
                  {[
                    isStart && {
                      icon: LuFastForward,
                      type: "start",
                      label: "Inicio del proyecto",
                    },
                    isReview && {
                      icon: LuCalendarClock,
                      type: "review",
                      label: `${reviewIndex + 1}ª revisión`,
                    },
                    isEnd && {
                      icon: LuCheck,
                      type: "end",
                      label: "Fin del proyecto",
                    },
                  ]
                    .filter(Boolean)
                    .map(({ icon: Icon, type, label }, i) => (
                      <div
                        key={i}
                        className="mx-auto mb-1 flex items-center justify-center w-7 h-7 rounded-md shadow-lg"
                        style={{ backgroundColor: areaColor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIconClick(type, dateObj);
                        }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    ))}

                  {/* Tooltip */}
                  {(isStart || isReview || isEnd) && (
                    <div className="absolute top-5 mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-primary-text text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {isStart
                        ? "Inicio del proyecto"
                        : isReview
                        ? `${reviewIndex + 1}ª revisión`
                        : "Fin del proyecto"}
                    </div>
                  )}
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
        isOpen={isAddModalOpen}
        projectId={id}
        existingDates={reviewDates}
        initialDate={selectedCellDate}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newDate) =>
          setReviewDates((prev) => [...prev, newDate.toISOString()])
        }
      />
    </div>
  );
}
