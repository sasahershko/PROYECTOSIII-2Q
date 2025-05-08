'use client';
import { useState } from 'react';
import {
  Monitor,
  Projector,
  Printer,
  PackageOpen
} from 'lucide-react';

export default function MaterialCheckboxes({ selected, onChange }) {
  const [extra, setExtra] = useState('');

  const items = [
    { label: 'Pantallas', icon: <Monitor className="w-4 h-4 text-gray-600" /> },
    { label: 'Proyector', icon: <Projector className="w-4 h-4 text-gray-600" /> },
    { label: 'Impresoras', icon: <Printer className="w-4 h-4 text-gray-600" /> },
    { label: 'Otros...', icon: <PackageOpen className="w-4 h-4 text-gray-600" /> },
  ];

  const toggle = (item) => {
    const updated = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    onChange(updated);
  };

  const handleExtraChange = (value) => {
    setExtra(value);
    const updated = [...selected.filter((i) => !i.startsWith('Otro:'))];
    if (value.trim()) {
      updated.push(`Otro: ${value}`);
    }
    onChange(updated);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Materiales</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {items.map(({ label, icon }) => (
          <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(label)}
              onChange={() => toggle(label)}
              disabled={label === 'Otros...'}
            />
            <span className="flex items-center gap-2">{icon} {label}</span>
          </label>
        ))}
      </div>

      <input
        type="text"
        placeholder="Si necesitas otro material, especifícalo aquí..."
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-blue-500"
        value={extra}
        onChange={(e) => handleExtraChange(e.target.value)}
      />
    </div>
  );
}
