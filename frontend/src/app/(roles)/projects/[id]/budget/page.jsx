"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/projects";
import PresupuestoDashboard from "@/components/projects/budget/PresupuestoDashboard";
import SpinLoader from "@/components/SpinLoader";

export default function BudgetDashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (!presupuesto) {
    // Si no hay presupuesto aún, redirigir a crear uno
    router.push(`/projects/${id}/budget/edit`);
    return null;
  }

  const { tutors, interns, extraExpenses = [], totalGeneral, generalComments } = presupuesto;

  const adaptedData = {
    limite: totalGeneral,
    gastado: totalGeneral,
    comentarios: generalComments,
    resumenMensual: [],
    startDate: project.startDate,
    endDate: project.endDate,
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
        onEditClick={() => router.push(`/projects/${id}/budget/edit`)}
      />
    </div>
  );
}
