// components/reservations/ZoneSelector.jsx
export default function ZoneSelector({ selectedTable, setTable, reservations, date }) {
  // Obtener todas las mesas únicas (evitando duplicados por ID)
  const allTables = reservations
    .map(res => res.table)
    .filter(
      (table, index, self) => self.findIndex(t => t._id === table._id) === index
    );

  // Verificar si una mesa está ocupada en esa fecha
  const isBusy = (tableId) =>
    reservations.some(r => r.table._id === tableId && r.date === date);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Zona</h2>
      <p className="text-sm mb-4 text-gray-600">Selecciona una mesa disponible para la fecha elegida.</p>
      <div className="grid grid-cols-3 gap-3">
        {allTables.map((t) => {
          const busy = isBusy(t._id);
          const isSelected = selectedTable === t._id;

          return (
            <div
              key={t._id}
              onClick={() => !busy && setTable(t._id)}
              className={`
                p-4 rounded-md text-center text-sm font-medium border shadow-sm cursor-pointer transition
                ${busy ? 'bg-red-400 text-white cursor-not-allowed' : 'hover:bg-blue-100'}
                ${isSelected ? 'ring-2 ring-blue-600 border-blue-600' : ''}
              `}
            >
              Mesa {t.number || t.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
