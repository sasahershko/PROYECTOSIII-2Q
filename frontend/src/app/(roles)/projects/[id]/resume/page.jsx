// app/projects/[id]/resume/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import SpinLoader from "@/components/SpinLoader";

export default function ResumenPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del proyecto al montar el componente
  useEffect(() => {
    if (!id) return;
    getProjectById(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Mostrar loader mientras esperamos la respuesta
  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  // Si no se encuentra el proyecto, mensaje de error
  if (!project) {
    return (
      <div className="p-6">
        <p className="text-red-500">Proyecto no encontrado.</p>
      </div>
    );
  }

  // Desestructurar campos necesarios
  const {
    name,
    budget = {},
    reviewDates = [],
    startDate,
    endDate,
    tasks = [],
  } = project;

  // Convertir fechas a objetos Date para cálculos
  const globalStart = new Date(startDate);
  const globalEnd = new Date(endDate);
  const totalSpan = globalEnd - globalStart;

  // Cálculo de progreso de hitos
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const milestones = [...reviewDates, endDate].map((d) => new Date(d));
  const completed = milestones.filter((d) => d <= now).length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones
    ? Math.round((completed / totalMilestones) * 100)
    : 0;
  const upcoming = milestones.filter((d) => d > now).sort((a, b) => a - b);
  const daysToNext = upcoming.length
    ? Math.ceil((upcoming[0] - now) / msPerDay)
    : null;
  const daysToEnd = Math.ceil((globalEnd - now) / msPerDay);

  // Desglose de presupuesto
  const profesores = budget.tutors?.subtotal ?? 0;
  const estudiantes = budget.interns?.subtotal ?? 0;
  const otros = (budget.extraExpenses ?? []).reduce(
    (sum, e) => sum + (e.subtotal || 0),
    0
  );
  const total = profesores + estudiantes + otros;

  // Parámetros para los SVG circulares
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Encabezado con nombre y estado */}
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <span className="mt-1 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Activo
        </span>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Progreso Total", value: `${progress}%` },
          { label: "Presupuesto Acordado", value: `€${total}` },
          { label: "Hitos cumplidos", value: `${completed}/${totalMilestones}` },
          {
            label: "Próxima Reunión",
            value: daysToNext != null ? `${daysToNext} días` : "—",
          },
          {
            label: "Tiempo Restante",
            value: daysToEnd >= 0 ? `${daysToEnd} días` : "—",
          },
        ].map((m, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-xl font-semibold">{m.value}</p>
            <p className="text-sm text-gray-500">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficos de progreso y presupuesto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut de progreso */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Progreso del Proyecto</h2>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#0f766e"
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {progress}%
            </div>
          </div>
        </div>

        {/* Donut de presupuesto */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Distribución del Presupuesto
          </h2>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(profesores / total) * circumference || 0} ${circumference}`}
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#10b981"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(estudiantes / total) * circumference || 0} ${circumference}`}
                strokeDashoffset={`-${(profesores / total) * circumference || 0}`}
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#f59e0b"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(otros / total) * circumference || 0} ${circumference}`}
                strokeDashoffset={`-${((profesores + estudiantes) / total) * circumference || 0}`}
              />
            </svg>
            <div className="flex justify-center mt-4 space-x-4 text-sm">
              <LegendDot color="blue" text="Profesores" />
              <LegendDot color="green" text="Estudiantes" />
              <LegendDot color="yellow" text="Otros" />
            </div>
          </div>
        </div>
      </div>

      {/* Cronograma con meses y barras */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Cronograma</h2>

        {/* Burbujas de mes generadas dinámicamente */}
        {(() => {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const monthsCount =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth()) +
            1;
          const months = Array.from({ length: monthsCount }, (_, i) => {
            const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const offset = (i / (monthsCount - 1)) * 100;
            return {
              label: d.toLocaleString("es", { month: "short" }),
              offset,
            };
          });
          return (
            <div className="relative h-12 mb-6">
              {months.map(({ label, offset }) => (
                <div
                  key={label}
                  className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                  style={{ left: `${offset}%` }}
                >
                  <div className="w-8 h-8 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs">
                    {label}
                  </div>
                  <div className="w-px h-4 bg-gray-300 mt-1" />
                </div>
              ))}
            </div>
          );
        })()}

        {/* Filas de hitos */}
        <div className="space-y-6">
          <TimelineRow
            icon={<CalendarIcon />}
            label="Inicio/Fin"
            widthPct={progress}
            pctLabel={`${progress}%`}
            endDate={globalEnd}
          />
          {reviewDates.map((d, i) => {
            const date = new Date(d);
            const pos = ((date - globalStart) / totalSpan) * 100;
            const done = now >= date;
            return (
              <TimelineRow
                key={i}
                icon={<RevisionDot number={i + 1} />}
                label={`${i + 1}ª Revisión`}
                widthPct={done ? pos : 0}
                pctLabel={done ? `${Math.round(((i + 1) / totalMilestones) * 100)}%` : ""}
                endDate={date}
              />
            );
          })}
        </div>
      </div>

      {/* Tabla de tareas con estilo de "píldora" */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tareas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                {["Tarea", "Responsable", "Fecha Límite", "Estado"].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left font-semibold text-gray-800 border-b"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tasks.length > 0 ? tasks : Array.from({ length: 4 }).map((_, i) => ({
                name: "Diseño de interfaz",
                owner: "Ana García",
                deadline: new Date(2025, 4, 10).toISOString(),
                status: "En progreso"
              }))).map((t, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                      {t.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                      {t.owner}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                      {new Date(t.deadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-200 text-indigo-900 px-4 py-2 rounded-full font-medium">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendario dinámico del mes actual */}
      {(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDow = new Date(year, month, 1).getDay();
        const offset = firstDow === 0 ? 6 : firstDow - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weeks = [];
        let week = Array(offset).fill(null);

        for (let day = 1; day <= daysInMonth; day++) {
          week.push(day);
          if (week.length === 7) {
            weeks.push(week);
            week = [];
          }
        }
        if (week.length) {
          while (week.length < 7) week.push(null);
          weeks.push(week);
        }

        return (
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h2 className="text-center text-xl font-semibold mb-4">
              {today
                .toLocaleString("es", { month: "long" })
                .replace(/^./, (c) => c.toUpperCase())}
            </h2>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <div
                  key={d}
                  className="bg-pink-300 text-black rounded-full py-1 text-center text-sm font-medium"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeks.map((w, wi) =>
                w.map((day, di) => {
                  if (day === null) {
                    return <div key={`${wi}-${di}`} className="h-16 bg-white rounded-lg" />;
                  }
                  const dateObj = new Date(year, month, day);
                  const isReview = reviewDates.some(
                    (rd) => new Date(rd).toDateString() === dateObj.toDateString()
                  );
                  const isEnd =
                    new Date(endDate).toDateString() === dateObj.toDateString();

                  return (
                    <div
                      key={`${wi}-${di}`}
                      className="relative h-16 bg-white rounded-lg p-2"
                    >
                      <span className="text-pink-300 font-semibold">{day}</span>
                      {isReview && (
                        <span className="absolute bottom-2 left-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                          {`${reviewDates.indexOf(
                            reviewDates.find(
                              (rd) =>
                                new Date(rd).toDateString() ===
                                dateObj.toDateString()
                            )
                          ) +
                            1}ª revisión`}
                        </span>
                      )}
                      {isEnd && (
                        <span className="absolute bottom-2 right-2 text-xs bg-green-100 text-green-800 px-1 rounded">
                          Fin
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Componentes auxiliares para iconos y filas de timeline

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function RevisionDot({ number }) {
  return (
    <div className="w-6 h-6 bg-blue-300 text-white rounded-full flex items-center justify-center text-xs">
      {number}º
    </div>
  );
}

function TimelineRow({ icon, label, widthPct, pctLabel, endDate }) {
  return (
    <div className="flex items-center">
      <div className="bg-white flex items-center space-x-2 px-3 py-2 rounded-full shadow">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="relative flex-1 h-4 bg-blue-100 rounded-full ml-6">
        <div
          className="absolute h-4 bg-blue-400 rounded-full"
          style={{ width: `${widthPct}%` }}
        />
        <span className="absolute -top-6 right-0 text-xs">
          {endDate.toLocaleDateString()}
        </span>
        {pctLabel && (
          <span
            className="absolute -top-4"
            style={{ left: `${widthPct}%`, transform: "translateX(-50%)" }}
          >
            <span className="bg-blue-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {pctLabel}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, text }) {
  const bg =
    color === "blue"
      ? "bg-blue-500"
      : color === "green"
      ? "bg-green-500"
      : "bg-yellow-500";
  return (
    <span className="flex items-center space-x-1">
      <span className={`w-3 h-3 ${bg} rounded-full block`} />
      <span>{text}</span>
    </span>
  );
}
