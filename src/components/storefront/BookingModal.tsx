import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DepositPaymentCard } from './DepositPaymentCard';
import { Specialist, Service, TimeSlot, SiteSettings, Booking } from '../../types/domain';
import { Clock, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  specialist: Specialist | null;
  services: Service[];
  settings: SiteSettings;
  onRequestBooking: (data: {
    timeSlotId: string;
    specialistId: string;
    serviceId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientNotes?: string;
  }) => { success: boolean; booking?: Booking; error?: string };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  slot,
  specialist,
  services,
  settings,
  onRequestBooking,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Auto-seleccionar primer servicio disponible al abrir
  React.useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  // Limpiar estado al cerrar o cambiar slot
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmedBooking(null);
      setErrorMessage(null);
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
      setPatientNotes('');
    }
  }, [isOpen]);

  if (!slot || !specialist) return null;

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMessage('Por favor ingresa un teléfono celular o WhatsApp de contacto.');
      return;
    }
    if (!currentService) {
      setErrorMessage('Por favor selecciona una práctica o servicio.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = onRequestBooking({
        timeSlotId: slot.id,
        specialistId: specialist.id,
        serviceId: currentService.id,
        patientName,
        patientPhone,
        patientEmail,
        patientNotes,
      });

      setIsSubmitting(false);

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        const modalBody = document.getElementById('modal-content-body');
        if (modalBody) modalBody.scrollTop = 0;
      } else {
        setErrorMessage(result.error || 'No se pudo reservar el horario. Intenta con otro turno.');
      }
    }, 400); // Micro-latencia deliberada para dar feedback táctil con el spinner interno
  };

  const formattedDate = new Date(`${slot.date}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={confirmedBooking ? 'Confirmación y Pago de Seña' : 'Solicitar Turno'}
      subtitle={
        confirmedBooking
          ? `Paso final para coordinar tu cita con ${specialist.name}`
          : `Atención con ${specialist.name} • ${formattedDate}`
      }
      maxWidth="lg"
    >
      {confirmedBooking && currentService ? (
        <DepositPaymentCard
          settings={settings}
          specialist={specialist}
          service={currentService}
          slot={slot}
          patientName={patientName}
          depositAmount={confirmedBooking.depositAmount}
          totalAmount={confirmedBooking.totalAmount}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del horario seleccionado */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE5D8] text-[#2C3E2D] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#2C3E2D]/70">Día y Horario</p>
                <p className="text-base font-bold text-[#1B2B1C] capitalize">
                  {formattedDate} • {slot.startTime} a {slot.endTime} hs
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DCE5D8] text-[#2C3E2D]">
              Casillero Disponible
            </span>
          </div>

          {/* Selección de Servicio / Práctica */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#1B2B1C]">
              Selecciona la práctica o terapia:
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {services.map(srv => {
                const isSelected = (currentService?.id || selectedServiceId) === srv.id;
                return (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`touch-target text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2C3E2D] bg-[#2C3E2D]/5 shadow-sm'
                        : 'border-[#E8E0D2] bg-[#FAF7F2] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1B2B1C]">{srv.title}</p>
                        {srv.badge && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#DCE5D8] text-[#2C3E2D]">
                            {srv.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#2C3E2D]/70 mt-0.5">
                        {srv.durationMinutes} minutos • {srv.description.slice(0, 75)}...
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-[#1B2B1C]">
                        ${srv.price.toLocaleString('es-AR')}
                      </p>
                      <p className="text-[11px] text-[#C29352] font-semibold">
                        Seña {srv.depositValue}% (${Math.round((srv.price * srv.depositValue) / 100).toLocaleString('es-AR')})
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario de Datos del Paciente */}
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="patientName" className="block text-sm font-semibold text-[#1B2B1C] mb-1">
                Nombre y Apellido <span className="text-[#D97D64]">*</span>
              </label>
              <input
                id="patientName"
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="Ej. Laura González"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
              />
            </div>

            <div>
              <label htmlFor="patientPhone" className="block text-sm font-semibold text-[#1B2B1C] mb-1">
                Teléfono / WhatsApp de contacto <span className="text-[#D97D64]">*</span>
              </label>
              <input
                id="patientPhone"
                type="tel"
                required
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                placeholder="Ej. +54 9 11 1234-5678"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
              />
            </div>

            <div>
              <label htmlFor="patientEmail" className="block text-sm font-medium text-[#2C3E2D]/80 mb-1">
                Correo Electrónico (Opcional)
              </label>
              <input
                id="patientEmail"
                type="email"
                value={patientEmail}
                onChange={e => setPatientEmail(e.target.value)}
                placeholder="laura@ejemplo.com"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
              />
            </div>

            <div>
              <label htmlFor="patientNotes" className="block text-sm font-medium text-[#2C3E2D]/80 mb-1">
                Motivo de consulta o notas para el terapeuta (Opcional)
              </label>
              <textarea
                id="patientNotes"
                rows={2}
                value={patientNotes}
                onChange={e => setPatientNotes(e.target.value)}
                placeholder="Ej. Dolores musculares en hombros por mala postura..."
                className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
              />
            </div>
          </div>

          {/* Mensaje de Error si ocurre colisión */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FBEBE7] border border-[#D97D64]/40 text-[#A64A32] text-sm">
              {errorMessage}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0D2]">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
              className="font-bold px-8"
            >
              Confirmar y Ver Datos de Seña
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
