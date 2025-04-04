'use client';

import { useEffect, useState } from 'react';
import PresupuestoDashboard from '@/components/projects/areas/PresupuestoDashboard';
import PresupuestoForm from '@/components/projects/areas/PresupuestoForm';

export default function ProjectAreasPage() {
  const projectId = "67c4eec663b8a52d1b5b2217";

  const [presupuesto, setPresupuesto] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const cargarPresupuesto = async () => {
      try {
        const res = await fetch('/data/presupuestos.json');
        if (!res.ok) throw new Error('Error al cargar el JSON');

        const data = await res.json();
        const encontrado = data.find(p => p.projectId === projectId);
        if (encontrado) {
          setPresupuesto(encontrado);
        } else {
          console.warn("No se encontró presupuesto para este ID:", projectId);
        }
      } catch (error) {
        console.error("Error al cargar presupuesto:", error);
      }
    };

    if (projectId) {
      cargarPresupuesto();
    }
  }, [projectId]);

  const handleGuardar = (nuevoPresupuesto) => {
    setPresupuesto(nuevoPresupuesto);
    setMostrarFormulario(false);
    localStorage.setItem(`presupuesto_${projectId}`, JSON.stringify(nuevoPresupuesto));
  };

  return (
    <div className="max-w-8xl mx-auto px-6 py-10 space-y-6">
      {!presupuesto && !mostrarFormulario && (
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">Este proyecto no tiene presupuesto aún.</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Añadir Presupuesto
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <PresupuestoForm onSave={handleGuardar} />
      )}

      {presupuesto && !mostrarFormulario && (
        <>
          <PresupuestoDashboard data={presupuesto} />
        </>
      )}
    </div>
  );
}
