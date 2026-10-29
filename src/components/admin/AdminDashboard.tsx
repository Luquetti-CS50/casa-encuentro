import React, { useState, useMemo } from 'react';
import {
  Specialist,
  Service,
  ScheduleDay,
  TimeSlot,
  Booking,
  SiteSettings,
  SlotStatus,
} from '../../types/domain';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { DailyRunSheetModal } from './DailyRunSheetModal';
import { ScheduleGeneratorModal } from './ScheduleGeneratorModal';
import { SettingsModal } from './SettingsModal';
import { ManualBookingModal } from './ManualBookingModal';
import { SpecialistsManager } from './SpecialistsManager';
import { ServicesManager } from './ServicesManager';
import { ContentAndSettingsManager } from './ContentAndSettingsManager';
import {
  Calendar,
  Check,
  X,
  Send,
  Plus,
  Settings,
  FileSpreadsheet,
  Search,
  UserCheck,
  AlertCircle,
  Clock,
  ArrowLeft,
  Lock,
  Unlock,
  Users,
  Sparkles,
  Sliders,
  Trash2,
} from 'lucide-react';

export type AdminTabId = 'turnos' | 'profesionales' | 'practicas' | 'contenido';

interface AdminDashboardProps {
  specialists: Specialist[];
  services: Service[];
  scheduleDays: ScheduleDay[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  settings: SiteSettings;
  onConfirmDeposit: (bookingId: string) => void;
  onReleaseSlot: (bookingId: string, reason?: string) => void;
  onUpdateSlotStatus: (slotId: string, status: SlotStatus, notes?: string) => void;
  onDeleteSlot: (slotId: string) => void;
  onSaveSchedule: (scheduleDay: ScheduleDay, slots: TimeSlot[]) => void;
  onSaveSpecialist: (specialist: Specialist) => void;
  onDeleteSpecialist: (id: string) => void;
  onReorderSpecialist: (id: string, direction: 'up' | 'down') => void;
  onSaveService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onExportBackup: () => string;
  onImportBackup: (rawJson: string) => { success: boolean; error?: string };
  onResetSeeds: () => void;
  onRequestBooking: (data: {
    timeSlotId: string;
    specialistId: string;
    serviceId: string;
    patientName: string;
    patientPhone: string;
    patientNotes?: string;
    depositVerified: boolean;
  }) => void;
  onBackToStorefront: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  specialists,
  services,
  timeSlots,
  bookings,
  settings,
  onConfirmDeposit,
  onReleaseSlot,
  onUpdateSlotStatus,
  onDeleteSlot,
  onSaveSchedule,
  onSaveSpecialist,
  onDeleteSpecialist,
  onReorderSpecialist,
  onSaveService,
  onDeleteService,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onResetSeeds,
  onRequestBooking,
  onBackToStorefront,
}) => {
  // Pestaña modular activa
  const [activeTab, setActiveTab] = useState<AdminTabId>('turnos');

  // Modales rápidos
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);

  // Filtros de tabla de turnos
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fechas únicas para selector
  const uniqueDates = useMemo(() => {
    return Array.from(new Set(timeSlots.map(s => s.date))).sort();
  }, [timeSlots]);

  // Selección activa para la hoja de ruta
  const runSheetSpecialist = useMemo(() => {
    if (selectedSpecialistId !== 'all') {
      return specialists.find(s => s.id === selectedSpecialistId) || specialists[0];
    }
    return specialists[0];
  }, [selectedSpecialistId, specialists]);

  const runSheetDate = useMemo(() => {
    if (selectedDate !== 'all') return selectedDate;
    return uniqueDates[0] || new Date().toISOString().split('T')[0];
  }, [selectedDate, uniqueDates]);

  // Métricas Clave de Coordinación
  const metrics = useMemo(() => {
    const totalSlots = timeSlots.length;
    const pendingSlots = timeSlots.filter(s => s.status === 'PENDING_DEPOSIT').length;
    const confirmedSlots = timeSlots.filter(s => s.status === 'CONFIRMED').length;
    const availableSlots = timeSlots.filter(s => s.status === 'AVAILABLE').length;

    return { totalSlots, pendingSlots, confirmedSlots, availableSlots };
  }, [timeSlots]);

  // Filtrado de Turnos
  const filteredSlots = useMemo(() => {
    return timeSlots
      .filter(slot => {
        if (selectedSpecialistId !== 'all' && slot.specialistId !== selectedSpecialistId)
          return false;
        if (selectedDate !== 'all' && slot.date !== selectedDate) return false;
        if (selectedStatus !== 'all' && slot.status !== selectedStatus) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const booking = bookings.find(b => b.timeSlotId === slot.id);
          const spec = specialists.find(s => s.id === slot.specialistId);

          const matchName = booking?.patientName.toLowerCase().includes(query);
          const matchPhone = booking?.patientPhone.includes(query);
          const matchSpec = spec?.name.toLowerCase().includes(query);

          if (!matchName && !matchPhone && !matchSpec) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [
    timeSlots,
    bookings,
    specialists,
    selectedSpecialistId,
    selectedDate,
    selectedStatus,
    searchQuery,
  ]);

  // Disparador de Recordatorio al Paciente (WhatsApp)
  const handleSendReminder = (booking: Booking, slot: TimeSlot) => {
    const spec = specialists.find(s => s.id === slot.specialistId);
    const service = services.find(s => s.id === booking.serviceId);
    const formattedDate = new Date(`${slot.date}T00:00:00`).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const reminderMsg =
      `¡Hola ${booking.patientName}! Te escribimos desde ${settings.businessName} para recordarte tu turno confirmado:\n` +
      `🌿 Terapeuta: ${spec?.name}\n` +
      `✨ Práctica: ${service?.title || 'Sesión'}\n` +
      `📅 Fecha: ${formattedDate}\n` +
      `⏰ Horario: ${slot.startTime} hs\n` +
      `📍 Dirección: ${settings.address}\n\n` +
      `¡Te esperamos con el espacio listo para tu sesión!`;

    const phoneClean = booking.patientPhone.replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${phoneClean}?text=${encodeURIComponent(reminderMsg)}`,
      '_blank'
    );
  };

  const availableSlotsList = useMemo(() => {
    return timeSlots.filter(s => s.status === 'AVAILABLE');
  }, [timeSlots]);

  // Calcular minutos transcurridos desde el bloqueo preventivo (PENDING_DEPOSIT)
  const getLockedMinutesAgo = (lockedAt?: string): number | null => {
    if (!lockedAt) return null;
    const diffMs = Date.now() - new Date(lockedAt).getTime();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E2D] pb-16">
      {/* Top Navbar del Panel */}
      <nav className="bg-[#FAF7F2]/95 border-b border-[#E8E0D2] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToStorefront}
              className="touch-target inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[#2C3E2D] hover:bg-[#F4EFE6] border border-[#E8E0D2] transition-colors cursor-pointer"
              title="Volver a la vista pública de Casa Encuentro"
            >
              <ArrowLeft className="w-4 h-4 text-[#3D5A40]" />
              <span className="text-xs sm:text-sm font-bold">Sitio Público</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-[#E8E0D2]" />

            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover border border-[#E8E0D2]"
              />
              <div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-[#1B2B1C] leading-none">
                  {settings.businessName}
                </h1>
                <p className="text-[11px] uppercase tracking-wider text-[#6E8B68] font-bold mt-0.5">
                  Centro de Coordinación Modular
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunSheetOpen(true)}
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#3D5A40]" />}
              className="hidden lg:inline-flex text-xs font-semibold"
            >
              Hoja de Ruta Diaria
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsManualBookingOpen(true)}
              leftIcon={<Plus className="w-4 h-4 text-[#3D5A40]" />}
              className="hidden sm:inline-flex text-xs font-semibold"
            >
              Turno Manual
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsGeneratorOpen(true)}
              leftIcon={<Calendar className="w-4 h-4" />}
              className="text-xs font-bold shadow-sm"
            >
              Generar Jornada
            </Button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="touch-target p-2.5 rounded-xl border border-[#E8E0D2] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#2C3E2D] transition-colors cursor-pointer"
              title="Ajustes rápidos del establecimiento"
              aria-label="Abrir modal de ajustes rápidos"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Navegación Modular por Pestañas */}
        <div className="bg-[#F4EFE6]/90 border-t border-[#E8E0D2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
            {(
              [
                {
                  id: 'turnos',
                  label: '1. Agenda y Turnos',
                  badge: metrics.pendingSlots > 0 ? `${metrics.pendingSlots} pendientes` : undefined,
                  icon: <Calendar className="w-4 h-4" />,
                },
                {
                  id: 'profesionales',
                  label: '2. Profesionales (+ Agregar / Editar)',
                  badge: `${specialists.length}`,
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  id: 'practicas',
                  label: '3. Prácticas y Tarifas',
                  badge: `${services.length}`,
                  icon: <Sparkles className="w-4 h-4" />,
                },
                {
                  id: 'contenido',
                  label: '4. Contenido Web, Patologías y Backup',
                  icon: <Sliders className="w-4 h-4" />,
                },
              ] as {
                id: AdminTabId;
                label: string;
                badge?: string;
                icon: React.ReactNode;
              }[]
            ).map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[46px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-xs'
                      : 'text-[#2C3E2D]/80 hover:bg-[#FAF7F2] hover:text-[#1B2B1C]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]'
                          : 'bg-[#DCE5D8] text-[#1B2B1C]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* PESTAÑA 1: AGENDA Y TURNOS */}
        {activeTab === 'turnos' && (
          <>
            {/* Tarjetas de Métricas Interactivas (Clic para filtrar rápido) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`text-left zen-card bg-[#FAF7F2] border rounded-2xl p-5 shadow-2xs transition-all cursor-pointer ${
                  selectedStatus === 'all'
                    ? 'border-[#2C3E2D] ring-2 ring-[#2C3E2D]/15'
                    : 'border-[#E8E0D2] hover:border-[#6E8B68]'
                }`}
              >
                <div className="flex items-center justify-between text-[#2C3E2D]/70 text-xs font-semibold uppercase tracking-wider">
                  <span>Total de Turnos</span>
                  <Clock className="w-4 h-4 text-[#3D5A40]" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#1B2B1C]">
                    {metrics.totalSlots}
                  </span>
                  <span className="text-xs text-[#2C3E2D]/60 font-medium">ver todos</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === 'PENDING_DEPOSIT' ? 'all' : 'PENDING_DEPOSIT'
                  )
                }
                className={`text-left zen-card bg-[#F9F2E7] border rounded-2xl p-5 shadow-2xs transition-all cursor-pointer ${
                  selectedStatus === 'PENDING_DEPOSIT'
                    ? 'border-[#C29352] ring-2 ring-[#C29352]/30'
                    : 'border-[#C29352]/40 hover:border-[#C29352]'
                }`}
              >
                <div className="flex items-center justify-between text-[#8C6126] text-xs font-semibold uppercase tracking-wider">
                  <span>Esperando Seña</span>
                  <AlertCircle className="w-4 h-4 text-[#C29352]" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#8C6126]">
                    {metrics.pendingSlots}
                  </span>
                  <span className="text-xs text-[#8C6126]/80 font-medium">filtrar pendientes</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedStatus(selectedStatus === 'CONFIRMED' ? 'all' : 'CONFIRMED')
                }
                className={`text-left zen-card bg-[#EBF0EA] border rounded-2xl p-5 shadow-2xs transition-all cursor-pointer ${
                  selectedStatus === 'CONFIRMED'
                    ? 'border-[#3D5A40] ring-2 ring-[#3D5A40]/25'
                    : 'border-[#6E8B68]/40 hover:border-[#3D5A40]'
                }`}
              >
                <div className="flex items-center justify-between text-[#233524] text-xs font-semibold uppercase tracking-wider">
                  <span>Confirmados</span>
                  <UserCheck className="w-4 h-4 text-[#3D5A40]" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#233524]">
                    {metrics.confirmedSlots}
                  </span>
                  <span className="text-xs text-[#233524]/80 font-medium">seña validada</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedStatus(selectedStatus === 'AVAILABLE' ? 'all' : 'AVAILABLE')
                }
                className={`text-left zen-card bg-[#FAF7F2] border rounded-2xl p-5 shadow-2xs transition-all cursor-pointer ${
                  selectedStatus === 'AVAILABLE'
                    ? 'border-[#2C3E2D] ring-2 ring-[#2C3E2D]/15'
                    : 'border-[#E8E0D2] hover:border-[#6E8B68]'
                }`}
              >
                <div className="flex items-center justify-between text-[#2C3E2D]/70 text-xs font-semibold uppercase tracking-wider">
                  <span>Disponibles</span>
                  <Calendar className="w-4 h-4 text-[#6E8B68]" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#1B2B1C]">
                    {metrics.availableSlots}
                  </span>
                  <span className="text-xs text-[#2C3E2D]/60 font-medium">libres</span>
                </div>
              </button>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Buscador de Paciente */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C3E2D]/50" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre de paciente, teléfono o terapeuta..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
                  />
                </div>

                {/* Selectores de Filtrado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={selectedSpecialistId}
                    onChange={e => setSelectedSpecialistId(e.target.value)}
                    aria-label="Filtrar por terapeuta"
                    className="min-h-[48px] px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-semibold text-[#1B2B1C] outline-none"
                  >
                    <option value="all">Todos los Terapeutas</option>
                    {specialists.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    aria-label="Filtrar por fecha"
                    className="min-h-[48px] px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-semibold text-[#1B2B1C] outline-none"
                  >
                    <option value="all">Todas las Fechas</option>
                    {uniqueDates.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    aria-label="Filtrar por estado"
                    className="min-h-[48px] px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-semibold text-[#1B2B1C] outline-none"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="PENDING_DEPOSIT">Esperando Seña (⏳)</option>
                    <option value="CONFIRMED">Confirmados (✅)</option>
                    <option value="AVAILABLE">Disponibles (🌿)</option>
                    <option value="BLOCKED">Bloqueados (🔒)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tablero Operativo de Turnos */}
            <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#E8E0D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F4EFE6]/70">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#1B2B1C]">
                    Turnos Programados ({filteredSlots.length})
                  </h2>
                  <p className="text-xs text-[#2C3E2D]/70 mt-0.5">
                    Acciones de 1 clic para aprobar señas, liberar horarios o enviar recordatorios.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('profesionales')}
                    leftIcon={<Users className="w-3.5 h-3.5 text-[#3D5A40]" />}
                    className="text-xs font-semibold"
                  >
                    + Gestionar Profesionales
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRunSheetOpen(true)}
                    leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#3D5A40]" />}
                    className="text-xs font-semibold"
                  >
                    Exportar Hoja de Ruta
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E0D2] bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider text-[#2C3E2D]/70">
                      <th className="py-3.5 px-4">Fecha & Horario</th>
                      <th className="py-3.5 px-4">Profesional</th>
                      <th className="py-3.5 px-4">Paciente & Contacto</th>
                      <th className="py-3.5 px-4">Práctica / Seña</th>
                      <th className="py-3.5 px-4">Estado & Auditoría</th>
                      <th className="py-3.5 px-4 text-right">Acciones Rápidas (1 Clic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D2]/70">
                    {filteredSlots.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#2C3E2D]/60 font-sans">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No se encontraron turnos con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredSlots.map(slot => {
                        const booking = bookings.find(b => b.timeSlotId === slot.id);
                        const spec = specialists.find(s => s.id === slot.specialistId);
                        const service = services.find(
                          s => s.id === (booking?.serviceId || slot.serviceId)
                        );
                        const lockedMins =
                          slot.status === 'PENDING_DEPOSIT'
                            ? getLockedMinutesAgo(slot.lockedAt)
                            : null;

                        return (
                          <tr
                            key={slot.id}
                            className={`hover:bg-[#F4EFE6]/50 transition-colors ${
                              slot.status === 'PENDING_DEPOSIT' ? 'bg-[#F9F2E7]/40' : ''
                            }`}
                          >
                            {/* Fecha y Horario */}
                            <td className="py-4 px-4 font-sans">
                              <p className="font-bold text-[#1B2B1C] whitespace-nowrap">
                                {slot.startTime} a {slot.endTime} hs
                              </p>
                              <p className="text-xs text-[#2C3E2D]/70 capitalize">{slot.date}</p>
                            </td>

                            {/* Especialista */}
                            <td className="py-4 px-4">
                              <p className="font-bold text-[#1B2B1C]">{spec?.name}</p>
                              <p className="text-xs text-[#3D5A40] truncate max-w-[140px]">
                                {spec?.title}
                              </p>
                            </td>

                            {/* Paciente y Contacto */}
                            <td className="py-4 px-4">
                              {booking ? (
                                <div>
                                  <p className="font-bold text-[#1B2B1C]">{booking.patientName}</p>
                                  <a
                                    href={`tel:${booking.patientPhone}`}
                                    className="text-xs text-[#3D5A40] hover:underline block"
                                  >
                                    {booking.patientPhone}
                                  </a>
                                  {booking.patientNotes && (
                                    <p className="text-[11px] text-[#2C3E2D]/60 italic mt-0.5 max-w-xs truncate">
                                      "{booking.patientNotes}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-[#2C3E2D]/50 italic">
                                  Sin paciente
                                </span>
                              )}
                            </td>

                            {/* Servicio y Seña */}
                            <td className="py-4 px-4">
                              {service ? (
                                <div>
                                  <p className="font-semibold text-[#1B2B1C]">{service.title}</p>
                                  <p className="text-xs text-[#C29352] font-bold">
                                    Seña: $
                                    {booking
                                      ? booking.depositAmount.toLocaleString('es-AR')
                                      : Math.round(
                                          (service.price * service.depositValue) / 100
                                        ).toLocaleString('es-AR')}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-[#2C3E2D]/50 italic">General</span>
                              )}
                            </td>

                            {/* Estado y Auditoría Temporal */}
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <StatusBadge status={slot.status} />
                                {lockedMins !== null && (
                                  <p className="text-[11px] font-semibold text-[#8C6126] block">
                                    ⏳ Solicitado hace {lockedMins} min
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Acciones Rápidas en 1 Clic */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {slot.status === 'PENDING_DEPOSIT' && booking && (
                                  <button
                                    type="button"
                                    onClick={() => onConfirmDeposit(booking.id)}
                                    className="touch-target inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                                    title="Aprobar transferencia de seña y confirmar turno"
                                  >
                                    <Check className="w-3.5 h-3.5 text-[#A3D9A5]" />
                                    <span>Aprobar Seña</span>
                                  </button>
                                )}

                                {booking && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onReleaseSlot(
                                        booking.id,
                                        'Cancelado por administración'
                                      )
                                    }
                                    className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#D97D64]/40 hover:bg-[#FBEBE7] text-[#A64A32] text-xs font-semibold transition-colors cursor-pointer"
                                    title="Cancelar reserva y liberar el horario a Disponible"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Liberar</span>
                                  </button>
                                )}

                                {slot.status === 'CONFIRMED' && booking && (
                                  <button
                                    type="button"
                                    onClick={() => handleSendReminder(booking, slot)}
                                    className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#25D366]/40 hover:bg-[#EBF0EA] text-[#1B2B1C] text-xs font-semibold transition-colors cursor-pointer"
                                    title="Enviar recordatorio 24hs por WhatsApp"
                                  >
                                    <Send className="w-3.5 h-3.5 text-[#25D366]" />
                                    <span className="hidden sm:inline">Recordatorio</span>
                                  </button>
                                )}

                                {slot.status === 'AVAILABLE' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateSlotStatus(
                                          slot.id,
                                          'BLOCKED',
                                          'Bloqueo administrativo'
                                        )
                                      }
                                      className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E8E0D2] hover:bg-[#F4EFE6] text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                                      title="Bloquear horario"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Bloquear</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `¿Eliminar el horario libre de ${slot.startTime} a ${slot.endTime} hs?`
                                          )
                                        ) {
                                          onDeleteSlot(slot.id);
                                        }
                                      }}
                                      className="touch-target p-2 rounded-xl border border-[#D97D64]/30 text-[#A64A32] hover:bg-[#FBEBE7] transition-colors cursor-pointer"
                                      title="Eliminar este bloque horario"
                                      aria-label="Eliminar bloque horario"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                {slot.status === 'BLOCKED' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateSlotStatus(slot.id, 'AVAILABLE')}
                                    className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#6E8B68]/30 hover:bg-[#EBF0EA] text-[#2C3E2D] text-xs font-medium transition-colors cursor-pointer"
                                    title="Habilitar como disponible"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Habilitar</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PESTAÑA 2: GESTOR DE PROFESIONALES (CRUD COMPLETO) */}
        {activeTab === 'profesionales' && (
          <SpecialistsManager
            specialists={specialists}
            services={services}
            onSaveSpecialist={onSaveSpecialist}
            onDeleteSpecialist={onDeleteSpecialist}
            onReorderSpecialist={onReorderSpecialist}
          />
        )}

        {/* PESTAÑA 3: GESTOR DE PRÁCTICAS Y TARIFAS (CRUD COMPLETO) */}
        {activeTab === 'practicas' && (
          <ServicesManager
            specialists={specialists}
            services={services}
            defaultDepositPercent={settings.defaultDepositPercent}
            onSaveService={onSaveService}
            onDeleteService={onDeleteService}
          />
        )}

        {/* PESTAÑA 4: CONTENIDO WEB MODULAR Y AJUSTES */}
        {activeTab === 'contenido' && (
          <ContentAndSettingsManager
            settings={settings}
            onSaveSettings={onUpdateSettings}
            onExportBackup={onExportBackup}
            onImportBackup={onImportBackup}
            onResetSeeds={onResetSeeds}
          />
        )}
      </main>

      {/* Modal 1: Hoja de Ruta Diaria */}
      {runSheetSpecialist && (
        <DailyRunSheetModal
          isOpen={isRunSheetOpen}
          onClose={() => setIsRunSheetOpen(false)}
          specialist={runSheetSpecialist}
          date={runSheetDate}
          slots={timeSlots}
          bookings={bookings}
          services={services}
        />
      )}

      {/* Modal 2: Generador Determinístico de Grilla */}
      <ScheduleGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        specialists={specialists}
        existingSlots={timeSlots}
        onSaveSchedule={onSaveSchedule}
      />

      {/* Modal 3: Reserva Manual / Bloqueo */}
      <ManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        specialists={specialists}
        services={services}
        availableSlots={availableSlotsList}
        onCreateManualBooking={data => {
          onRequestBooking({
            timeSlotId: data.timeSlotId,
            specialistId: data.specialistId,
            serviceId: data.serviceId,
            patientName: data.patientName,
            patientPhone: data.patientPhone,
            patientNotes: data.patientNotes,
            depositVerified: data.depositVerified,
          });
        }}
        onBlockSlot={(slotId, notes) => {
          onUpdateSlotStatus(slotId, 'BLOCKED', notes);
        }}
      />

      {/* Modal 4: Ajustes Rápidos */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={onUpdateSettings}
        onResetSeeds={onResetSeeds}
      />
    </div>
  );
};
