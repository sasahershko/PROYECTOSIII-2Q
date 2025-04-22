'use client';
import { useState } from 'react';
import { createReservation } from "@/lib/reservationsClient";
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
    materials: [],
    project: ''
  });  

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleReservaSubmit = async () => {
    try {
      await createReservation({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        table: formData.table
      });
  
      alert("✅ Reserva creada con éxito");
  
      // Reiniciar pasos y formulario
      setStep(1);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        table: null,
        reason: '',
        materials: [],
        project: ''
      });
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Reservar Zona de Trabajo</h1>
      {/* Menú de pasos alineado al diseño de Figma y delimitado */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mb-6">Selecciona el horario para tu reserva</p>
        
        <div className="relative flex items-start justify-between w-3/4 mx-auto">

          {/* Línea de conexión que va de paso 1 a 3 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-0.5 bg-gray-300 z-0">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>

          {[1, 2, 3].map((stepNumber) => {
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div key={stepNumber} className="flex flex-col items-center z-10 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : isCompleted
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                <div className="mt-2 text-sm">
                  <span className={`${isActive ? 'text-black underline font-medium' : 'text-gray-500'}`}>
                    {stepNumber === 1 && 'Fecha y Hora'}
                    {stepNumber === 2 && 'Motivo y Complementos'}
                    {stepNumber === 3 && 'Finalizar Reserva'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 && <Step1Reserva formData={formData} updateForm={updateForm} nextStep={nextStep} />}
      {step === 2 && <Step2Reserva formData={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3Reserva formData={formData} prevStep={prevStep} onSubmit={handleReservaSubmit} />}
    </div>
  );
}
