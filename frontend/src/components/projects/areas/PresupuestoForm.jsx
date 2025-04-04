'use client';
import { useState } from 'react';

export default function PresupuestoForm() {
  const [titulo, setTitulo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [comentarios, setComentarios] = useState('');

  const [tutores, setTutores] = useState({ cantidad: 0, horas: 0, precio: 0 });
  const [estudiantes, setEstudiantes] = useState({ cantidad: 0, horas: 0, precio: 0 });

  const [otrosGastos, setOtrosGastos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', cantidad: 0, precio: 0 });

  const agregarGasto = () => {
    if (!nuevoGasto.descripcion) return;
    setOtrosGastos([...otrosGastos, nuevoGasto]);
    setNuevoGasto({ descripcion: '', cantidad: 0, precio: 0 });
  };

  const subtotalTutores = tutores.cantidad * tutores.horas * tutores.precio;
  const subtotalEstudiantes = estudiantes.cantidad * estudiantes.horas * estudiantes.precio;
  const subtotalOtros = otrosGastos.reduce((acc, gasto) => acc + gasto.cantidad * gasto.precio, 0);
  const total = subtotalTutores + subtotalEstudiantes + subtotalOtros;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-8">
      <h1 className="text-3xl font-bold">Presupuesto del Proyecto</h1>

      {/* Datos Generales */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Título de presupuesto *</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} className="input" />
        </div>
        <div>
          <label className="font-semibold">Motivo del presupuesto *</label>
          <input value={motivo} onChange={e => setMotivo(e.target.value)} className="input" />
        </div>
      </div>
      <div>
        <label className="font-semibold">Comentarios generales</label>
        <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} className="input w-full h-24" />
      </div>

      {/* Profesores y Tutores */}
      <section>
        <h2 className="font-bold text-lg mb-2">Profesores y Tutores</h2>
        <div className="grid grid-cols-3 gap-4">
          <input type="number" value={tutores.cantidad} onChange={e => setTutores({ ...tutores, cantidad: +e.target.value })} className="input" placeholder="Nº Tutores" />
          <input type="number" value={tutores.horas} onChange={e => setTutores({ ...tutores, horas: +e.target.value })} className="input" placeholder="Horas estimadas" />
          <input type="number" value={tutores.precio} onChange={e => setTutores({ ...tutores, precio: +e.target.value })} className="input" placeholder="€/hora" />
        </div>
        <p className="text-right mt-1 font-semibold">Subtotal: €{subtotalTutores.toFixed(2)}</p>
      </section>

      {/* Estudiantes en Prácticas */}
      <section>
        <h2 className="font-bold text-lg mb-2">Estudiantes en Prácticas</h2>
        <div className="grid grid-cols-3 gap-4">
          <input type="number" value={estudiantes.cantidad} onChange={e => setEstudiantes({ ...estudiantes, cantidad: +e.target.value })} className="input" placeholder="Nº Estudiantes" />
          <input type="number" value={estudiantes.horas} onChange={e => setEstudiantes({ ...estudiantes, horas: +e.target.value })} className="input" placeholder="Horas estimadas" />
          <input type="number" value={estudiantes.precio} onChange={e => setEstudiantes({ ...estudiantes, precio: +e.target.value })} className="input" placeholder="€/hora" />
        </div>
        <p className="text-right mt-1 font-semibold">Subtotal: €{subtotalEstudiantes.toFixed(2)}</p>
      </section>

      {/* Otros Gastos */}
      <section>
        <h2 className="font-bold text-lg mb-2">Otros Gastos</h2>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <input value={nuevoGasto.descripcion} onChange={e => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })} className="input" placeholder="Descripción" />
          <input type="number" value={nuevoGasto.cantidad} onChange={e => setNuevoGasto({ ...nuevoGasto, cantidad: +e.target.value })} className="input" placeholder="Cantidad" />
          <input type="number" value={nuevoGasto.precio} onChange={e => setNuevoGasto({ ...nuevoGasto, precio: +e.target.value })} className="input" placeholder="€/unidad" />
        </div>
        <button onClick={agregarGasto} className="bg-black text-white px-4 py-2 rounded">+ Añadir Gasto</button>

        {/* Lista de gastos */}
        <ul className="mt-2 space-y-1 text-sm">
          {otrosGastos.map((gasto, idx) => (
            <li key={idx}>
              • {gasto.descripcion}: {gasto.cantidad} x €{gasto.precio.toFixed(2)} = €{(gasto.cantidad * gasto.precio).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="text-right mt-1 font-semibold">Subtotal: €{subtotalOtros.toFixed(2)}</p>
      </section>

      {/* Total */}
      <div className="bg-gray-100 p-4 rounded text-right text-xl font-bold">
        Total General: €{total.toFixed(2)}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2">
        <button className="border px-4 py-2 rounded">Cancelar</button>
        <button className="bg-black text-white px-6 py-2 rounded">Guardar</button>
      </div>
    </div>
  );
}
