'use client';
import ZoneSelector from './ZoneSelector';
import MaterialCheckboxes from './MaterialCheckboxes';

export default function Step2Reserva({ formData, updateForm, nextStep, prevStep }) {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Zona */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <ZoneSelector selectedTable={formData.table} setTable={(table) => updateForm({ table })} />
        </div>

        {/* Motivo + Materiales */}
        <div className="space-y-6">
          {/* Motivo */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Motivo de la Reserva</h2>
            <textarea
              value={formData.reason}
              onChange={(e) => updateForm({ reason: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-blue-500"
              rows={3}
              placeholder="Describe el motivo de tu reserva..."
            />
          </div>

          {/* Materiales */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <MaterialCheckboxes
              selected={formData.materials}
              onChange={(materials) => updateForm({ materials })}
            />
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium"
          onClick={prevStep}
        >
          ← Atrás
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          onClick={nextStep}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
