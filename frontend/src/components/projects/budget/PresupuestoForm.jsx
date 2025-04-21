'use client';

import { useState } from 'react';
import { updateProjectBudget } from '@/lib/projects';
import { FaCheckCircle, FaTrash, FaPlus } from 'react-icons/fa';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PresupuestoForm({ presupuestoInicial = null, onSuccess }) {
  const [titulo, setTitulo] = useState(presupuestoInicial?.title || '');
  const [motivo, setMotivo] = useState(presupuestoInicial?.reason || '');
  const [comentarios, setComentarios] = useState(presupuestoInicial?.generalComments || '');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceAEliminar, setIndiceAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const { id: projectId } = useParams();
  const router = useRouter();

  const [tutores, setTutores] = useState({
    cantidad: presupuestoInicial?.tutors?.numTutors || 0,
    horas: presupuestoInicial?.tutors?.estimatedHours || 0,
    precio: presupuestoInicial?.tutors?.pricePerHour || 0,
  });

  const [estudiantes, setEstudiantes] = useState({
    cantidad: presupuestoInicial?.interns?.numInterns || 0,
    horas: presupuestoInicial?.interns?.estimatedHours || 0,
    precio: presupuestoInicial?.interns?.pricePerHour || 0,
  });

  const [otrosGastos, setOtrosGastos] = useState(
    presupuestoInicial?.extraExpenses?.map(g => ({
      descripcion: g.description || '',
      cantidad: g.quantity || 0,
      precio: g.unitPrice || 0,
    })) || []
  );
  
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', cantidad: 0, precio: 0 });

  const agregarGasto = () => {
    if (
      !nuevoGasto.descripcion.trim() ||
      nuevoGasto.cantidad <= 0 ||
      nuevoGasto.precio <= 0
    ) {
      return;
    }
    setOtrosGastos([...otrosGastos, nuevoGasto]);
    setNuevoGasto({ descripcion: '', cantidad: 0, precio: 0 });
  };

  const eliminarGasto = async () => {
    if (indiceAEliminar === null) return;
  
    const nuevosGastos = otrosGastos.filter((_, i) => i !== indiceAEliminar);
  
    const presupuesto = {
      title: titulo,
      reason: motivo,
      generalComments: comentarios,
      tutors: {
        numTutors: tutores.cantidad,
        estimatedHours: tutores.horas,
        pricePerHour: tutores.precio,
      },
      interns: {
        numInterns: estudiantes.cantidad,
        estimatedHours: estudiantes.horas,
        pricePerHour: estudiantes.precio,
      },
      extraExpenses: nuevosGastos
        .filter(g => g.descripcion && g.cantidad > 0 && g.precio > 0)
        .map(g => ({
          description: g.descripcion,
          quantity: g.cantidad,
          unitPrice: g.precio,
        })),
    };
  
    try {
      setEliminando(true);
      await updateProjectBudget(projectId, { budget: presupuesto });
      setOtrosGastos(nuevosGastos);
      setModalAbierto(false);
      setIndiceAEliminar(null);
    } catch (err) {
      alert("Error al eliminar el gasto: " + err.message);
    } finally {
      setEliminando(false);
    }
  };      

  const handleGuardar = async () => {
    const presupuesto = {
      title: titulo,
      reason: motivo,
      generalComments: comentarios,
      tutors: {
        numTutors: tutores.cantidad,
        estimatedHours: tutores.horas,
        pricePerHour: tutores.precio,
      },
      interns: {
        numInterns: estudiantes.cantidad,
        estimatedHours: estudiantes.horas,
        pricePerHour: estudiantes.precio,
      },
      extraExpenses: otrosGastos
        .filter(g => g.descripcion && g.cantidad > 0 && g.precio > 0)
        .map(g => ({
          description: g.descripcion,
          quantity: g.cantidad,
          unitPrice: g.precio,
        })),
    };

    try {
      await updateProjectBudget(projectId, { budget: presupuesto });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Error al guardar presupuesto: " + err.message);
    }
  };

  const subtotalTutores = tutores.cantidad * tutores.horas * tutores.precio;
  const subtotalEstudiantes = estudiantes.cantidad * estudiantes.horas * estudiantes.precio;
  const subtotalOtros = otrosGastos.reduce((acc, gasto) => acc + gasto.cantidad * gasto.precio, 0);
  const total = subtotalTutores + subtotalEstudiantes + subtotalOtros;

  return (
    <div className="bg-gradient-to-b from-primary-bg to-card min-h-screen">
      {/* Botón de volver */}
      <div className="bg-card border ml-6 w-20 -mt-4">
        <Link href={`/projects/${projectId}/budget`}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <ArrowLeft className="h-5 w-5 text-black" />
          </div>
        </Link>
      </div>

      {/* Título principal */}
      <div className="text-center py-12 font-bold text-primary-text bg-card shadow-sm -mt-16 -mx-16">
        <span className="bg-gradient-to-b from-white to-50% to-accent text-5xl bg-clip-text text-transparent">
          Presupuesto del Proyecto
        </span>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto bg-card p-8 rounded-xl shadow-lg">
          {/* 1. Información General */}
          <section>
              <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center mt-2">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                  1
                </span>
                Información General
              </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium text-sm">Título del presupuesto *</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Motivo del presupuesto *</label>
                <input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full border rounded-lg p-3" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium text-sm">Comentarios generales</label>
              <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} className="w-full border rounded-lg p-3" rows={3} />
            </div>
          </section>

          {/* 2. Recursos Humanos */}
          <section>
            <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center mt-8">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                2
              </span>
              Recursos Humanos
            </h2>

            {/* Profesores */}
            <div className="p-4 mb-6 space-y-2">
              <h3 className="font-semibold mb-2">Profesores y Tutores</h3>
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
                <label>Cantidad</label>
                <label>Horas</label>
                <label>€/hora</label>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-1">
                <input type="number" value={tutores.cantidad} onChange={e => setTutores({ ...tutores, cantidad: +e.target.value })} className="input" />
                <input type="number" value={tutores.horas} onChange={e => setTutores({ ...tutores, horas: +e.target.value })} className="input" />
                <input type="number" value={tutores.precio} onChange={e => setTutores({ ...tutores, precio: +e.target.value })} className="input" />
              </div>
              <p className="text-right font-medium mt-2">Subtotal: {subtotalTutores.toFixed(2)}€</p>
            </div>

            {/* Estudiantes */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold mb-2">Estudiantes en Prácticas</h3>
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
                <label>Cantidad</label>
                <label>Horas</label>
                <label>€/hora</label>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-1">
                <input type="number" value={estudiantes.cantidad} onChange={e => setEstudiantes({ ...estudiantes, cantidad: +e.target.value })} className="input" />
                <input type="number" value={estudiantes.horas} onChange={e => setEstudiantes({ ...estudiantes, horas: +e.target.value })} className="input" />
                <input type="number" value={estudiantes.precio} onChange={e => setEstudiantes({ ...estudiantes, precio: +e.target.value })} className="input" />
              </div>
              <p className="text-right font-medium mt-2">Subtotal: {subtotalEstudiantes.toFixed(2)}€</p>
            </div>
          </section>

          {/* 3. Otros Gastos */}
          <section>
            <h2 className="text-2xl font-bold text-primary-text mb-6 flex items-center mt-8">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-3 text-sm">
                3
              </span>
              Otros Gastos
            </h2>

            <div className="p-4">
              <div className="grid gap-4 text-sm font-medium text-gray-500 mb-2"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr' }}>
                <span>Descripción</span>
                <span>Cantidad</span>
                <span>€/unidad</span>
                <span>Total</span>
                <span>Acción</span>
              </div>

              {/* Gastos existentes */}
              {otrosGastos.map((gasto, idx) => (
                <div
                  key={idx}
                  className="grid gap-4 mb-3 items-center"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr' }}
                >
                  <span>{gasto.descripcion}</span>
                  <span>{gasto.cantidad}</span>
                  <span>{Number(gasto.precio).toFixed(2)}€</span>
                  <span>{(gasto.cantidad * gasto.precio).toFixed(2)}€</span>
                  <button
                    onClick={() => {
                      setIndiceAEliminar(idx);
                      setModalAbierto(true);
                    }}
                    className="mx-1 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded flex justify-center items-center"
                    title="Eliminar gasto"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Nuevo gasto */}
              <div
                className="grid gap-6 items-center"
                style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 0.5fr' }}
              >
                <input value={nuevoGasto.descripcion} onChange={e => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })} className="input" placeholder="Descripción" />
                <input type="number" value={nuevoGasto.cantidad} onChange={e => setNuevoGasto({ ...nuevoGasto, cantidad: +e.target.value })} className="input" />
                <input type="number" value={nuevoGasto.precio} onChange={e => setNuevoGasto({ ...nuevoGasto, precio: +e.target.value })} className="input" />
                <button
                  onClick={agregarGasto}
                  className="mx-1 w-8 h-8 bg-accent hover:bg-accent/80 text-white rounded flex justify-center items-center"
                  title="Añadir gasto"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>

              <p className="text-right font-medium mt-4">Subtotal: {subtotalOtros.toFixed(2)}€</p>
            </div>
          </section>

          {/* Total */}
          <div className="rounded p-4 text-2xl font-bold text-right">
            Total: {total.toFixed(2)}€
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onSuccess}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="hover:bg-accent/80 px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-sm flex items-center justify-center transition"
            >
              <FaCheckCircle className="mr-2" />
              Guardar Presupuesto
            </button>
          </div>
          <DeleteConfirmModal
            isOpen={modalAbierto}
            onClose={() => {
              setModalAbierto(false);
              setIndiceAEliminar(null);
            }}
            onConfirm={eliminarGasto}
            isLoading={eliminando}
            title="¿Eliminar este gasto?"
            description="Esta acción eliminará permanentemente el gasto del presupuesto."
          />
        </div>
      </div>
    </div>
  );
}
