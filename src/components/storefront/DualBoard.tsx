import React, { useState, useMemo } from 'react';
import {
  Specialist,
  Service,
  TimeSlot,
  SiteSettings,
  ExplorationMode,
  Booking,
} from '../../types/domain';
import { SpecialistCard } from './SpecialistCard';
import { SlotSelector } from './SlotSelector';
import { BookingModal } from './BookingModal';
import { SpecialistCardSkeleton } from '../common/Skeleton';
import { Users, CalendarDays, Clock, Sparkles, Search, X } from 'lucide-react';

interface DualBoardProps {
  specialists: Specialist[];
  services: Service[];
  timeSlots: TimeSlot[];
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

export const DualBoard: React.FC<DualBoardProps> = ({
  specialists,
  services,
  timeSlots,
  settings,
  onRequestBooking,
}) => {
  const [mode, setMode] = useState<ExplorationMode>('specialist');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeSymptomId, setActiveSymptomId] = useState<string>('sym-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBookingSlot, setActiveBookingSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);

  // Solo mostrar especialistas activos en la tienda pública
  const activeSpecialists = useMemo(
    () => specialists.filter(s => s.isActive),
    [specialists]
  );

  // Solo mostrar servicios activos
  const activeServices = useMemo(
    () => services.filter(s => s.isActive),
    [services]
  );

  // Filtrar especialistas por síntoma / palabra clave o búsqueda libre
  const filteredSpecialists = useMemo(() => {
    const symptomFilter = settings.symptomFilters.find(f => f.id === activeSymptomId);
    const keywords = symptomFilter?.keywords || [];
    const q = searchQuery.trim().toLowerCase();

    return activeSpecialists.filter(spec => {
      const specServices = activeServices.filter(s => s.specialistId === spec.id);
      const searchableBlob = [
        spec.name,
        spec.title,
        spec.bio,
        ...spec.specialtyTags,
        ...specServices.map(s => `${s.title} ${s.description}`),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSymptom =
        keywords.length === 0 || keywords.some(kw => searchableBlob.includes(kw.toLowerCase()));
      const matchesSearch = !q || searchableBlob.includes(q);

      return matchesSymptom && matchesSearch;
    });
  }, [activeSpecialists, activeServices, settings.symptomFilters, activeSymptomId, searchQuery]);

  // Lista única de fechas ordenadas cronológicamente (solo de especialistas activos)
  const uniqueDates = useMemo(() => {
    const activeIds = new Set(activeSpecialists.map(s => s.id));
    const dates = Array.from(
      new Set(timeSlots.filter(s => activeIds.has(s.specialistId)).map(s => s.date))
    ).sort();
    return dates;
  }, [timeSlots, activeSpecialists]);

  // Inicializar fecha seleccionada con la primera disponible si no hay ninguna
  React.useEffect(() => {
    if (uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  // Cambiar de modo con micro-transición skeleton para demostrar la lógica sin saltos de pantalla
  const handleModeChange = (newMode: ExplorationMode) => {
    if (newMode === mode) return;
    setIsSimulatedLoading(true);
    setMode(newMode);
    setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 220);
  };

  // Especialista activo en vista detalle
  const currentSpecialist = useMemo(() => {
    if (selectedSpecialistId) {
      return activeSpecialists.find(s => s.id === selectedSpecialistId) || null;
    }
    return null;
  }, [selectedSpecialistId, activeSpecialists]);

  // Turnos filtrados para el especialista seleccionado
  const specialistSlots = useMemo(() => {
    if (!selectedSpecialistId) return [];
    return timeSlots.filter(s => s.specialistId === selectedSpecialistId);
  }, [selectedSpecialistId, timeSlots]);

  // Agrupación de turnos del especialista por fecha
  const specialistSlotsByDate = useMemo(() => {
    const map: { [date: string]: TimeSlot[] } = {};
    specialistSlots.forEach(slot => {
      if (!map[slot.date]) map[slot.date] = [];
      map[slot.date].push(slot);
    });
    Object.keys(map).forEach(d => {
      map[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return map;
  }, [specialistSlots]);

  // Turnos filtrados para el modo cronológico por fecha
  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    const activeIds = new Set(filteredSpecialists.map(s => s.id));
    return timeSlots
      .filter(s => s.date === selectedDate && activeIds.has(s.specialistId))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, timeSlots, filteredSpecialists]);

  // Agrupación de turnos de la fecha por especialista
  const dateSlotsBySpecialist = useMemo(() => {
    const map: { [specId: string]: TimeSlot[] } = {};
    dateSlots.forEach(slot => {
      if (!map[slot.specialistId]) map[slot.specialistId] = [];
      map[slot.specialistId].push(slot);
    });
    return map;
  }, [dateSlots]);

  const handleOpenBooking = (slot: TimeSlot) => {
    setActiveBookingSlot(slot);
    setIsModalOpen(true);
  };

  return (
    <section id="cartelera-turnos" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 scroll-mt-16">
      {/* Título de la Sección */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE5D8] text-[#2C3E2D] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#3D5A40]" />
          <span>Agenda & Turnos Online</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B2B1C]">
          Cartelera Interactiva
        </h2>
        <p className="text-sm sm:text-base text-[#2C3E2D]/80 font-sans leading-relaxed">
          Elige la modalidad de reserva que prefieras: explora por especialista, filtra según tu dolencia o consulta los horarios por fecha.
        </p>
      </div>

      {/* Selector Dual de Navegación (Tabs Accesibles de 48px) */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div
          role="tablist"
          aria-label="Modo de exploración de turnos"
          className="inline-flex p-1.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] shadow-inner max-w-md w-full"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'specialist'}
            onClick={() => handleModeChange('specialist')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 touch-target cursor-pointer ${
              mode === 'specialist'
                ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-sm font-semibold'
                : 'text-[#2C3E2D]/70 hover:text-[#1B2B1C] hover:bg-[#FAF7F2]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Por Especialista</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'date'}
            onClick={() => handleModeChange('date')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 touch-target cursor-pointer ${
              mode === 'date'
                ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-sm font-semibold'
                : 'text-[#2C3E2D]/70 hover:text-[#1B2B1C] hover:bg-[#FAF7F2]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Por Fecha</span>
          </button>
        </div>
      </div>

      {/* Filtro Inteligente de Calidad de Vida (QoL): "¿Qué buscas aliviar o trabajar hoy?" */}
      {!selectedSpecialistId && (
        <div className="zen-card bg-[#F4EFE6]/80 border border-[#E8E0D2] rounded-3xl p-4 sm:p-6 mb-6 sm:mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label
                htmlFor="symptom-search"
                className="block text-xs font-bold uppercase tracking-wider text-[#3D5A40]"
              >
                ¿Qué buscas aliviar o armonizar hoy?
              </label>
              <p className="text-xs text-[#2C3E2D]/75 mt-0.5">
                Selecciona una necesidad o escribe un síntoma para encontrar la práctica ideal
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C3E2D]/50" />
              <input
                id="symptom-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ej. ciático, bruxismo, yoga..."
                className="w-full min-h-[48px] pl-10 pr-9 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#2C3E2D]/60 hover:text-[#1B2B1C] min-h-0 min-w-0"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Píldoras de Síntoma / Necesidad: scroll horizontal en mobile para ahorrar altura vertical */}
          <div className="flex overflow-x-auto pb-1.5 sm:pb-0 gap-2 no-scrollbar sm:flex-wrap">
            {settings.symptomFilters.map(filter => {
              const isSelected = activeSymptomId === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveSymptomId(filter.id)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
                    isSelected
                      ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2C3E2D] border border-[#E8E0D2] hover:bg-[#DCE5D8]/50'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="sr-only" aria-live="polite">
            Mostrando {filteredSpecialists.length} profesionales recomendados.
          </div>
        </div>
      )}

      {/* MODO 1: EXPLORACIÓN POR ESPECIALISTA Y PRÁCTICA */}
      {mode === 'specialist' && (
        <div className="space-y-8">
          {selectedSpecialistId ? (
            /* Vista de detalle del terapeuta y sus fechas/turnos */
            <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-sm">
              <button
                type="button"
                onClick={() => setSelectedSpecialistId(null)}
                className="touch-target inline-flex items-center gap-2 text-sm font-bold text-[#3D5A40] hover:text-[#1B2B1C] mb-6 px-4 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#DCE5D8]/60 transition-colors cursor-pointer"
              >
                &larr; Volver a todos los especialistas
              </button>

              {currentSpecialist && (
                <div className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-[#E8E0D2]">
                  <img
                    src={currentSpecialist.avatarUrl}
                    alt={currentSpecialist.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#FAF7F2] shadow-sm flex-shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-serif font-bold text-[#1B2B1C]">
                      {currentSpecialist.name}
                    </h3>
                    <p className="text-base text-[#3D5A40] font-medium">
                      {currentSpecialist.title}
                    </p>
                    <p className="text-sm text-[#2C3E2D]/85 leading-relaxed max-w-3xl">
                      {currentSpecialist.bio}
                    </p>

                    {/* Tarjetas de prácticas del especialista con precios y señas */}
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeServices
                        .filter(s => s.specialistId === currentSpecialist.id)
                        .map(srv => (
                          <div
                            key={srv.id}
                            className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-bold text-[#1B2B1C]">{srv.title}</p>
                              <p className="text-xs text-[#2C3E2D]/70">{srv.durationMinutes} min</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#1B2B1C]">
                                ${srv.price.toLocaleString('es-AR')}
                              </p>
                              <p className="text-[11px] font-semibold text-[#C29352]">
                                Seña{' '}
                                {srv.depositType === 'fixed'
                                  ? `$${srv.depositValue.toLocaleString('es-AR')}`
                                  : `${srv.depositValue}%`}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Días y Horarios Disponibles */}
              <div className="mt-8 space-y-8">
                <h4 className="text-lg font-serif font-bold text-[#1B2B1C] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#3D5A40]" />
                  <span>Jornadas y Horarios de Atención (toca un horario disponible para reservar):</span>
                </h4>

                {Object.keys(specialistSlotsByDate).length === 0 ? (
                  <div className="p-8 text-center bg-[#F4EFE6] rounded-2xl border border-[#E8E0D2]">
                    <p className="text-base font-semibold text-[#1B2B1C]">
                      No hay fechas programadas actualmente para este profesional.
                    </p>
                    <p className="text-sm text-[#2C3E2D]/70 mt-1">
                      Por favor consulta nuevamente más tarde o comunícate vía WhatsApp.
                    </p>
                  </div>
                ) : (
                  Object.entries(specialistSlotsByDate).map(([date, slots]) => {
                    const formatted = new Date(`${date}T00:00:00`).toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    });

                    return (
                      <div
                        key={date}
                        className="bg-[#F4EFE6]/70 rounded-2xl p-5 border border-[#E8E0D2] space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-[#E8E0D2] pb-3">
                          <span className="font-serif font-bold text-lg text-[#1B2B1C] capitalize">
                            {formatted} ({date})
                          </span>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCE5D8] text-[#2C3E2D]">
                            {slots.filter(s => s.status === 'AVAILABLE').length} disponibles
                          </span>
                        </div>

                        <SlotSelector slots={slots} onSelectSlot={handleOpenBooking} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Cuadrícula de tarjetas de terapeutas (con soporte de Skeletons) */
            <div>
              {filteredSpecialists.length === 0 ? (
                <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E8E0D2]">
                  <p className="text-lg font-serif font-bold text-[#1B2B1C]">
                    No encontramos prácticas que coincidan con ese filtro
                  </p>
                  <p className="text-sm text-[#2C3E2D]/70 mt-1">
                    Intenta limpiar el buscador o seleccionar "Todas las prácticas".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSymptomId('sym-all');
                      setSearchQuery('');
                    }}
                    className="mt-4 touch-target inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-[#2C3E2D] text-[#FAF7F2] text-xs font-bold"
                  >
                    Ver todos los profesionales
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isSimulatedLoading ? (
                    <>
                      <SpecialistCardSkeleton />
                      <SpecialistCardSkeleton />
                      <SpecialistCardSkeleton />
                    </>
                  ) : (
                    filteredSpecialists.map(specialist => {
                      const specServices = activeServices.filter(
                        s => s.specialistId === specialist.id
                      );
                      const nextAvail = timeSlots
                        .filter(s => s.specialistId === specialist.id && s.status === 'AVAILABLE')
                        .sort((a, b) => {
                          const dCmp = a.date.localeCompare(b.date);
                          return dCmp !== 0 ? dCmp : a.startTime.localeCompare(b.startTime);
                        })[0];

                      return (
                        <SpecialistCard
                          key={specialist.id}
                          specialist={specialist}
                          services={specServices}
                          nextAvailableSlot={nextAvail}
                          onSelect={() => setSelectedSpecialistId(specialist.id)}
                          onQuickBookSlot={handleOpenBooking}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODO 2: EXPLORACIÓN CRONOLÓGICA POR FECHA */}
      {mode === 'date' && (
        <div className="space-y-8">
          {/* Selector Horizontal de Fechas */}
          <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-semibold uppercase tracking-wider text-[#3D5A40] mb-3">
              Selecciona una fecha en el calendario:
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {uniqueDates.map(d => {
                const isSelected = d === selectedDate;
                const dObj = new Date(`${d}T00:00:00`);
                const weekday = dObj.toLocaleDateString('es-AR', { weekday: 'short' });
                const dayNum = dObj.getDate();
                const monthName = dObj.toLocaleDateString('es-AR', { month: 'short' });
                const freeCount = timeSlots.filter(
                  s => s.date === d && s.status === 'AVAILABLE'
                ).length;

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`min-h-[72px] min-w-[112px] px-4 py-3 rounded-2xl border text-center transition-all duration-200 touch-target flex flex-col items-center justify-center flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C3E2D] text-[#FAF7F2] border-[#2C3E2D] shadow-md'
                        : 'bg-[#F4EFE6] text-[#2C3E2D] border-[#E8E0D2] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                      {weekday}
                    </span>
                    <span className="text-xl font-bold font-serif leading-none my-1">
                      {dayNum} {monthName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]'
                          : 'bg-[#DCE5D8] text-[#2C3E2D]'
                      }`}
                    >
                      {freeCount} libres
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grilla de turnos para la fecha seleccionada agrupados por especialista */}
          <div className="space-y-6">
            {Object.keys(dateSlotsBySpecialist).length === 0 ? (
              <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E8E0D2]">
                <Clock className="w-10 h-10 mx-auto text-[#2C3E2D]/40 mb-3" />
                <p className="text-lg font-serif font-bold text-[#1B2B1C]">
                  No hay atención programada para esta fecha con el filtro actual
                </p>
                <p className="text-sm text-[#2C3E2D]/70 mt-1">
                  Por favor selecciona otro día en la barra superior o limpia los filtros.
                </p>
              </div>
            ) : (
              Object.entries(dateSlotsBySpecialist).map(([specId, slots]) => {
                const spec = activeSpecialists.find(s => s.id === specId);

                return (
                  <div
                    key={specId}
                    className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D2]">
                      <div className="flex items-center gap-4">
                        {spec?.avatarUrl && (
                          <img
                            src={spec.avatarUrl}
                            alt={spec.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-[#E8E0D2] shadow-sm"
                          />
                        )}
                        <div>
                          <h4 className="text-xl font-serif font-bold text-[#1B2B1C]">
                            {spec?.name}
                          </h4>
                          <p className="text-xs text-[#3D5A40] font-semibold uppercase tracking-wider">
                            {spec?.title}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#DCE5D8] text-[#2C3E2D] self-start sm:self-center">
                        {slots.filter(s => s.status === 'AVAILABLE').length} turnos disponibles
                      </span>
                    </div>

                    {/* Selector de Horarios */}
                    <SlotSelector slots={slots} onSelectSlot={handleOpenBooking} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal de Reserva con Bloqueo Preventivo y Pago de Seña */}
      {activeBookingSlot && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveBookingSlot(null);
          }}
          slot={activeBookingSlot}
          specialist={specialists.find(s => s.id === activeBookingSlot.specialistId) || null}
          services={activeServices.filter(s => s.specialistId === activeBookingSlot.specialistId)}
          settings={settings}
          onRequestBooking={onRequestBooking}
        />
      )}
    </section>
  );
};
