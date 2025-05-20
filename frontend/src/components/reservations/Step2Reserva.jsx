'use client';
import ZoneSelector from './ZoneSelector';
import useProjects from '@/hooks/useProjects';

export default function Step2Reserva({ formData, updateForm, nextStep, prevStep, reservations }) {
  const { projects, loading } = useProjects();

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Selector de mesas */}
        <div className="rounded-xl shadow-md p-6 border border-gray-200">
          <ZoneSelector
            selectedTable={formData.table}
            setTable={(table) => updateForm({ table })}
            date={formData.date}
            startTime={formData.startTime}
            endTime={formData.endTime}
          />
        </div>

        {/* Selector de proyecto */}
        <div className="rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Proyecto</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando proyectos…</p>
          ) : (
            <select
              value={formData.project}
              onChange={(e) => updateForm({ project: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-blue-500"
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between mt-6">
        <button
          className="hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium"
          onClick={prevStep}
        >
          ← Atrás
        </button>
        <button
          className={`font-medium px-6 py-2 rounded shadow flex items-center gap-2
            ${formData.project
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
          onClick={formData.project ? nextStep : null}
          disabled={!formData.project}
        >
          Siguiente →
        </button>

      </div>
    </div>
  );
}
