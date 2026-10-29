import React from 'react';
import { Specialist, Service, TimeSlot } from '../../types/domain';
import { Button } from '../common/Button';
import { Calendar, Sparkles, Clock } from 'lucide-react';

interface SpecialistCardProps {
  specialist: Specialist;
  services: Service[];
  nextAvailableSlot?: TimeSlot;
  onSelect: (specialist: Specialist) => void;
  onQuickBookSlot?: (slot: TimeSlot) => void;
}

export const SpecialistCard: React.FC<SpecialistCardProps> = ({
  specialist,
  services,
  nextAvailableSlot,
  onSelect,
  onQuickBookSlot,
}) => {
  const formattedNextDate = nextAvailableSlot
    ? new Date(`${nextAvailableSlot.date}T00:00:00`).toLocaleDateString('es-AR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-0 sm:min-h-[440px]">
      <div>
        {/* Encabezado: Avatar + Nombre y Título */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#FAF7F2] shadow-sm bg-[#F4EFE6]">
            <img
              src={specialist.avatarUrl}
              alt={specialist.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1B2B1C] leading-snug">
              {specialist.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#3D5A40] font-medium leading-relaxed">
              {specialist.title}
            </p>
          </div>
        </div>

        {/* Biografía */}
        <p className="text-xs sm:text-sm text-[#2C3E2D]/85 leading-relaxed line-clamp-3">
          {specialist.bio}
        </p>

        {/* Tags de especialidad */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-3 sm:mt-4">
          {specialist.specialtyTags.map(tag => (
            <span
              key={tag}
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#DCE5D8]/70 text-[#2C3E2D] border border-[#6E8B68]/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Resumen de Prácticas */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E8E0D2]/60 space-y-1">
          <p className="text-[11px] sm:text-xs uppercase font-semibold text-[#2C3E2D]/60 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C29352]" />
            <span>Prácticas activas ({services.length}):</span>
          </p>
          <div className="text-xs text-[#2C3E2D]/90 font-medium line-clamp-2 leading-relaxed">
            {services.length > 0
              ? services.map(s => `${s.title} ($${s.price.toLocaleString('es-AR')})`).join(' • ')
              : 'Consultar prácticas disponibles'}
          </div>
        </div>
      </div>

      {/* Zona Inferior: Próximo turno rápido en 1 clic + Ver todos los horarios */}
      <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E8E0D2] space-y-2">
        {nextAvailableSlot && onQuickBookSlot ? (
          <button
            type="button"
            onClick={() => onQuickBookSlot(nextAvailableSlot)}
            className="w-full min-h-[44px] sm:min-h-[48px] px-3.5 py-2 rounded-2xl bg-[#EBF0EA] hover:bg-[#DCE5D8] border border-[#6E8B68]/30 text-xs font-bold text-[#1B2B1C] flex items-center justify-between transition-colors cursor-pointer touch-target"
            title="Reservar directamente el próximo turno libre sin pasos intermedios"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-[#3D5A40] flex-shrink-0" />
              <span className="capitalize truncate">
                Próximo libre: {formattedNextDate} • {nextAvailableSlot.startTime} hs
              </span>
            </span>
            <span className="underline text-[#3D5A40] flex-shrink-0 ml-1">Reservar &rarr;</span>
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-2xl bg-[#F4EFE6] text-xs text-[#2C3E2D]/65 text-center font-medium">
            Sin horarios libres inmediatos
          </div>
        )}

        <Button
          variant="primary"
          size="default"
          onClick={() => onSelect(specialist)}
          leftIcon={<Calendar className="w-4 h-4" />}
          className="w-full font-bold shadow-sm text-xs sm:text-sm"
        >
          Ver Agenda Completa
        </Button>
      </div>
    </div>
  );
};
