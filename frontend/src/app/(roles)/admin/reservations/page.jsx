'use client';

import { useState, useEffect } from 'react';
import {
  getUserReservations,
  createReservation,
  deleteReservation,
} from '@/lib/reservations';
import Step1Reserva from '@/components/reservations/Step1Reserva';
import Step2Reserva from '@/components/reservations/Step2Reserva';
import Step3Reserva from '@/components/reservations/Step3Reserva';
import ReservaCard from "@/components/reservations/ReservaCard";

export default function ReservasPage() {
  const [view, setView] = useState('create'); // 'create' | 'my'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    table: null,
    project: '',
  });

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getUserReservations();
      setReservations(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateForm = (data) =>
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));

  const handleReservaSubmit = async () => {
    try {
      await createReservation({
        table: formData.table,
        project: formData.project,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      alert('✅ Reserva creada');
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        table: null,
        project: '',
      });
      setStep(1);
      fetchReservations();
    } catch (e) {
      alert(`❌ ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
      await deleteReservation(id);
      alert('🗑️ Reserva eliminada');
      fetchReservations();
    } catch (e) {
      alert(`❌ ${e.message}`);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* Botones de cambio de vista */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            view === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setView('create')}
        >
          Crear Reserva
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === 'my'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setView('my')}
        >
          Mis Reservas
        </button>
      </div>

      {/* Vista: Crear Reserva */}
      {view === 'create' && (
        <div className="space-y-6">
          {/* Progreso */}
          <div className="relative flex items-center justify-between w-3/4 mx-auto mb-6">
            <div className="absolute inset-4 h-0.5 bg-gray-300">
              <div
                className="h-full bg-green-600"
                style={{ width: `${(step - 1) * 50}%` }}
              />
            </div>
            {[1, 2, 3].map((n) => {
              const active = step === n,
                done = step > n;
              return (
                <div
                  key={n}
                  className="flex flex-col items-center z-10 flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      active
                        ? 'bg-green-600 text-white'
                        : done
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {n}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      active ? 'font-medium' : 'text-gray-500'
                    }`}
                  >
                    {n === 1
                      ? 'Fecha y Hora'
                      : n === 2
                      ? 'Proyecto y Mesa'
                      : 'Finalizar Reserva'}
                  </span>
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <Step1Reserva
              formData={formData}
              updateForm={updateForm}
              nextStep={() => setStep(2)}
              reservations={reservations}
            />
          )}
          {step === 2 && (
            <Step2Reserva
              formData={formData}
              updateForm={updateForm}
              nextStep={() => setStep(3)}
              prevStep={() => setStep(1)}
              reservations={reservations}
            />
          )}
          {step === 3 && (
            <Step3Reserva
              formData={formData}
              prevStep={() => setStep(2)}
              onSubmit={handleReservaSubmit}
            />
          )}
        </div>
      )}

      {/* Vista: Mis Reservas */}
      {view === 'my' && (
        <div className="space-y-4">
          {loading && <p className="text-gray-600">Cargando reservas…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && reservations.length === 0 && (
            <p className="text-gray-500">No tienes reservas registradas.</p>
          )}

          {!loading && !error && (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((reserva) => (
                <ReservaCard
                  key={reserva._id}
                  reserva={reserva}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
