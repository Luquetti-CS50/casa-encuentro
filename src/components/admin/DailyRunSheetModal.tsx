import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Specialist, TimeSlot, Booking, Service } from '../../types/domain';
import { Copy, Check, Send } from 'lucide-react';

interface DailyRunSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: Specialist;
  date: string;
  slots: TimeSlot[];
  bookings: Booking[];
  services: Service[];
}

export const DailyRunSheetModal: React.FC<DailyRunSheetModalProps> = ({
  isOpen,
  onClose,
  specialist,
  date,
  slots,
  bookings,
  services,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  if (!isOpen) return null;

  // Filtrar y ordenar los turnos del especialista para este día
  const daySlots = slots
    .filter(s => s.specialistId === specialist.id && s.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Construir la hoja de ruta cronológica
  let sheetContent = `🌿 CASA ENCUENTRO — Hoja de Ruta Diaria\n`;
  sheetContent += `• Profesional: ${specialist.name}\n`;
  sheetContent += `• Fecha: ${formattedDate} (${date})\n`;
  sheetContent += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let totalPacientes = 0;

  daySlots.forEach(slot => {
    const booking = bookings.find(b => b.timeSlotId === slot.id);
    const service = services.find(s => s.id === (booking?.serviceId || slot.serviceId));

    if (slot.status === 'CONFIRMED' && booking) {
      totalPacientes++;
      sheetContent += `⏰ ${slot.startTime} a ${slot.endTime} hs [CONFIRMADO ✅]\n`;
      sheetContent += `   Paciente: ${booking.patientName}\n`;
      sheetContent += `   Práctica: ${service?.title || 'Consulta'}\n`;
      sheetContent += `   Tel: ${booking.patientPhone}\n`;
      if (booking.patientNotes) {
        sheetContent += `   Notas: ${booking.patientNotes}\n`;
      }
      sheetContent += `\n`;
    } else if (slot.status === 'PENDING_DEPOSIT' && booking) {
      sheetContent += `⏰ ${slot.startTime} a ${slot.endTime} hs [SEÑA PENDIENTE ⏳]\n`;
      sheetContent += `   Paciente: ${booking.patientName} (${service?.title || 'Práctica'})\n`;
      sheetContent += `   Tel: ${booking.patientPhone}\n\n`;
    } else if (slot.status === 'BLOCKED') {
      sheetContent += `⏰ ${slot.startTime} a ${slot.endTime} hs [BLOQUEADO 🔒]\n`;
      if (slot.notes) sheetContent += `   Motivo: ${slot.notes}\n`;
      sheetContent += `\n`;
    } else {
      sheetContent += `⏰ ${slot.startTime} a ${slot.endTime} hs [DISPONIBLE 🌿]\n\n`;
    }
  });

  sheetContent += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  sheetContent += `Total de pacientes programados: ${totalPacientes}\n`;
  sheetContent += `Casa Encuentro - General Las Heras`;

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(sheetContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar hoja de ruta:', err);
    } finally {
      setIsCopying(false);
    }
  };

  const specialistPhoneClean = specialist.phone?.replace(/[^0-9]/g, '') || '';
  const whatsappUrl = `https://wa.me/${specialistPhoneClean}?text=${encodeURIComponent(sheetContent)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hoja de Ruta Diaria del Terapeuta"
      subtitle={`Resumen cronológico para ${specialist.name} • ${formattedDate}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Previsualización del texto estructurado */}
        <div className="bg-[#1B2B1C] text-[#FAF7F2] p-5 rounded-2xl font-mono text-xs leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-all border border-[#2C3E2D]">
          {sheetContent}
        </div>

        {/* Acciones de 1 Clic */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#E8E0D2]">
          <Button
            type="button"
            variant={copied ? 'secondary' : 'outline'}
            onClick={handleCopy}
            isLoading={isCopying}
            leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {copied ? '¡Copiado al Portapapeles!' : 'Copiar Texto'}
          </Button>

          {specialistPhoneClean && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-sm transition-all gap-2 touch-target"
            >
              <Send className="w-4 h-4" />
              <span>Enviar por WhatsApp al Profesional</span>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
