import { useEffect, useState } from 'react';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

export default function Step1Reserva({ formData, updateForm, nextStep }) {
  const { date, startTime, endTime } = formData;

  // ✅ Establecer valores iniciales al cargar si están vacíos
  useEffect(() => {
    if (!startTime) updateForm({ startTime: '08:00' });
    if (!endTime) updateForm({ endTime: '09:00' });
  }, []);

  const handleNext = () => {
    if (!date || !startTime || !endTime) return alert('Completa todos los campos');
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-xl shadow p-6 border">
          <DateSelector date={date} setDate={(d) => updateForm({ date: d })} />
        </div>
        <div className="rounded-xl shadow p-6 border">
          <TimeSelector
            startTime={startTime}
            endTime={endTime}
            setStartTime={(val) => updateForm({ startTime: val })}
            setEndTime={(val) => updateForm({ endTime: val })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium shadow"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
