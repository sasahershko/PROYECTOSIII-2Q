export default function ZoneSelector({ selectedTable, setTable }) {
    const tables = [
      { id: '1', name: 'Mesa 1', busy: true },
      { id: '2', name: 'Mesa 2', busy: false },
      { id: '3', name: 'Mesa 3', busy: false },
      { id: '4', name: 'Mesa 4', busy: true },
      { id: '5', name: 'Mesa 5', busy: false },
      { id: '6', name: 'Mesa 6', busy: false },
    ];
  
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">Zona</h2>
        <p className="text-sm mb-4 text-gray-600">Seleccione uno o varios puestos de trabajo.</p>
        <div className="grid grid-cols-3 gap-3">
          {tables.map((t) => (
            <div
              key={t.id}
              onClick={() => !t.busy && setTable(t.id)}
              className={`
                p-4 rounded-md text-center text-sm font-medium border shadow-sm cursor-pointer
                ${t.busy ? 'bg-red-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-blue-100'}
                ${selectedTable === t.id ? 'ring-2 ring-blue-600 border-blue-600' : ''}
              `}
            >
              {t.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
  