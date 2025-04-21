'use client';
import { useState } from 'react';
import Step1Reserva from '@/components/reservations/Step1Reserva';
import Step2Reserva from '@/components/reservations/Step2Reserva';
import Step3Reserva from '@/components/reservations/Step3Reserva';

export default function ReservasPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    table: null,
    reason: '',
    materials: []
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Reservar Zona de Trabajo</h1>
      <div className="mb-6">
        <ul className="flex justify-between text-sm">
          <li className={step === 1 ? 'font-bold' : ''}>1. Fecha y Hora</li>
          <li className={step === 2 ? 'font-bold' : ''}>2. Motivo y Complementos</li>
          <li className={step === 3 ? 'font-bold' : ''}>3. Finalizar Reserva</li>
        </ul>
      </div>

      {step === 1 && <Step1Reserva formData={formData} updateForm={updateForm} nextStep={nextStep} />}
      {step === 2 && <Step2Reserva formData={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3Reserva formData={formData} prevStep={prevStep} />}
    </div>
  );
}
