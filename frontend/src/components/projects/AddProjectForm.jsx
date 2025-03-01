"use client";

import { useState } from "react";

export default function AddProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    company: "U-TAD",
    area: "",
    responsibles: [],
    benefit: "",
    folder: "",
    pStatus: [{ status: "No iniciado", date: new Date(), notes: "" }],
    pendingNotes: [],
    description: "",
    practicesAgreement: false,
    practicesStudents: 0,
    sdpStudents: 0,
    startDate: "",
    reviewDates: [""],
    endDate: "",
    users: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Información Básica del Proyecto</h2>

      {/* Nombre */}
      <label className="block font-semibold">Nombre del Proyecto *</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required
        className="w-full border rounded p-2 mb-4" />

      {/* Descripción */}
      <label className="block font-semibold">Descripción *</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required
        className="w-full border rounded p-2 mb-4"></textarea>

      {/* Área y Estado Inicial */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Área *</label>
          <select name="area" value={formData.area} onChange={handleChange} required
            className="w-full border rounded p-2">
            <option value="">Seleccionar área</option>
            <option value="INSO">INSO</option>
            <option value="MAIS">MAIS</option>
            <option value="FIIS">FIIS</option>
            <option value="DIPI">DIPI</option>
            <option value="ANIV">ANIV</option>
            <option value="DIDI">DIDI</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Estado Inicial *</label>
          <select name="pStatus[0].status" value={formData.pStatus[0].status} onChange={handleChange} required
            className="w-full border rounded p-2">
            <option value="No iniciado">No iniciado</option>
            <option value="En proceso">En proceso</option>
            <option value="Completado">Completado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Fechas */}
      <h2 className="text-xl font-bold mt-6">Fechas Clave</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold">Fecha de Inicio *</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
            className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-semibold">Fecha de Revisión *</label>
          <input type="date" name="reviewDates[0]" value={formData.reviewDates[0]} onChange={handleChange} required
            className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-semibold">Fecha de Entrega *</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required
            className="w-full border rounded p-2" />
        </div>
      </div>

      {/* Participantes */}
      <h2 className="text-xl font-bold mt-6">Participantes</h2>
      <label className="block font-semibold">Responsable del Proyecto *</label>
      <input type="text" name="responsibles" value={formData.responsibles} onChange={handleChange}
        className="w-full border rounded p-2 mb-4" placeholder="ID del usuario" />

      {/* Cliente Externo */}
      <h2 className="text-xl font-bold mt-6">Cliente Externo</h2>
      <label className="block font-semibold">Nombre del Cliente</label>
      <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange}
        className="w-full border rounded p-2 mb-4" />

      {/* Documentación */}
      <h2 className="text-xl font-bold mt-6">Documentación</h2>
      <label className="block font-semibold">URL Carpeta Documentación *</label>
      <input type="text" name="folder" value={formData.folder} onChange={handleChange} required
        className="w-full border rounded p-2 mb-4" />

      {/* Presupuesto */}
      <h2 className="text-xl font-bold mt-6">Presupuesto</h2>
      <label className="block font-semibold">Presupuesto Estimado</label>
      <input type="number" name="benefit" value={formData.benefit} onChange={handleChange}
        className="w-full border rounded p-2 mb-4" />

      {/* Configuración de Convocatoria */}
      <h2 className="text-xl font-bold mt-6">Configuración de Convocatoria</h2>
      <label className="inline-flex items-center">
        <input type="checkbox" name="practicesAgreement" checked={formData.practicesAgreement} onChange={handleChange}
          className="mr-2" />
        ¿Es un Proyecto de Convocatoria?
      </label>

      {/* Notas Adicionales */}
      <h2 className="text-xl font-bold mt-6">Notas Adicionales</h2>
      <textarea name="pendingNotes[0].note" value={formData.pendingNotes[0]?.note || ""} onChange={handleChange}
        className="w-full border rounded p-2 mb-4" placeholder="Añade notas adicionales..." />

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Guardar Proyecto</button>
      </div>
    </form>
  );
}
