import { TimeSlot, ScheduleDay } from '../types/domain';

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export interface GenerateSlotsParams {
  scheduleDay: ScheduleDay;
  slotDurationMinutes: number;
  intervalMinutes?: number;
  existingSlots?: TimeSlot[];
}

/**
 * Genera determinísticamente los bloques horarios sin solapamientos
 * Cumple con la fórmula: Slots = floor((HoraFin - HoraInicio) / (Duracion + Intervalo))
 */
export function generateDeterministicSlots({
  scheduleDay,
  slotDurationMinutes,
  intervalMinutes = 0,
  existingSlots = [],
}: GenerateSlotsParams): TimeSlot[] {
  const startMin = timeToMinutes(scheduleDay.startTime);
  const endMin = timeToMinutes(scheduleDay.endTime);
  const totalWindow = endMin - startMin;

  if (totalWindow <= 0 || slotDurationMinutes <= 0) {
    return [];
  }

  const step = slotDurationMinutes + intervalMinutes;
  const slotCount = Math.floor(totalWindow / (step > 0 ? step : slotDurationMinutes));

  const generated: TimeSlot[] = [];

  for (let i = 0; i < slotCount; i++) {
    const slotStart = startMin + i * step;
    const slotEnd = slotStart + slotDurationMinutes;

    if (slotEnd > endMin) break;

    const startTimeFormatted = minutesToTime(slotStart);
    const endTimeFormatted = minutesToTime(slotEnd);

    // Verificar si ya existe un slot para este especialista, fecha y hora
    const duplicate = existingSlots.find(
      s => s.specialistId === scheduleDay.specialistId &&
           s.date === scheduleDay.date &&
           s.startTime === startTimeFormatted
    );

    if (duplicate) {
      generated.push(duplicate);
    } else {
      generated.push({
        id: `slot-${scheduleDay.specialistId}-${scheduleDay.date}-${startTimeFormatted.replace(':', '')}`,
        scheduleDayId: scheduleDay.id,
        specialistId: scheduleDay.specialistId,
        date: scheduleDay.date,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        status: 'AVAILABLE',
      });
    }
  }

  return generated;
}

/**
 * Valida si un nuevo bloque horario genera solapamiento con los existentes
 */
export function hasSlotCollision(
  newSlot: Pick<TimeSlot, 'specialistId' | 'date' | 'startTime' | 'endTime'>,
  existingSlots: TimeSlot[],
  excludeSlotId?: string
): boolean {
  const newStart = timeToMinutes(newSlot.startTime);
  const newEnd = timeToMinutes(newSlot.endTime);

  return existingSlots.some(slot => {
    if (excludeSlotId && slot.id === excludeSlotId) return false;
    if (slot.specialistId !== newSlot.specialistId || slot.date !== newSlot.date) return false;

    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);

    // Hay colisión si los intervalos se intersecan
    return Math.max(newStart, slotStart) < Math.min(newEnd, slotEnd);
  });
}
