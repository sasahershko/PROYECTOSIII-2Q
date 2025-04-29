'use client';

export default function TimeSelector({ startTime, endTime, setStartTime, setEndTime }) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  // Inicializar tiempos si no están definidos
  const safeStart = startTime ?? '08:00';
  const safeEnd = endTime ?? '09:00';

  const handleChange = (type, part, value) => {
    const current = type === 'start' ? (startTime ?? '08:00') : (endTime ?? '09:00');
    const [h, m] = current.split(':');
    const newTime = part === 'hour' ? `${value}:${m}` : `${h}:${value}`;
    type === 'start' ? setStartTime(newTime) : setEndTime(newTime);
  };

  const getDuration = () => {
    if (!safeStart || !safeEnd) return '';
    const [h1, m1] = safeStart.split(':').map(Number);
    const [h2, m2] = safeEnd.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return diff > 0 ? `${hrs} horas${mins ? ` ${mins} min` : ''}` : 'Horario inválido';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hora</h2>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block mb-1 font-medium">Hora de inicio</label>
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={safeStart.split(':')[0]}
              onChange={(e) => handleChange('start', 'hour', e.target.value)}
            >
              {hours.map(h => <option key={h}>{h}</option>)}
            </select>
            <select
              className="border rounded px-3 py-2"
              value={safeStart.split(':')[1]}
              onChange={(e) => handleChange('start', 'minute', e.target.value)}
            >
              {minutes.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Hora de finalización</label>
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={safeEnd.split(':')[0]}
              onChange={(e) => handleChange('end', 'hour', e.target.value)}
            >
              {hours.map(h => <option key={h}>{h}</option>)}
            </select>
            <select
              className="border rounded px-3 py-2"
              value={safeEnd.split(':')[1]}
              onChange={(e) => handleChange('end', 'minute', e.target.value)}
            >
              {minutes.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {safeStart && safeEnd && (
        <div className="bg-blue-100 border border-blue-300 text-blue-900 text-sm p-2 rounded shadow-sm flex items-center gap-2">
          ⏱️ <span>Duración total: <strong>{getDuration()}</strong></span>
        </div>
      )}
    </div>
  );
}
