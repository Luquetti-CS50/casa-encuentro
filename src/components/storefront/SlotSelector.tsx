import React from 'react';
import { TimeSlot } from '../../types/domain';
import { SlotButtonSkeleton } from '../common/Skeleton';
import { Clock, Check, Lock } from 'lucide-react';

interface SlotSelectorProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <SlotButtonSkeleton />
        <SlotButtonSkeleton />
        <SlotButtonSkeleton />
        <SlotButtonSkeleton />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F4EFE6]/60 border border-[#E8E0D2] rounded-2xl text-[#2C3E2D]/70">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="font-serif text-lg font-semibold text-[#1B2B1C]">No hay turnos disponibles</p>
        <p className="text-sm mt-1">Para esta fecha no se encuentran bloques horarios habilitados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map(slot => {
        const isSelected = selectedSlotId === slot.id;
        const isAvailable = slot.status === 'AVAILABLE';

        let statusText = '';
        let buttonStyle = '';

        switch (slot.status) {
          case 'AVAILABLE':
            buttonStyle = isSelected
              ? 'bg-[#2C3E2D] text-[#FAF7F2] border-[#2C3E2D] ring-2 ring-[#2C3E2D]/40'
              : 'bg-[#FAF7F2] text-[#2C3E2D] border-[#6E8B68]/30 hover:border-[#2C3E2D] hover:bg-[#F4EFE6]';
            break;
          case 'PENDING_DEPOSIT':
            buttonStyle = 'bg-[#F9F2E7] text-[#8C6126] border-[#C29352]/40 opacity-75 cursor-not-allowed';
            statusText = 'En espera de seña';
            break;
          case 'CONFIRMED':
            buttonStyle = 'bg-[#EBF0EA] text-[#2C3E2D]/70 border-[#2C3E2D]/20 opacity-60 cursor-not-allowed';
            statusText = 'Turno Confirmado';
            break;
          case 'BLOCKED':
            buttonStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-50 cursor-not-allowed';
            statusText = 'No disponible';
            break;
        }

        return (
          <button
            key={slot.id}
            type="button"
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelectSlot(slot)}
            aria-label={`Horario ${slot.startTime} a ${slot.endTime} ${statusText ? `(${statusText})` : 'Disponible'}`}
            className={`min-h-[48px] px-3 py-2 rounded-2xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center touch-target select-none ${buttonStyle}`}
          >
            <div className="flex items-center gap-1.5">
              <span>{slot.startTime} - {slot.endTime}</span>
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {slot.status === 'BLOCKED' && <Lock className="w-3.5 h-3.5" />}
            </div>
            {statusText && (
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-80 mt-0.5">
                {statusText}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
