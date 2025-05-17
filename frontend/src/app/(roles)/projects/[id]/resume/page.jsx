// app/proyectos/[id]/page.jsx (o ResumenPage.jsx)
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import SpinLoader from "@/components/SpinLoader";
import {
  LuCalendarClock,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumenPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    if (!id) return;
    getProjectById(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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

  const {
    name,
    budget = {},
    reviewDates = [],
    startDate,
    endDate,
    tasks = [],
    pStatus,
  } = project;

  const now = new Date();
  const globalStart = new Date(startDate);
  const globalEnd = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;

  const milestones = [...reviewDates, endDate].map((d) => new Date(d));
  const completed = milestones.filter((d) => d <= now).length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones
    ? Math.round((completed / totalMilestones) * 100)
    : 0;
  const upcoming = milestones
    .filter((d) => d > now)
    .sort((a, b) => a.getTime() - b.getTime());
  const daysToNext = upcoming.length
    ? Math.ceil((upcoming[0].getTime() - now.getTime()) / msPerDay)
    : null;
  const daysToEnd = Math.ceil((globalEnd.getTime() - now.getTime()) / msPerDay);

  const profesores = budget.tutors?.subtotal ?? 0;
  const estudiantes = budget.interns?.subtotal ?? 0;
  const otros = (budget.extraExpenses ?? []).reduce(
    (sum, e) => sum + (e.subtotal || 0),
    0
  );
  const totalBudget = profesores + estudiantes + otros;

  const today = new Date();
  const viewDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  );
  const monthName = viewDate.toLocaleDateString("es-ES", { month: "long" });
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  // Variantes de animación
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="p-6 max-w-screen-2xl mx-auto space-y-6 bg-primary-bg"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          variants={sectionVariants}
        >
          <h1 className="text-3xl font-bold text-primary-text truncate">
            {name}
          </h1>
          <Badge className="bg-accent text-white rounded-full px-3 py-[6px]">
            {pStatus[0].status}
          </Badge>
        </motion.div>

        {/* Métricas */}
        <motion.div
          className="grid grid-cols-5 gap-4"
          variants={sectionVariants}
        >
          {[
            { label: "Progreso Total", value: `${progress}%` },
            { label: "Presupuesto", value: `€${totalBudget}` },
            {
              label: "Hitos Cumplidos",
              value: `${completed}/${totalMilestones}`,
            },
            {
              label: "Próxima Reunión",
              value: daysToNext != null ? `${daysToNext} días` : "—",
            },
            {
              label: "Tiempo Restante",
              value: daysToEnd >= 0 ? `${daysToEnd} días` : "—",
            },
          ].map((m, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="shadow-sm border border-card">
                <CardContent className="bg-primary-bg text-center py-6 space-y-1">
                  <p className="text-xl font-semibold text-primary-text">
                    {m.value}
                  </p>
                  <p className="text-xs text-secundary-text">{m.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Gráficos */}
        <motion.div
          className="grid grid-cols-2 gap-4 items-center"
          variants={sectionVariants}
        >
          {[
            {
              title: "Progreso del Proyecto",
              content: <DonutChart value={progress} />,
            },
            {
              title: "Presupuesto",
              content: (
                <div className="flex flex-col items-center">
                  <BudgetDonut
                    profesores={profesores}
                    estudiantes={estudiantes}
                    otros={otros}
                    total={totalBudget}
                  />
                  <div className="mt-4 flex space-x-4 text-xs text-secundary-text justify-center">
                    <LegendDot color="blue" text="Profesores" />
                    <LegendDot color="green" text="Estudiantes" />
                    <LegendDot color="yellow" text="Otros" />
                  </div>
                </div>
              ),
            },
          ].map((chart, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="shadow-sm border border-card h-full bg-primary-bg">
                <CardContent className="bg-primary-bg text-center py-6 space-y-2">
                  <p className="text-xl font-semibold text-primary-text">
                    {chart.title}
                  </p>
                  {chart.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Cronograma & Tareas + Calendario */}
        <motion.div
          className="grid grid-cols-2 gap-6 items-start"
          variants={sectionVariants}
        >
          {/* Cronograma y Tareas */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border border-card">
              <CardContent className="bg-primary-bg py-6 space-y-6">
                <p className="text-xl font-semibold text-primary-text text-center">
                  Cronograma & Tareas
                </p>
                <div className="space-y-4">
                  {[
                    ...reviewDates.map((d, i) => ({
                      label: `${i + 1}ª Revisión`,
                      date: new Date(d),
                    })),
                    { label: "Fin del proyecto", date: new Date(endDate) },
                  ].map((m, i) => {
                    const pct =
                      ((m.date.getTime() - globalStart.getTime()) /
                        (globalEnd.getTime() - globalStart.getTime())) *
                      100;
                    const done = now >= m.date;
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 min-h-6 w-full max-w-2xl"
                        variants={itemVariants}
                      >
                        <Badge
                          variant={done ? "outline" : "secondary"}
                          className="px-2 py-1 text-xs shrink-0 w-28 text-center mr-10"
                        >
                          {m.label}
                        </Badge>
                        <div className="relative flex-1 h-3 bg-card rounded-full">
                          <motion.div
                            className={`absolute top-0 left-0 h-3 rounded-full ${
                              done ? "bg-accent" : "bg-card"
                            }`}
                            style={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-24 text-right shrink-0">
                          {m.date.toLocaleDateString("es-ES")}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <div>
                  <h3 className="font-medium text-primary-text mb-2 text-center">
                    Tareas
                  </h3>
                  <motion.table
                    className="w-full text-left border-separate border-spacing-y-2"
                    variants={itemVariants}
                  >
                    <thead>
                      <tr className="text-secundary-text text-xs">
                        <th>Tarea</th>
                        <th>Responsable</th>
                        <th>Fecha Límite</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(tasks.length > 0
                        ? tasks
                        : Array.from({ length: 4 }).map((_, i) => ({
                            name: "Diseño de interfaz",
                            owner: "Ana García",
                            deadline: new Date(2025, 4, 10).toISOString(),
                            status: "En progreso",
                          }))
                      ).map((t, i) => (
                        <motion.tr
                          key={i}
                          className="bg-card hover:scale-105 transition"
                          variants={itemVariants}
                        >
                          <td className="px-3 py-2 text-secundary-text">
                            {t.name}
                          </td>
                          <td className="px-3 py-2 text-secundary-text">
                            {t.owner}
                          </td>
                          <td className="px-3 py-2 text-secundary-text">
                            {new Date(t.deadline).toLocaleDateString("es-ES")}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant={
                                t.status === "Completado"
                                  ? "outline"
                                  : "secondary"
                              }
                              className="px-2 py-1 text-xs"
                            >
                              {t.status}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </motion.table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendario */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border border-card">
              <CardContent className="bg-primary-bg py-6">
                <div className="flex items-center justify-between mb-4">
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
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-xs font-semibold text-secundary-text"
                      >
                        {d}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {(() => {
                    const cells = [];
                    for (let i = 0; i < offset; i++) cells.push(null);
                    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                    return cells.map((day, idx) => {
                      const dateObj = new Date(year, month, day || 0);
                      const dateStr = dateObj.toDateString();
                      const isReview = reviewDates.some(
                        (d) => new Date(d).toDateString() === dateStr
                      );
                      const isEnd =
                        new Date(endDate).toDateString() === dateStr;
                      const tooltipText = isReview
                        ? `${
                            reviewDates.findIndex(
                              (d) => new Date(d).toDateString() === dateStr
                            ) + 1
                          }ª revisión`
                        : isEnd
                        ? "Fin del proyecto"
                        : null;
                      const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                      return (
                        <motion.div
                          key={idx}
                          className={`group relative h-16 flex flex-col justify-between p-2 rounded-lg bg-card shadow-sm ${
                            isToday ? "ring-2 ring-accent" : ""
                          }`}
                          variants={itemVariants}
                        >
                          {day && (
                            <span className="text-sm font-medium text-primary-text">
                              {day}
                            </span>
                          )}
                          {isReview && (
                            <LuCalendarClock className="w-4 h-4 text-secundary-text self-center mb-1" />
                          )}
                          {isEnd && (
                            <LuCheck className="w-4 h-4 text-secundary-text self-center mb-1" />
                          )}
                          {tooltipText && (
                            <div className="invisible group-hover:visible absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-card text-primary-text ring-1 ring-accent text-xs px-2 py-1 rounded shadow-md">
                              {tooltipText}
                            </div>
                          )}
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}

function DonutChart({ value }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="text-card"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            className="text-accent"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary-text">
          {value}%
        </div>
      </div>
      {/* Espacio para igualar altura con la leyenda de BudgetDonut */}
      <div className="mt-4 flex space-x-4 text-xs text-secundary-text justify-center invisible">
        <LegendDot color="blue" text="Profesores" />
        <LegendDot color="green" text="Estudiantes" />
        <LegendDot color="yellow" text="Otros" />
      </div>
    </div>
  );
}

function BudgetDonut({ profesores, estudiantes, otros, total }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const safe = (n) => (isFinite(n) ? n : 0);
  if (total <= 0) {
    return (
      <div className="h-32 flex items-center justify-center text-secundary-text">
        <p className="text-sm">Sin presupuesto</p>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${safe(
              (profesores / total) * circumference
            )} ${circumference}`}
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#10b981"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${safe(
              (estudiantes / total) * circumference
            )} ${circumference}`}
            strokeDashoffset={`-${safe((profesores / total) * circumference)}`}
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#f59e0b"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${safe(
              (otros / total) * circumference
            )} ${circumference}`}
            strokeDashoffset={`-${safe(
              ((profesores + estudiantes) / total) * circumference
            )}`}
          />
        </svg>
      </div>
    </div>
  );
}

function LegendDot({ color, text }) {
  const bg =
    color === "blue"
      ? "bg-accent"
      : color === "green"
      ? "bg-secundary"
      : "bg-yellow-500";
  return (
    <span className="flex items-center space-x-1">
      <span className={`w-2.5 h-2.5 ${bg} rounded-full block`} />
      <span className="text-xs text-secundary-text">{text}</span>
    </span>
  );
}
