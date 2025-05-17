import { CalendarDays, Clock, Trash } from "lucide-react";

export default function ReservaCard({ reserva, onDelete }) {
  const {
    _id,
    date,
    startTime,
    endTime,
    table,
    project,
    status
  } = reserva;

  const formatTime = (timeStr) =>
    new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="rounded-xl border shadow-sm p-4 bg-white dark:bg-neutral-900 space-y-2">
      {/* Encabezado: proyecto + estado */}
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold max-w-[85%]">
          {project?.name || 'Sin proyecto'}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusStyle(status)}`}>
          {getStatusText(status)}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Mesa {table?.name || 'Sin mesa'}
      </p>

      {/* Fecha y hora */}
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <CalendarDays className="w-4 h-4" />
        <span>{formatDate(date)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <Clock className="w-4 h-4" />
        <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
      </div>

      {/* Acción eliminar */}
      <div className="pt-2">
        <button
          className="flex items-center gap-1 text-red-600 hover:underline text-sm"
          onClick={() => onDelete(_id)}
        >
          <Trash className="w-4 h-4" /> Eliminar
        </button>
      </div>
    </div>
  );
}
