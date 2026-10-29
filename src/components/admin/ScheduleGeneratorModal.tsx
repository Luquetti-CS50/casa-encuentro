import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Specialist, ScheduleDay, TimeSlot } from '../../types/domain';
import { generateDeterministicSlots, timeToMinutes } from '../../services/scheduleCalculator';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface ScheduleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialists: Specialist[];
  existingSlots: TimeSlot[];
  onSaveSchedule: (scheduleDay: ScheduleDay, slots: TimeSlot[]) => void;
}

export const ScheduleGeneratorModal: React.FC<ScheduleGeneratorModalProps> = ({
  isOpen,
  onClose,
  specialists,
  existingSlots,
  onSaveSchedule,
}) => {
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(specialists[0]?.id || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('14:00');
  const [slotDuration, setSlotDuration] = useState(60);
  const [interval, setInterval] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Previsualización en tiempo real del cálculo determinístico
  const previewSlots = useMemo(() => {
    if (!selectedSpecialistId || !date || !startTime || !endTime) return [];
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) return [];

    const tempDay: ScheduleDay = {
      id: `sch-temp-${Date.now()}`,
      specialistId: selectedSpecialistId,
      date,
      startTime,
      endTime,
      slotIntervalMinutes: slotDuration,
      isActive: true,
    };

    return generateDeterministicSlots({
      scheduleDay: tempDay,
      slotDurationMinutes: Number(slotDuration),
      intervalMinutes: Number(interval),
      existingSlots,
    });
  }, [selectedSpecialistId, date, startTime, endTime, slotDuration, interval, existingSlots]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (previewSlots.length === 0) {
      setFeedback({
        type: 'error',
        message: 'La ventana horaria configurada no permite generar ningún turno válido.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const scheduleDay: ScheduleDay = {
        id: `sch-${selectedSpecialistId}-${date}`,
        specialistId: selectedSpecialistId,
        date,
        startTime,
        endTime,
        slotIntervalMinutes: Number(slotDuration),
        isActive: true,
      };

      onSaveSchedule(scheduleDay, previewSlots);
      setIsSubmitting(false);
      setFeedback({
        type: 'success',
        message: `¡Se generaron ${previewSlots.length} turnos con éxito para esta jornada!`,
      });
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1000);
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generador Determinístico de Grilla"
      subtitle="Crea los bloques horarios automáticamente evitando solapamientos"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Especialista */}
        <div>
          <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
            Profesional / Terapeuta
          </label>
          <select
            value={selectedSpecialistId}
            onChange={e => setSelectedSpecialistId(e.target.value)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
          >
            {specialists.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.title})
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
            Fecha de Atención
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] focus:ring-2 focus:ring-[#2C3E2D]/20 outline-none text-base text-[#1B2B1C]"
          />
        </div>

        {/* Franja Horaria: Inicio y Fin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
              Hora Inicio
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-base text-[#1B2B1C]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
              Hora Fin
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-base text-[#1B2B1C]"
            />
          </div>
        </div>

        {/* Duración del turno e Intervalo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
              Duración Turno (min)
            </label>
            <select
              value={slotDuration}
              onChange={e => setSlotDuration(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-base text-[#1B2B1C]"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos (1 hora)</option>
              <option value={90}>90 minutos</option>
              <option value={120}>120 minutos (2 horas)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1B2B1C] mb-1">
              Descanso entre turnos
            </label>
            <select
              value={interval}
              onChange={e => setInterval(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-base text-[#1B2B1C]"
            >
              <option value={0}>Sin descanso (0 min)</option>
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
            </select>
          </div>
        </div>

        {/* Previsualización de cálculo determinístico */}
        <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#1B2B1C]">Turnos calculados matemáticamente:</span>
            <span className="font-bold text-lg text-[#3D5A40] font-serif">
              {previewSlots.length} bloques
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {previewSlots.map(s => (
              <span
                key={s.startTime}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E0D2] text-[#2C3E2D] font-mono font-medium"
              >
                {s.startTime} - {s.endTime}
              </span>
            ))}
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl text-sm flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-[#EBF0EA] text-[#233524] border border-[#6E8B68]/30'
                : 'bg-[#FBEBE7] text-[#A64A32] border border-[#D97D64]/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E0D2]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold px-6"
          >
            Generar y Habilitar Turnos
          </Button>
        </div>
      </form>
    </Modal>
  );
};
