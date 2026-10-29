import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Specialist, Service, TimeSlot } from '../../types/domain';
import { UserPlus, Lock } from 'lucide-react';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialists: Specialist[];
  services: Service[];
  availableSlots: TimeSlot[];
  onCreateManualBooking: (data: {
    timeSlotId: string;
    specialistId: string;
    serviceId: string;
    patientName: string;
    patientPhone: string;
    patientNotes?: string;
    depositVerified: boolean;
  }) => void;
  onBlockSlot: (slotId: string, notes: string) => void;
}

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({
  isOpen,
  onClose,
  specialists,
  services,
  availableSlots,
  onCreateManualBooking,
  onBlockSlot,
}) => {
  const [actionType, setActionType] = useState<'booking' | 'block'>('booking');
  const [selectedSlotId, setSelectedSlotId] = useState(availableSlots[0]?.id || '');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [depositVerified, setDepositVerified] = useState(true);
  const [blockNotes, setBlockNotes] = useState('Bloqueo administrativo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (availableSlots.length > 0 && !selectedSlotId) {
      setSelectedSlotId(availableSlots[0].id);
    }
  }, [availableSlots, selectedSlotId]);

  const selectedSlot = availableSlots.find(s => s.id === selectedSlotId);
  const currentSpecialist = selectedSlot
    ? specialists.find(s => s.id === selectedSlot.specialistId)
    : specialists[0];
  const specialistServices = currentSpecialist
    ? services.filter(s => s.specialistId === currentSpecialist.id)
    : services;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (actionType === 'booking') {
        onCreateManualBooking({
          timeSlotId: selectedSlotId,
          specialistId: selectedSlot ? selectedSlot.specialistId : specialists[0].id,
          serviceId: selectedServiceId || specialistServices[0]?.id || services[0].id,
          patientName,
          patientPhone,
          patientNotes,
          depositVerified,
        });
      } else {
        onBlockSlot(selectedSlotId, blockNotes);
      }
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión Manual de Turno"
      subtitle="Ingresar paciente presencial/telefónico o bloquear horario"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selector de Tipo de Acción */}
        <div className="flex p-1 bg-[#F4EFE6] border border-[#E8E0D2] rounded-2xl">
          <button
            type="button"
            onClick={() => setActionType('booking')}
            className={`flex-1 min-h-[48px] py-2 rounded-xl text-sm font-semibold transition-all touch-target flex items-center justify-center gap-2 ${
              actionType === 'booking'
                ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-sm'
                : 'text-[#2C3E2D]/70 hover:text-[#1B2B1C]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Ingresar Reserva Manual</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('block')}
            className={`flex-1 min-h-[48px] py-2 rounded-xl text-sm font-semibold transition-all touch-target flex items-center justify-center gap-2 ${
              actionType === 'block'
                ? 'bg-[#D97D64] text-[#FAF7F2] shadow-sm'
                : 'text-[#2C3E2D]/70 hover:text-[#1B2B1C]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Bloquear Horario</span>
          </button>
        </div>

        {/* Selección de Casillero Disponible */}
        <div>
          <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
            Seleccionar Turno Disponible
          </label>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-[#D97D64] p-3 rounded-xl bg-[#FBEBE7]">
              No hay bloques disponibles actualmente. Puedes generar una nueva jornada en el botón "Generar Jornada".
            </p>
          ) : (
            <select
              value={selectedSlotId}
              onChange={e => setSelectedSlotId(e.target.value)}
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            >
              {availableSlots.map(s => {
                const spec = specialists.find(sp => sp.id === s.specialistId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.date} • {s.startTime} a {s.endTime} hs • {spec?.name}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {actionType === 'booking' ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
                Servicio / Terapia
              </label>
              <select
                value={selectedServiceId}
                onChange={e => setSelectedServiceId(e.target.value)}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              >
                {specialistServices.map(srv => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} (${srv.price.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
                Nombre del Paciente
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="Ej. Roberto Martínez"
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                placeholder="+54 9 11 1234-5678"
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E2D]/80 mb-1">
                Notas (Opcional)
              </label>
              <input
                type="text"
                value={patientNotes}
                onChange={e => setPatientNotes(e.target.value)}
                placeholder="Ej. Reservó presencialmente"
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F4EFE6] border border-[#E8E0D2]">
              <input
                id="depositCheck"
                type="checkbox"
                checked={depositVerified}
                onChange={e => setDepositVerified(e.target.checked)}
                className="w-5 h-5 rounded text-[#2C3E2D] focus:ring-[#2C3E2D]"
              />
              <label htmlFor="depositCheck" className="text-sm font-medium text-[#1B2B1C] cursor-pointer">
                Marcar seña como verificada inmediatamente (Confirmar turno)
              </label>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
              Motivo del bloqueo
            </label>
            <input
              type="text"
              required
              value={blockNotes}
              onChange={e => setBlockNotes(e.target.value)}
              placeholder="Ej. Reunión de equipo, mantenimiento de sala, etc."
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0D2]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={actionType === 'booking' ? 'primary' : 'danger'}
            isLoading={isSubmitting}
            disabled={availableSlots.length === 0}
            className="font-bold px-6"
          >
            {actionType === 'booking' ? 'Crear Reserva' : 'Bloquear Horario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
