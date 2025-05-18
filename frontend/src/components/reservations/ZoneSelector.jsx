'use client';
import { useEffect, useState } from 'react';
import { getAvailableTables } from '@/lib/reservations';

export default function ZoneSelector({ selectedTable, setTable, date, startTime, endTime }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date || !startTime || !endTime) return;

    const fetchAvailableTables = async () => {
      setLoading(true);
      try {
        const available = await getAvailableTables({ date, startTime, endTime });
        setTables(available);
      } catch (err) {
        console.error("❌ Error al cargar mesas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTables();
  }, [date, startTime, endTime]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Zona</h2>
      <p className="text-sm mb-4 text-gray-600">Selecciona una mesa disponible para la fecha elegida.</p>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando mesas disponibles...</p>
      ) : tables.length === 0 ? (
        <p className="text-sm text-red-500">No hay mesas disponibles para este horario.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {tables.map((t) => {
            const isSelected = selectedTable === t._id;
            return (
              <div
                key={t._id}
                onClick={() => setTable(t._id)}
                className={`
                  p-4 rounded-md text-center text-sm font-medium border shadow-sm cursor-pointer transition
                  hover:bg-blue-100
                  ${isSelected ? 'ring-2 ring-blue-600 border-blue-600' : ''}
                `}
              >
                Mesa {t.number} <br />
                <span className="text-xs text-gray-500">{t.zone} ({t.capacity} personas)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
