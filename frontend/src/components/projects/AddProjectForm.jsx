"use client";

import { useState } from "react";
import {useRouter} from 'next/navigation';
import {createProject} from '@lib/projects'

export default function AddProjectForm() {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   contactPerson: "",
  //   company: "U-TAD",
  //   area: "",
  //   responsibles: [],
  //   benefit: "",
  //   folder: "",
  //   pStatus: [{ status: "No iniciado", date: new Date(), notes: "" }],
  //   pendingNotes: [],
  //   description: "",
  //   practicesAgreement: false,
  //   practicesStudents: 0,
  //   sdpStudents: 0,
  //   startDate: "",
  //   reviewDates: [""],
  //   endDate: "",
  //   users: [],
  // });
  const [formData, setFormData] = useState({
    name: "",  
    contactPerson: "",  
    company: "U-TAD",  
    area: "",  
    responsibles: [],  
    users: [],  
    benefit: "",
    folder: "",
    pStatus: [{ status: "No iniciado", date: new Date().toISOString().split("T")[0], notes: "" }],  // Historial de estado del proyecto
    pendingNotes: [],
    description: "",  
    practicesAgreement: false,
    practicesStudents: 0,
    sdpStudents: 0,
    startDate: "", 
    reviewDates: [""],  
    endDate: "" 
  });
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prev) => {
      if (name === "pStatus[0].status") {
        return {
          ...prev,
          pStatus: [{ ...prev.pStatus[0], status: value }],
        };
      }
  
      if (name === "reviewDates[0]") {
        return {
          ...prev,
          reviewDates: [value], //reemplaza el primer valor del array
        };
      }
  
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };
  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.split(",").map((item) => item.trim()) : [],
    }));
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convertir responsables a un array si es un string
    if (!Array.isArray(formData.responsibles)) {
      formData.responsibles = [formData.responsibles];
    }
  
    console.log("Enviando responsables:", formData.responsibles);
  
    try {
      const newProject = await createProject(formData);
      console.log("Proyecto creado con éxito:", newProject);
      alert("Proyecto creado con éxito.");
    } catch (error) {
      console.error("Error en la creación del proyecto:", error.message);
      alert(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Información Básica del Proyecto</h2>
  
      {/* Nombre */}
      <label className="block font-semibold">Nombre del Proyecto *</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      {/* Descripción */}
      <label className="block font-semibold">Descripción *</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded p-2 mb-4"></textarea>
  
      {/* Empresa */}
      <label className="block font-semibold">Empresa *</label>
      <select name="company" value={formData.company} onChange={handleChange} required className="w-full border rounded p-2 mb-4">
        <option value="U-TAD">U-TAD</option>
        <option value="ILION">ILION</option>
        <option value="OTROS">OTROS</option>
      </select>
  
      {/* Área */}
      <label className="block font-semibold">Área *</label>
      <select name="area" value={formData.area} onChange={handleChange} required className="w-full border rounded p-2 mb-4">
        <option value="">Seleccionar área</option>
        <option value="INSO">INSO</option>
        <option value="MAIS">MAIS</option>
        <option value="FIIS">FIIS</option>
        <option value="DIPI">DIPI</option>
        <option value="ANIV">ANIV</option>
        <option value="DIDI">DIDI</option>
      </select>
  
      {/* Estado Inicial */}
      <label className="block font-semibold">Estado Inicial *</label>
      <select name="pStatus[0].status" value={formData.pStatus[0].status} onChange={handleChange} required className="w-full border rounded p-2 mb-4">
        <option value="No iniciado">No iniciado</option>
        <option value="En proceso">En proceso</option>
        <option value="Completado">Completado</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Cancelado">Cancelado</option>
      </select>
  
      {/* Fechas */}
      <h2 className="text-xl font-bold mt-6">Fechas Clave</h2>
      <label className="block font-semibold">Fecha de Inicio *</label>
      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      <label className="block font-semibold">Fecha de Revisión *</label>
      <input type="date" name="reviewDates[0]" value={formData.reviewDates[0]} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      <label className="block font-semibold">Fecha de Entrega *</label>
      <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      {/* Participantes */}
      <h2 className="text-xl font-bold mt-6">Participantes</h2>
      <label className="block font-semibold">Responsables (IDs separados por comas) *</label>
      <input type="text" name="responsibles" value={formData.responsibles.join(", ")} onChange={(e) => handleArrayChange(e, "responsibles")} required className="w-full border rounded p-2 mb-4" />
  
      <label className="block font-semibold">Usuarios (IDs separados por comas)</label>
      <input type="text" name="users" value={formData.users.join(", ")} onChange={(e) => handleArrayChange(e, "users")} className="w-full border rounded p-2 mb-4" />
  
      {/* Cliente Externo */}
      <h2 className="text-xl font-bold mt-6">Cliente Externo</h2>
      <label className="block font-semibold">Nombre del Cliente *</label>
      <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      {/* Documentación */}
      <h2 className="text-xl font-bold mt-6">Documentación</h2>
      <label className="block font-semibold">URL Carpeta Documentación *</label>
      <input type="text" name="folder" value={formData.folder} onChange={handleChange} required className="w-full border rounded p-2 mb-4" />
  
      {/* Configuración de Convocatoria */}
      <h2 className="text-xl font-bold mt-6">Configuración de Convocatoria</h2>
      <label className="inline-flex items-center">
        <input type="checkbox" name="practicesAgreement" checked={formData.practicesAgreement} onChange={handleChange} className="mr-2" />
        ¿Es un Proyecto de Convocatoria?
      </label>
  
      {/* Notas Adicionales */}
      <h2 className="text-xl font-bold mt-6">Notas Adicionales</h2>
      <textarea name="pendingNotes[0]" value={formData.pendingNotes[0]?.note || ""} onChange={handleChange} className="w-full border rounded p-2 mb-4" placeholder="Añade notas adicionales..."></textarea>
  
      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => router.push('/')}>Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Guardar Proyecto</button>
      </div>
    </form>
  );
  
  
}
