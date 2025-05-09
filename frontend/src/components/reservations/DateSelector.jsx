'use client';
import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import es from 'date-fns/locale/es';

export default function DateSelector({ date, setDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const selectedDate = date ? new Date(date) : null;

  const busyDates = [
    '2025-01-03',
    '2025-01-05',
    '2025-01-06',
    '2025-01-12',
    '2025-01-19',
    '2025-01-26',
  ];

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start, end });

  const offset = (getDay(start) + 6) % 7; // lunes = 0
  const blankCells = Array(offset).fill(null);

  const isBusy = (day) => busyDates.includes(format(day, 'yyyy-MM-dd'));
  const isSelected = (day) => selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  const isToday = (day) => format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-red-500" /> Fecha
      </h2>

      {/* Header de mes */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <span className="font-medium text-lg min-w-[140px] text-center">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </span>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {blankCells.map((_, i) => <div key={`b-${i}`}></div>)}
        {daysInMonth.map((day) => {
          const formatted = format(day, 'yyyy-MM-dd');
          return (
            <div
              key={formatted}
              className={`
                box-border rounded-md p-2 cursor-pointer transition-all
                ${isBusy(day) ? 'bg-red-200 text-gray-500 cursor-not-allowed' : ''}
                ${isSelected(day) ? 'bg-green-500 text-white font-bold' : ''}
                ${!isBusy(day) && !isSelected(day) ? 'hover:bg-blue-100' : ''}
                ${isToday(day) && !isSelected(day) && !isBusy(day)
                  ? 'border-2 border-blue-600 text-blue-600 font-semibold bg-blue-50 shadow-sm py-1.5'
                  : ''}
              `}                                         
              onClick={() => !isBusy(day) && setDate(formatted)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
