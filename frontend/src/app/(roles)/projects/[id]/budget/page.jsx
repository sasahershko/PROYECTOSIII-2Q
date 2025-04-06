"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/projects";
import PresupuestoDashboard from "@/components/projects/budget/PresupuestoDashboard";
import PresupuestoForm from "@/components/projects/budget/PresupuestoForm";
import SpinLoader from "@/components/SpinLoader";

export default function BudgetPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);

  const recargarProyecto = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      console.error("Error al recargar proyecto:", err.message);
    }
  };

  useEffect(() => {
    if (!id) return;
    recargarProyecto().finally(() => setLoading(false));
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
      <div className="p-10">
        <h2 className="text-2xl font-semibold text-red-500">Proyecto no encontrado</h2>
      </div>
    );
  }

  const presupuesto = project.budget;

  if (!presupuesto || modoEdicion) {
    return (
      <div className="px-6 py-10">
        <PresupuestoForm
          projectId={id}
          presupuestoInicial={modoEdicion ? presupuesto : null}
          onSuccess={() => {
            setModoEdicion(false);
            recargarProyecto();
          }}
        />
      </div>
    );
  }

  const { tutors, interns, extraExpenses = [], totalGeneral, generalComments } = presupuesto;

  const adaptedData = {
    limite: totalGeneral,
    gastado: totalGeneral,
    comentarios: generalComments,
    resumenMensual: [],
    desglose: {
      profesores: [{
        descripcion: "Tutores",
        numeroTutores: tutors?.numTutors || 0,
        horasEstimadas: tutors?.estimatedHours || 0,
        precioPorHora: tutors?.pricePerHour || 0,
        subtotal: tutors?.subtotal || 0
      }],
      estudiantes: [{
        descripcion: "Estudiantes en prácticas",
        numeroEstudiantes: interns?.numInterns || 0,
        horasEstimadas: interns?.estimatedHours || 0,
        precioPorHora: interns?.pricePerHour || 0,
        subtotal: interns?.subtotal || 0
      }],
      otros: extraExpenses.map(exp => ({
        descripcion: exp.description,
        cantidad: exp.quantity,
        precioUnidad: exp.unitPrice,
        subtotal: exp.subtotal
      }))
    },
    historialCambios: []
  };

  return (
    <div className="px-6 py-10">
      <PresupuestoDashboard
        data={adaptedData}
        onEditClick={() => setModoEdicion(true)}
      />
    </div>
  );
}
