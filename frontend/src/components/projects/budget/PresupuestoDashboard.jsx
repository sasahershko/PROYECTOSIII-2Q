"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

export default function PresupuestoDashboard({ data, onEditClick }) {
  const {
    limite = 100000,
    gastado = 75290,
    comentarios = "",
    resumenMensual = [],
    desglose = {
      profesores: [],
      estudiantes: [],
      otros: [],
    },
    historialCambios = [],
  } = data;

  const diferencia = limite - gastado;
  const porcentajeUsado = (gastado / limite) * 100;
  const { profesores, estudiantes, otros } = data.desglose;

  const graficoPieData = [
    {
      name: "Profesores",
      value:
        desglose.profesores?.reduce((sum, item) => sum + item.subtotal, 0) || 0,
    },
    {
      name: "Estudiantes",
      value:
        desglose.estudiantes?.reduce((sum, item) => sum + item.subtotal, 0) ||
        0,
    },
    {
      name: "Otros",
      value: desglose.otros?.reduce((sum, item) => sum + item.subtotal, 0) || 0,
    },
  ];

  const generateResumenMensual = (profesores, estudiantes, otros) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    const total =
      (profesores?.subtotal || 0) +
      (estudiantes?.subtotal || 0) +
      (otros?.reduce((acc, gasto) => acc + (gasto.subtotal || 0), 0) || 0);

    return months.map((mes) => ({
      mes,
      estimado: Math.round(total / months.length),
      real: Math.round((total / months.length) * (0.9 + Math.random() * 0.2)), // +/-10% real
    }));
  };

  const seguimientoData = resumenMensual.length
    ? resumenMensual
    : generateResumenMensual(profesores[0], estudiantes[0], otros);

  const exportToPDF = async () => {
    const input = document.getElementById("presupuesto-desglose");
    const canvas = await html2canvas(input, {
      scale: 2, // mejora resolución
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("presupuesto.pdf");
  };

  const columnasUnificadas = [
    { key: "descripcion", label: "Descripción" },
    { key: "col2", label: "" },
    { key: "col3", label: "" },
    { key: "col4", label: "" },
    { key: "subtotal", label: "Subtotal" },
  ];

  const getColumnLabels = (tipo) => {
    switch (tipo) {
      case "profesores":
        return columnasUnificadas.map((col) => {
          if (col.key === "col2") return { ...col, label: "Número de Tutores" };
          if (col.key === "col3") return { ...col, label: "Horas Estimadas" };
          if (col.key === "col4") return { ...col, label: "Precio por Hora" };
          return col;
        });
      case "estudiantes":
        return columnasUnificadas.map((col) => {
          if (col.key === "col2")
            return { ...col, label: "Número de Estudiantes" };
          if (col.key === "col3") return { ...col, label: "Horas Estimadas" };
          if (col.key === "col4") return { ...col, label: "Precio por Hora" };
          return col;
        });
      case "otros":
        return columnasUnificadas.map((col) => {
          if (col.key === "col2") return { ...col, label: "" };
          if (col.key === "col3") return { ...col, label: "Cantidad" };
          if (col.key === "col4") return { ...col, label: "Precio por unidad" };
          return col;
        });
      default:
        return columnasUnificadas;
    }
  };

  const buildFilasConColumnas = (filas, tipo) => {
    return filas.map((fila) => {
      switch (tipo) {
        case "profesores":
          return {
            descripcion: fila.descripcion,
            col2: fila.numeroTutores,
            col3: fila.horasEstimadas,
            col4: fila.precioPorHora,
            subtotal: fila.subtotal,
          };
        case "estudiantes":
          return {
            descripcion: fila.descripcion,
            col2: fila.numeroEstudiantes,
            col3: fila.horasEstimadas,
            col4: fila.precioPorHora,
            subtotal: fila.subtotal,
          };
        case "otros":
          return {
            descripcion: fila.descripcion,
            col2: "",
            col3: fila.cantidad,
            col4: fila.precioUnidad,
            subtotal: fila.subtotal,
          };
        default:
          return fila;
      }
    });
  };

  function ResumenCard({ label, value }) {
    return (
      <div className="rounded-xl shadow-md border p-4 text-center">
        <p className="text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    );
  }

  const renderTabla = (titulo, columnas, filas) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-lg">{titulo}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 table-fixed">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[17.5%]" />
            <col className="w-[17.5%]" />
            <col className="w-[17.5%]" />
            <col className="w-[17.5%]" />
          </colgroup>
          <thead className="bg-gray-300">
            <tr>
              {columnas.map((col, i) => (
                <th
                  key={i}
                  className={`p-2 border-gray-200 font-semibold text-gray-800 ${
                    i === 0 ? "text-left" : "text-right pr-6"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i} className="border-t">
                {columnas.map((col, j) => (
                  <td
                    key={j}
                    className={`p-2 ${
                      j === 0 ? "text-left" : "text-right pr-8"
                    }`}
                  >
                    {fila[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-8xl mx-auto px-6 py-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Presupuesto del Proyecto</h1>
        <div className="space-x-2">
          <button
            onClick={onEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Editar Presupuesto
          </button>
          <button
            className="border px-4 py-2 rounded hover:bg-gray-200"
            onClick={exportToPDF}
          >
            Exportar Presupuesto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ResumenCard
          label="Presupuesto Total Límite"
          value={`${limite.toLocaleString()}€`}
        />
        <ResumenCard
          label="Presupuesto Total Gastado"
          value={`${gastado.toLocaleString()}€`}
        />
        <ResumenCard
          label="Diferencia"
          value={`${diferencia.toLocaleString()}€`}
        />
        <ResumenCard
          label="Porcentaje Utilizado"
          value={`${porcentajeUsado.toFixed(0)}%`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl shadow-md border p-4">
          <h2 className="text-lg font-bold mb-4">
            Distribución del Presupuesto
          </h2>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={graficoPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {graficoPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="text-blue-600">■ Profesores</span>
            <span className="text-green-600">■ Estudiantes</span>
            <span className="text-yellow-500">■ Otros</span>
          </div>
        </div>

        <div className="rounded-xl shadow-md border p-4">
          <h2 className="text-lg font-bold mb-8">Seguimiento Mensual</h2>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width="60%" height={280}>
              <LineChart data={seguimientoData}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="estimado"
                  stroke="#60a5fa"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section
        id="presupuesto-desglose"
        className="p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-semibold mb-4">Desglose de Presupuesto</h2>

        {desglose.profesores?.length > 0 &&
          renderTabla(
            "Profesores y Tutores",
            getColumnLabels("profesores"),
            buildFilasConColumnas(desglose.profesores, "profesores")
          )}

        {desglose.estudiantes?.length > 0 &&
          renderTabla(
            "Estudiantes en Prácticas",
            getColumnLabels("estudiantes"),
            buildFilasConColumnas(desglose.estudiantes, "estudiantes")
          )}

        {desglose.otros?.length > 0 &&
          renderTabla(
            "Otros",
            getColumnLabels("otros"),
            buildFilasConColumnas(desglose.otros, "otros")
          )}

        <p className="text-right font-bold text-2xl mt-4 mx-2">
          TOTAL: {gastado.toLocaleString()}€
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Comentarios</h2>
        <textarea
          value={comentarios}
          disabled
          placeholder="Añada notas o aclaraciones sobre el presupuesto..."
          className="w-full rounded-xl shadow-md border p-4 h-36"
        />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Historial de Cambios</h2>
        <div className="rounded-xl shadow-md border p-4 min-h-36">
          {historialCambios.map((cambio, i) => (
            <div key={i} className="flex items-start gap-3">
              <img
                src={cambio.avatar || "/avatar.png"}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {cambio.nombre} ·{" "}
                  <span className="text-sm text-gray-500">{cambio.fecha}</span>
                </p>
                <p className="text-sm text-gray-600">{cambio.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
