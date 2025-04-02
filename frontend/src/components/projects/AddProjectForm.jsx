"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createProject } from '@lib/projects';
import UserSelector from '@components/UserSelector';

export default function AddProjectForm() {

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
    <div className="flex justify-center bg-gray-100 py-10">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">Información Básica del Proyecto</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Proyecto <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción del Proyecto <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"></textarea>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Área <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="area" value={formData.area} onChange={handleChange} required className="appearance-none w-full bg-[#F4F4F4] text-black py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <option value="">Seleccionar área</option>
                  <option value="INSO">INSO</option>
                  <option value="MAIS">MAIS</option>
                  <option value="FIIS">FIIS</option>
                  <option value="DIPI">DIPI</option>
                  <option value="ANIV">ANIV</option>
                  <option value="DIDI">DIDI</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado Inicial <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="pStatus[0].status" value={formData.pStatus[0].status} onChange={handleChange} required className="appearance-none w-full bg-[#F4F4F4] text-black py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <option value="No iniciado">No iniciado</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                </div>
              </div>
            </div>
          </div>


          <h2 className="text-xl font-bold mt-6">Fechas Clave</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Fecha de Inicio */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Inicio <span className="text-red-500">*</span></label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required placeholder="dd/mm/aaaa" className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>

            {/* Fecha de Revisión */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Revisión <span className="text-red-500">*</span></label>
              <input type="date" name="reviewDates[0]" value={formData.reviewDates[0]} onChange={handleChange} required placeholder="dd/mm/aaaa" className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>

            {/* Fecha de Entrega */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Entrega <span className="text-red-500">*</span></label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required placeholder="dd/mm/aaaa" className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>



          {/* Participantes */}
          <h2 className="text-xl font-bold mt-6">Participantes</h2>
          <UserSelector
            label='Responsables'
            selectedUsers={formData.responsibles}
            setSelectedUsers={(newResponsibles) => setFormData((prev) => ({ ...prev, responsibles: newResponsibles }))}
          />

          <UserSelector
            label='Usuarios'
            selectedUsers={formData.users}
            setSelectedUsers={(newUsers) => setFormData((prev) => ({ ...prev, users: newUsers }))}
          />

          <h2 className="text-xl font-bold">Cliente Externo</h2>
          <div className="grid grid-cols-1 gap-4">
            <div><label className="block text-sm font-medium mb-1">Nombre del Cliente <span className="text-red-500">*</span></label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" /></div>
            <div><label className="block text-sm font-medium mb-1">Correo Electrónico</label><input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" /></div>
            <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" /></div>
          </div>

          <h2 className="text-xl font-bold mt-6">Documentación</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                URL de la Carpeta de Documentación <span className="text-red-500">*</span>
              </label>
              <input type="text" name="folder" value={formData.folder} onChange={handleChange} required className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                URL de la Carpeta Confidencial <span className="text-red-500">*</span>
              </label>
              <input type="text" name="confidentialFolder" value={formData.confidentialFolder} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>



          <h2 className="text-xl font-bold mt-6">Presupuesto</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Presupuesto Estimado</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Detalles del Presupuesto</label>
              <textarea name="budgetDetails" value={formData.budgetDetails} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"></textarea>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-6">Configuración de Convocatoria</h2>
          <label className="inline-flex items-center mb-4">
            <input type="checkbox" name="practicesAgreement" checked={formData.practicesAgreement} onChange={handleChange} className="appearance-none w-5 h-5 border border-black rounded-sm checked:bg-black checked:border-black focus:outline-none focus:ring-2 focus:ring-gray-300" />
            <span className="ml-2">¿Es un Proyecto de Convocatoria?</span>
          </label>


          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de Convocatoria</label>
              <input type="text" name="convocatoriaName" value={formData.convocatoriaName} onChange={handleChange} className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Inicio de Convocatoria</label>
              <input type="date" name="convocatoriaStart" value={formData.convocatoriaStart} onChange={handleChange} placeholder="yyyy / mm / dd" className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Fin de Convocatoria</label>
              <input type="date" name="convocatoriaEnd" value={formData.convocatoriaEnd} onChange={handleChange} placeholder="yyyy / mm / dd" className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>

          <h2 className="text-xl font-bold mt-6">Archivos de la Convocatoria</h2>
          <label className="block text-sm font-medium mb-1">Archivos de la Convocatoria</label>
          <div className="w-full bg-white border border-black rounded-md p-10 flex flex-col items-center justify-center">
            {/* Ícono de ejemplo: un archivo */}
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p className="text-gray-500">Arrastra y suelta archivos aquí o selecciona archivos</p>
          </div>


          <h2 className="text-xl font-bold mt-6">Notas Adicionales</h2>
          <textarea name="pendingNotes" value={formData.pendingNotes} onChange={handleChange} placeholder="Añade notas o comentarios adicionales sobre el proyecto..." className="w-full bg-white border border-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"></textarea>

          <div className="flex justify-between mt-6">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => router.push('/')}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded">Guardar Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
}
