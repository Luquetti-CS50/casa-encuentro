import React, { useState } from 'react';
import { Booking, TimeSlot, Specialist, Service, SiteSettings } from '../../types/domain';
import { StatusBadge } from '../common/Badge';
import { Copy, Check, Send, CalendarPlus, X, Sparkles } from 'lucide-react';
import { downloadBookingIcs } from '../../utils/calendarExport';

interface ActiveBookingBannerProps {
  booking: Booking;
  slot?: TimeSlot;
  specialist?: Specialist;
  service?: Service;
  settings: SiteSettings;
  onDismiss: () => void;
}

export const ActiveBookingBanner: React.FC<ActiveBookingBannerProps> = ({
  booking,
  slot,
  specialist,
  service,
  settings,
  onDismiss,
}) => {
  const [copiedAlias, setCopiedAlias] = useState(false);

  if (!slot || !specialist || !service) return null;

  const formattedDate = new Date(`${slot.date}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const structuredMessage = settings.whatsappTemplate
    .replace('{patient_name}', booking.patientName)
    .replace('{specialist_name}', specialist.name)
    .replace('{service_title}', service.title)
    .replace('{date}', `${formattedDate} (${slot.date})`)
    .replace('{time}', `${slot.startTime} a ${slot.endTime} hs`)
    .replace('{deposit_amount}', booking.depositAmount.toLocaleString('es-AR'));

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(structuredMessage)}`;

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(settings.bankAlias);
      setCopiedAlias(true);
      setTimeout(() => setCopiedAlias(false), 2500);
    } catch (err) {
      console.error('Error al copiar alias:', err);
    }
  };

  return (
    <section
      aria-label="Tu reserva reciente"
      className="bg-[#F9F2E7] border-b border-[#C29352]/40 py-4 px-4 sm:px-6 lg:px-8 shadow-xs"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-[#C29352]/20 text-[#8C6126] flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6126]">
                Tu Reserva en Curso ({booking.patientName})
              </span>
              <StatusBadge status={slot.status} />
            </div>
            <p className="text-sm font-bold text-[#1B2B1C] mt-1 capitalize">
              {service.title} con {specialist.name} • {formattedDate} ({slot.startTime} hs)
            </p>
            <p className="text-xs text-[#2C3E2D]/80 mt-0.5">
              Seña: <strong className="text-[#8C6126]">${booking.depositAmount.toLocaleString('es-AR')}</strong> • Alias:{' '}
              <strong className="font-mono text-[#1B2B1C]">{settings.bankAlias}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={handleCopyAlias}
            aria-live="polite"
            className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C29352]/40 text-xs font-bold text-[#1B2B1C] transition-colors cursor-pointer"
          >
            {copiedAlias ? <Check className="w-3.5 h-3.5 text-[#3D5A40]" /> : <Copy className="w-3.5 h-3.5 text-[#C29352]" />}
            <span>{copiedAlias ? '¡Alias Copiado!' : 'Copiar Alias'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              downloadBookingIcs({
                slot,
                specialist,
                service,
                settings,
                patientName: booking.patientName,
              })
            }
            className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-semibold text-[#2C3E2D] transition-colors cursor-pointer"
            title="Descargar recordatorio para tu calendario"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#3D5A40]" />
            <span>Agendar (.ics)</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Comprobante</span>
          </a>

          <button
            type="button"
            onClick={onDismiss}
            className="touch-target p-2 rounded-xl text-[#2C3E2D]/60 hover:text-[#1B2B1C] hover:bg-[#E8E0D2]/50 transition-colors cursor-pointer"
            aria-label="Ocultar aviso de mi reserva"
            title="Ocultar este aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
