import React, { useState } from 'react';
import { Copy, Check, Send, AlertCircle, Building2, User, CalendarPlus } from 'lucide-react';
import { Button } from '../common/Button';
import { SiteSettings, Specialist, Service, TimeSlot } from '../../types/domain';
import { downloadBookingIcs } from '../../utils/calendarExport';

interface DepositPaymentCardProps {
  settings: SiteSettings;
  specialist: Specialist;
  service: Service;
  slot: TimeSlot;
  patientName: string;
  depositAmount: number;
  totalAmount: number;
}

export const DepositPaymentCard: React.FC<DepositPaymentCardProps> = ({
  settings,
  specialist,
  service,
  slot,
  patientName,
  depositAmount,
  totalAmount,
}) => {
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedCbu, setCopiedCbu] = useState(false);
  const [isCopyingAlias, setIsCopyingAlias] = useState(false);
  const [isCopyingCbu, setIsCopyingCbu] = useState(false);

  // Copiado con 1 clic con confirmación visual accesible
  const handleCopyAlias = async () => {
    setIsCopyingAlias(true);
    try {
      await navigator.clipboard.writeText(settings.bankAlias);
      setCopiedAlias(true);
      setTimeout(() => setCopiedAlias(false), 2500);
    } catch (err) {
      console.error('Error al copiar alias:', err);
    } finally {
      setIsCopyingAlias(false);
    }
  };

  const handleCopyCbu = async () => {
    setIsCopyingCbu(true);
    try {
      await navigator.clipboard.writeText(settings.bankCbu);
      setCopiedCbu(true);
      setTimeout(() => setCopiedCbu(false), 2500);
    } catch (err) {
      console.error('Error al copiar CBU:', err);
    } finally {
      setIsCopyingCbu(false);
    }
  };

  // Construcción dinámica y limpia del mensaje de WhatsApp
  const formattedDate = new Date(`${slot.date}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const structuredMessage = settings.whatsappTemplate
    .replace('{patient_name}', patientName)
    .replace('{specialist_name}', specialist.name)
    .replace('{service_title}', service.title)
    .replace('{date}', `${formattedDate} (${slot.date})`)
    .replace('{time}', `${slot.startTime} a ${slot.endTime} hs`)
    .replace('{deposit_amount}', depositAmount.toLocaleString('es-AR'));

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(structuredMessage)}`;

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm zen-card">
      {/* Banner de Estado Preventivo */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl bg-[#F9F2E7] border border-[#C29352]/40 text-[#8C6126]"
        role="status"
        aria-live="polite"
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#C29352]" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold text-[#1B2B1C]">¡Horario reservado preventivamente!</p>
          <p className="mt-0.5 text-[#8C6126]">
            Tu casillero horario ha sido bloqueado provisionalmente. Para confirmar definitivamente el turno, realiza la transferencia de la seña y envía el comprobante por WhatsApp.
          </p>
        </div>
      </div>

      {/* Desglose de Montos */}
      <div className="bg-[#F4EFE6] rounded-2xl p-5 border border-[#E8E0D2] space-y-3">
        <div className="flex items-center justify-between text-sm text-[#2C3E2D]/80">
          <span>Servicio:</span>
          <span className="font-semibold text-[#1B2B1C]">{service.title}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#2C3E2D]/80">
          <span>Valor total de la sesión:</span>
          <span className="font-semibold text-[#1B2B1C]">${totalAmount.toLocaleString('es-AR')}</span>
        </div>
        <div className="pt-2 border-t border-[#E8E0D2] flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#1B2B1C]">Seña requerida para confirmar:</span>
            <span className="block text-xs text-[#6E8B68] font-medium">
              (El saldo restante se abona el día del turno)
            </span>
          </div>
          <span className="text-2xl font-serif font-bold text-[#C29352]">
            ${depositAmount.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Datos Bancarios y Copiado Rápido */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-[#3D5A40] flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>Datos para la transferencia bancaria</span>
        </h3>

        {/* Alias */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] hover:border-[#6E8B68]/40 transition-colors">
          <div>
            <span className="text-xs uppercase font-semibold text-[#2C3E2D]/60 block">Alias de la cuenta</span>
            <span className="text-lg font-mono font-bold text-[#1B2B1C] tracking-wide select-all">
              {settings.bankAlias}
            </span>
          </div>
          <Button
            type="button"
            variant={copiedAlias ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopyAlias}
            isLoading={isCopyingAlias}
            leftIcon={copiedAlias ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            aria-live="polite"
            className="w-full sm:w-auto"
          >
            {copiedAlias ? '¡Alias Copiado!' : 'Copiar Alias'}
          </Button>
        </div>

        {/* CBU */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] hover:border-[#6E8B68]/40 transition-colors">
          <div>
            <span className="text-xs uppercase font-semibold text-[#2C3E2D]/60 block">CBU</span>
            <span className="text-sm font-mono font-medium text-[#1B2B1C] tracking-wide select-all break-all">
              {settings.bankCbu}
            </span>
          </div>
          <Button
            type="button"
            variant={copiedCbu ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopyCbu}
            isLoading={isCopyingCbu}
            leftIcon={copiedCbu ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            aria-live="polite"
            className="w-full sm:w-auto"
          >
            {copiedCbu ? '¡CBU Copiado!' : 'Copiar CBU'}
          </Button>
        </div>

        {/* Titular y Banco */}
        <div className="p-4 rounded-2xl bg-[#F4EFE6]/70 border border-[#E8E0D2] text-xs text-[#2C3E2D]/80 flex items-center gap-3">
          <User className="w-4 h-4 text-[#3D5A40] flex-shrink-0" />
          <div>
            <span className="font-semibold text-[#1B2B1C]">Titular:</span> {settings.bankHolder} •{' '}
            <span className="font-semibold text-[#1B2B1C]">Banco:</span> {settings.bankName}
          </div>
        </div>
      </div>

      {/* Botón de Derivación Dinámica a WhatsApp y Calendario */}
      <div className="pt-2 space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center min-h-[52px] px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-base shadow-md transition-all duration-200 gap-3 touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] active:scale-[0.98]"
        >
          <Send className="w-5 h-5 flex-shrink-0" />
          <span>Enviar Comprobante por WhatsApp</span>
        </a>

        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() =>
            downloadBookingIcs({
              slot,
              specialist,
              service,
              settings,
              patientName,
            })
          }
          leftIcon={<CalendarPlus className="w-4 h-4 text-[#3D5A40]" />}
          className="w-full font-semibold"
        >
          Agendar Recordatorio en mi Calendario (.ics)
        </Button>

        <p className="text-xs text-center text-[#2C3E2D]/60 mt-1">
          Al presionar el botón verde, se abrirá WhatsApp con el detalle de tu reserva para adjuntar el comprobante.
        </p>
      </div>
    </div>
  );
};
