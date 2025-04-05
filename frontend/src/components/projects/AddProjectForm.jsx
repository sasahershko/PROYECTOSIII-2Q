"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@lib/projects";
import UserSelector from "@components/UserSelector";
import { FaCheckCircle } from "react-icons/fa";


    //! AÑADIR COMPANY
export default function AddProjectForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    company: "U-TAD",
    area: "",
    responsibles: [],
    users: [],
    benefit: "",
    folder: "",
    confidentialFolder: "",
    budget: "",
    budgetDetails: "",
    convocatoriaName: "",
    convocatoriaStart: "",
    convocatoriaEnd: "",
    pStatus: [
      {
        status: "No iniciado",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
    ],
    pendingNotes: [],
    description: "",
    practicesAgreement: false,
    practicesStudents: 0,
    sdpStudents: 0,
    startDate: "",
    reviewDates: [""],
    endDate: "",
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
      router.push("/");
    } catch (error) {
      console.error("Error en la creación del proyecto:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center bg-card py-10">
      <div className="max-w-4xl w-full bg-primary-bg p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-text">
            Información Básica del Proyecto
          </h2>
  
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Nombre del Proyecto <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Descripción del Proyecto <span className="text-accent">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              ></textarea>
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Área <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="appearance-none w-full bg-card text-primary-text py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Seleccionar área</option>
                  <option value="INSO">INSO</option>
                  <option value="MAIS">MAIS</option>
                  <option value="FIIS">FIIS</option>
                  <option value="DIPI">DIPI</option>
                  <option value="ANIV">ANIV</option>
                  <option value="DIDI">DIDI</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-4 h-4 text-secundary-text"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Estado Inicial <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <select
                  name="pStatus[0].status"
                  value={formData.pStatus[0].status}
                  onChange={handleChange}
                  required
                  className="appearance-none w-full bg-card text-primary-text py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="No iniciado">No iniciado</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-4 h-4 text-secundary-text"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">Fechas Clave</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Fecha de Inicio */}
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Fecha de Inicio <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                placeholder="dd/mm/aaaa"
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
  
            {/* Fecha de Revisión */}
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Fecha de Revisión <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                name="reviewDates[0]"
                value={formData.reviewDates[0]}
                onChange={handleChange}
                required
                placeholder="dd/mm/aaaa"
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
  
            {/* Fecha de Entrega */}
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Fecha de Entrega <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                placeholder="dd/mm/aaaa"
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
  
          {/* Participantes */}
          <h2 className="text-xl font-bold mt-6 text-primary-text">Participantes</h2>
          <UserSelector
            label="Responsables"
            selectedUsers={formData.responsibles}
            setSelectedUsers={(newResponsibles) =>
              setFormData((prev) => ({
                ...prev,
                responsibles: newResponsibles,
              }))
            }
          />
  
          <UserSelector
            label="Usuarios"
            selectedUsers={formData.users}
            setSelectedUsers={(newUsers) =>
              setFormData((prev) => ({ ...prev, users: newUsers }))
            }
          />
  
          <h2 className="text-xl font-bold text-primary-text">Cliente Externo</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Nombre del Cliente <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">Teléfono</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">Documentación</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                URL de la Carpeta de Documentación <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="folder"
                value={formData.folder}
                onChange={handleChange}
                required
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                URL de la Carpeta Confidencial <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="confidentialFolder"
                value={formData.confidentialFolder}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">Presupuesto</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Presupuesto Estimado
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Detalles del Presupuesto
              </label>
              <textarea
                name="budgetDetails"
                value={formData.budgetDetails}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              ></textarea>
            </div>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">
            Configuración de Convocatoria
          </h2>
          <label className="inline-flex items-center mb-4 text-primary-text">
            <input
              type="checkbox"
              name="practicesAgreement"
              checked={formData.practicesAgreement}
              onChange={handleChange}
              className="appearance-none w-5 h-5 border border-secundary-text rounded-sm checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="ml-2">¿Es un Proyecto de Convocatoria?</span>
          </label>
  
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Nombre de Convocatoria
              </label>
              <input
                type="text"
                name="convocatoriaName"
                value={formData.convocatoriaName}
                onChange={handleChange}
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Fecha de Inicio de Convocatoria
              </label>
              <input
                type="date"
                name="convocatoriaStart"
                value={formData.convocatoriaStart}
                onChange={handleChange}
                placeholder="yyyy / mm / dd"
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary-text">
                Fecha de Fin de Convocatoria
              </label>
              <input
                type="date"
                name="convocatoriaEnd"
                value={formData.convocatoriaEnd}
                onChange={handleChange}
                placeholder="yyyy / mm / dd"
                className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">
            Archivos de la Convocatoria
          </h2>
          <label className="block text-sm font-medium mb-1 text-primary-text">
            Archivos de la Convocatoria
          </label>
          <div className="w-full bg-primary-bg border border-secundary-text rounded-md p-10 flex flex-col items-center justify-center">
            <svg
              className="w-8 h-8 text-secundary-text mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p className="text-secundary-text">
              Arrastra y suelta archivos aquí o selecciona archivos
            </p>
          </div>
  
          <h2 className="text-xl font-bold mt-6 text-primary-text">Notas Adicionales</h2>
          <textarea
            name="pendingNotes"
            value={formData.pendingNotes}
            onChange={handleChange}
            placeholder="Añade notas o comentarios adicionales sobre el proyecto..."
            className="w-full bg-primary-bg border border-secundary-text rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-accent"
          ></textarea>
  
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-secundary-text text-primary-bg rounded"
              onClick={() => router.push("/")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-primary-bg rounded flex items-center gap-2"
            >
              <FaCheckCircle className="text-primary-bg" /> Guardar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
