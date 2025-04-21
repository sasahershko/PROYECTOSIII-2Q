'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/projects";
import PresupuestoForm from "@/components/projects/budget/PresupuestoForm";
import SpinLoader from "@/components/SpinLoader";

export default function BudgetEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPresupuesto = async () => {
    try {
      const project = await getProjectById(id);
      setPresupuesto(project?.budget || null);
    } catch (err) {
      console.error("Error al cargar presupuesto:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    cargarPresupuesto();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-44 flex items-center justify-center">
        <SpinLoader size="49px" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <PresupuestoForm
        presupuestoInicial={presupuesto}
        onSuccess={() => router.push(`/projects/${id}/budget`)}
      />
    </div>
  );
}
