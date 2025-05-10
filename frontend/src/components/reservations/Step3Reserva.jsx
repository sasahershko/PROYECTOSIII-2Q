'use client';
import {
  Clock,
  CalendarDays,
  TimerReset,
  ClipboardEdit,
  PackageSearch,
  CheckCircle
} from 'lucide-react';

export default function Step3Reserva({ formData, prevStep, onSubmit }) {
  const { date, startTime, endTime, reason, materials, table } = formData;

  const calcDuration = () => {
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return diff > 0 ? `${hrs} horas${mins ? ` ${mins} min` : ''}` : 'Horario inválido';
  };

  return (
    <div className="space-y-6">
      {/* Secciones */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Detalles */}
        <div className="rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Detalles de la Reserva</h2>
          <div className="space-y-3 bg-blue-200 rounded-md p-4 text-sm text-blue-900">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span><strong>Fecha:</strong> {date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span><strong>Hora de inicio:</strong> {startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span><strong>Hora de salida:</strong> {endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <TimerReset className="w-4 h-4" />
              <span><strong>Duración:</strong> {calcDuration()}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardEdit className="w-4 h-4" />
              <span><strong>Motivo:</strong> {reason || 'No especificado'}</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageSearch className="w-4 h-4" />
              <span>
                <strong>Materiales:</strong>{' '}
                {materials.length > 0 ? (
                  <span className="font-semibold text-blue-800">
                    {materials.join(', ')}
                  </span>
                ) : (
                  'Ninguno'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Zona */}
        <div className="rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Zona</h2>
          <div className="border border-gray-300 rounded-md p-4 h-48 flex items-center justify-center text-gray-500">
            Mesa seleccionada: <span className="ml-2 font-bold text-blue-700">{table}</span>
          </div>
        </div>
      </div>

      {/* Navegación (fuera de las tarjetas) */}
      <div className="flex justify-between pt-4">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium"
          onClick={prevStep}
        >
          ← Atrás
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded shadow flex items-center gap-2"
          onClick={onSubmit}
        >
          Finalizar <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
