export default function ReservationSummary({ data }) {
    const { startTime, endTime, date, table, reason, materials } = data;
  
    const calcDuration = () => {
      if (!startTime || !endTime) return '';
      const [h1, m1] = startTime.split(':').map(Number);
      const [h2, m2] = endTime.split(':').map(Number);
      const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
      const hrs = Math.floor(diff / 60);
      const mins = diff % 60;
      return diff > 0 ? `${hrs}h ${mins}min` : 'Horario inválido';
    };
  
    return (
      <div className="bg-gray-100 p-4 rounded shadow space-y-2">
        <p><strong>📅 Fecha:</strong> {date}</p>
        <p><strong>⏱️ Hora de inicio:</strong> {startTime}</p>
        <p><strong>⏲️ Hora de salida:</strong> {endTime}</p>
        <p><strong>🕒 Duración:</strong> {calcDuration()}</p>
        <p><strong>🧾 Motivo de Reserva:</strong> {reason || 'No especificado'}</p>
        <p><strong>🪑 Mesa seleccionada:</strong> {table}</p>
        <p><strong>📦 Materiales necesarios:</strong> {materials.join(', ') || 'Ninguno'}</p>
      </div>
    );
  }
  