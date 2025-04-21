"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@lib/projects";
import UserSelector from "@components/UserSelector";
import { FaCheckCircle } from "react-icons/fa";
import { ArrowLeft } from 'lucide-react';
import SuccessToast from "@components/SuccessToast"

export default function AddProjectForm() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false)


  const [formData, setFormData] = useState({
    name: "",
    contactPerson: {
      name: "",
      email: "",
      phone: ""
    },
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
    pendingNotes: "",
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

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
      return;
    }

    if (name === "pStatus[0].status") {
      return setFormData((prev) => ({
        ...prev,
        pStatus: [{ ...prev.pStatus[0], status: value }],
      }));
    }

    if (name === "reviewDates[0]") {
      return setFormData((prev) => ({
        ...prev,
        reviewDates: [value],
      }));
    }

    // Por defecto
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (!Array.isArray(formData.responsibles)) {
      formData.responsibles = [formData.responsibles];
    }

    try {
      const newProject = await createProject(formData);
      setShowToast(true)
      setTimeout(() => {
        router.push("/projects")
      }, 2000)

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary-bg to-card min-h-screen">
      <SuccessToast isOpen={showToast} message="Proyecto creado con éxito" />


      <div className="bg-card border ml-6 w-20 mt-4">
        <Link href="/projects">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      {/* Título */}
      <div className="text-center py-8 font-bold text-primary-text bg-card shadow-sm -mt-10">
        <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
          Nuevo Proyecto
        </span>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto bg-card p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección 1: Información Básica */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  1
                </span>
                Información Básica del Proyecto
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
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Descripción del Proyecto{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  ></textarea>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
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
                      className="appearance-none w-full bg-primary-bg text-primary-text py-3 px-4 pr-8 rounded-lg border border-secundary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                    >
                      <option value="">Seleccionar área</option>
                      <option value="INSO">INSO</option>
                      <option value="MAIS">MAIS</option>
                      <option value="FIIS">FIIS</option>
                      <option value="DIPI">DIPI</option>
                      <option value="ANIV">ANIV</option>
                      <option value="DIDI">DIDI</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-secundary-text">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 9l6 6 6-6"
                        ></path>
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
                      className="appearance-none w-full bg-primary-bg text-primary-text py-3 px-4 pr-8 rounded-lg border border-secundary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                    >
                      <option value="No iniciado">No iniciado</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-secundary-text">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 9l6 6 6-6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Fechas Clave */}
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
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
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
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
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
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Participantes */}
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

            {/* Sección 4: Cliente Externo */}
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
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="contactPerson.email"
                    value={formData.contactPerson.email}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={formData.contactPerson.phone}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Sección 5: Documentación */}
            <div className="border-b border-secundary-text pb-6">
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  5
                </span>
                Documentación
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    URL de la Carpeta de Documentación{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="folder"
                    value={formData.folder}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-text">
                    URL de la Carpeta Confidencial{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="confidentialFolder"
                    value={formData.confidentialFolder}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Sección 6: Notas Adicionales */}
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
                className="w-full bg-primary-bg border border-secundary-text rounded-lg p-3 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
              ></textarea>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <button
                type="button"
                className="px-6 py-3 bg-card border border-secundary-text rounded-lg text-primary-text font-medium hover:bg-primary-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-200"
                onClick={() => router.push("/")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-sm hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-200"
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
