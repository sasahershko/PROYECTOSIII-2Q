"use client";

import { useRouter } from "next/navigation";
import { createProject } from "@lib/projects";
import UserSelector from "@components/UserSelector";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ModifyProjectForm({ project }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: project?.name || "",
    contactPerson: project?.contactPerson || "",
    contactEmail: "", //!NO ESTÁ EN EL BACK
    contactPhone: "", //!NO ESTÁ EN EL BACK
    company: project?.company || "",
    area: project?.area || "",
    responsibles: project?.responsibles ? project.responsibles.map(responsible => responsible._id) : [],
    users: project?.users ? project.users.map(user => user._id) : [],
    benefit: project?.benefit || "",
    folder: project?.folder || "",
    confidentialFolder: project?.confidentialFolder || "", //!NO ESTÁ EN EL BACK
    budget: project?.budget || "",
    budgetDetails: project?.budgetDetails || "",
    convocatoriaName: project?.convocatoriaName || "",
    convocatoriaStart: project?.convocatoriaStart || "",
    convocatoriaEnd: project?.convocatoriaEnd || "",
    pStatus: [
      {
        status: "No iniciado",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
    ],
    pendingNotes: [],
    description: project?.description || "",
    practicesAgreement: false,
    practicesStudents: 0,
    sdpStudents: 0,
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : "",

    reviewDates: project?.reviewDates && project.reviewDates.length
      ? [new Date(project.reviewDates[0]).toISOString().split("T")[0]]
      : [""],

    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().split("T")[0]
      : "",
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

    try {
      console.log('Editando...')
      // router.push('/projects');
    } catch (error) {
      console.log('Error')
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary-bg to-card min-h-screen">
      <div className="bg-card border ml-6 w-20">
        <Link
          href={`/projects/${project._id}`}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <div className="text-center py-8 font-bold text-primary-text bg-card shadow-sm -mt-10">
        <span className="text-5xl  bg-clip-text text-transparent bg-gradient-to-r from-accent to-secundary-text">
          {project.name || "Nuevo Proyecto"}
        </span>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto bg-card p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Básica */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  1
                </span>
                Información Básica
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Nombre del Proyecto <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Descripción del Proyecto <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Área <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      className="appearance-none w-full bg-primary-bg text-primary-text py-3 px-4 pr-8 rounded-lg border border-secundary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                    >
                      <option value="">Seleccionar área</option>
                      <option value="INSO">INSO</option>
                      <option value="MAIS">MAIS</option>
                      <option value="FIIS">FIIS</option>
                      <option value="DIPI">DIPI</option>
                      <option value="ANIV">ANIV</option>
                      <option value="DIDI">DIDI</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secundary-text">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Estado Inicial <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="pStatus[0].status"
                      value={formData.pStatus[0].status}
                      onChange={handleChange}
                      required
                      className="appearance-none w-full bg-primary-bg text-primary-text py-3 px-4 pr-8 rounded-lg border border-secundary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                    >
                      <option value="No iniciado">No iniciado</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secundary-text">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas Clave */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  2
                </span>
                Fechas Clave
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Fecha de Inicio <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Fecha de Revisión <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    name="reviewDates[0]"
                    value={formData.reviewDates[0]}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Fecha de Entrega <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Participantes */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  3
                </span>
                Participantes
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-primary-bg rounded-lg">
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
                </div>

                <div className="p-4 bg-primary-bg rounded-lg">
                  <UserSelector
                    label="Usuarios"
                    selectedUsers={formData.users}
                    setSelectedUsers={(newUsers) =>
                      setFormData((prev) => ({ ...prev, users: newUsers }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Cliente Externo */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  4
                </span>
                Cliente Externo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Nombre del Cliente <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Documentación */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  5
                </span>
                Documentación
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    URL de la Carpeta de Documentación <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="folder"
                    value={formData.folder}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    URL de la Carpeta Confidencial <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="confidentialFolder"
                    value={formData.confidentialFolder}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>


            {/* Configuración de Convocatoria */}
            {/* <div className="border-b border-secundary-text pb-6">
                  <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                    <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                      7
                    </span>
                    Configuración de Convocatoria
                  </h2>
      
                  <div className="bg-primary-bg p-4 rounded-lg mb-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="practicesAgreement"
                        checked={formData.practicesAgreement}
                        onChange={handleChange}
                        className="w-5 h-5 text-accent border-secundary-text rounded focus:ring-accent"
                      />
                      <span className="ml-2 text-primary-text font-medium">
                        ¿Es un Proyecto de Convocatoria?
                      </span>
                    </label>
                  </div>
      
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-text">
                        Nombre de Convocatoria
                      </label>
                      <input
                        type="text"
                        name="convocatoriaName"
                        value={formData.convocatoriaName}
                        onChange={handleChange}
                        className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
      
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-text">
                        Fecha de Inicio de Convocatoria
                      </label>
                      <input
                        type="date"
                        name="convocatoriaStart"
                        value={formData.convocatoriaStart}
                        onChange={handleChange}
                        className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                      />
                    </div>
      
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-text">
                        Fecha de Fin de Convocatoria
                      </label>
                      <input
                        type="date"
                        name="convocatoriaEnd"
                        value={formData.convocatoriaEnd}
                        onChange={handleChange}
                        className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </div>
       */}

            {/* Notas Adicionales */}
            <div>
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  6
                </span>
                Notas Adicionales
              </h2>

              <textarea
                name="pendingNotes"
                value={formData.pendingNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Añade notas o comentarios adicionales sobre el proyecto..."
                className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/projects")}
                className="px-6 py-3 bg-card border border-secundary-text rounded-lg text-primary-text font-medium hover:bg-primary-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="hover:bg-accent/80 px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-sm hover:from-accent hover:to-secundary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-200 flex items-center justify-center"
              >
                <FaCheckCircle className="mr-2" />
                Guardar Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );


}
