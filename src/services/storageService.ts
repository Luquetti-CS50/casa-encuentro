import {
  Specialist,
  Service,
  ScheduleDay,
  TimeSlot,
  Booking,
  SiteSettings,
  SlotStatus,
  AccessibilityPreferences,
} from '../types/domain';
import {
  INITIAL_SPECIALISTS,
  INITIAL_SERVICES,
  INITIAL_SCHEDULE_DAYS,
  INITIAL_TIME_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_SITE_SETTINGS,
} from '../data/initialSeeds';
import { hasSlotCollision } from './scheduleCalculator';

const STORAGE_KEYS = {
  SPECIALISTS: 'casa_encuentro_specialists_v1',
  SERVICES: 'casa_encuentro_services_v1',
  SCHEDULE_DAYS: 'casa_encuentro_schedules_v1',
  TIME_SLOTS: 'casa_encuentro_slots_v1',
  BOOKINGS: 'casa_encuentro_bookings_v1',
  SETTINGS: 'casa_encuentro_settings_v1',
  LAST_BOOKING_ID: 'casa_encuentro_last_patient_booking_v1',
  A11Y_PREFS: 'casa_encuentro_a11y_prefs_v1',
} as const;

type EventCallback = () => void;
const subscribers: Set<EventCallback> = new Set();

export function subscribeToStore(callback: EventCallback): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => {
    try {
      cb();
    } catch (err) {
      console.error('Error notifying subscriber:', err);
    }
  });
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifySubscribers();
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const DEFAULT_A11Y_PREFS: AccessibilityPreferences = {
  fontScale: 'normal',
  highContrast: false,
  reducedMotion: false,
};

export const StorageService = {
  // --- Accessibility Preferences ---
  getAccessibilityPrefs(): AccessibilityPreferences {
    return {
      ...DEFAULT_A11Y_PREFS,
      ...loadFromStorage<Partial<AccessibilityPreferences>>(STORAGE_KEYS.A11Y_PREFS, DEFAULT_A11Y_PREFS),
    };
  },

  saveAccessibilityPrefs(prefs: AccessibilityPreferences): void {
    saveToStorage(STORAGE_KEYS.A11Y_PREFS, prefs);
  },

  // --- Site Settings (con fusión defensiva de propiedades modulares) ---
  getSettings(): SiteSettings {
    const stored = loadFromStorage<Partial<SiteSettings>>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    return {
      ...INITIAL_SITE_SETTINGS,
      ...stored,
      pathologyCategories: stored.pathologyCategories?.length
        ? stored.pathologyCategories
        : INITIAL_SITE_SETTINGS.pathologyCategories,
      galleryItems: stored.galleryItems?.length
        ? stored.galleryItems
        : INITIAL_SITE_SETTINGS.galleryItems,
      faqItems: stored.faqItems?.length
        ? stored.faqItems
        : INITIAL_SITE_SETTINGS.faqItems,
      symptomFilters: stored.symptomFilters?.length
        ? stored.symptomFilters
        : INITIAL_SITE_SETTINGS.symptomFilters,
    };
  },

  updateSettings(settings: SiteSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // --- Specialists ---
  getSpecialists(): Specialist[] {
    const list = loadFromStorage<Specialist[]>(STORAGE_KEYS.SPECIALISTS, INITIAL_SPECIALISTS);
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getSpecialistById(id: string): Specialist | undefined {
    return this.getSpecialists().find(s => s.id === id);
  },

  saveSpecialist(specialist: Specialist): void {
    const current = this.getSpecialists();
    const index = current.findIndex(s => s.id === specialist.id);
    if (index >= 0) {
      current[index] = specialist;
    } else {
      current.push(specialist);
    }
    saveToStorage(STORAGE_KEYS.SPECIALISTS, current);
  },

  deleteSpecialist(id: string): void {
    const current = this.getSpecialists().filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SPECIALISTS, current);
  },

  reorderSpecialist(id: string, direction: 'up' | 'down'): void {
    const current = this.getSpecialists();
    const index = current.findIndex(s => s.id === id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;

    const reordered = current.map((spec, idx) => ({
      ...spec,
      displayOrder: idx + 1,
    }));
    saveToStorage(STORAGE_KEYS.SPECIALISTS, reordered);
  },

  // --- Services ---
  getServices(): Service[] {
    return loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  getServicesBySpecialist(specialistId: string): Service[] {
    return this.getServices().filter(s => s.specialistId === specialistId && s.isActive);
  },

  saveService(service: Service): void {
    const current = this.getServices();
    const index = current.findIndex(s => s.id === service.id);
    if (index >= 0) {
      current[index] = service;
    } else {
      current.push(service);
    }
    saveToStorage(STORAGE_KEYS.SERVICES, current);
  },

  deleteService(id: string): void {
    const current = this.getServices().filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, current);
  },

  // --- Schedule Days ---
  getScheduleDays(): ScheduleDay[] {
    return loadFromStorage<ScheduleDay[]>(STORAGE_KEYS.SCHEDULE_DAYS, INITIAL_SCHEDULE_DAYS);
  },

  saveScheduleDay(scheduleDay: ScheduleDay): void {
    const current = this.getScheduleDays();
    const index = current.findIndex(d => d.id === scheduleDay.id);
    if (index >= 0) {
      current[index] = scheduleDay;
    } else {
      current.push(scheduleDay);
    }
    saveToStorage(STORAGE_KEYS.SCHEDULE_DAYS, current);
  },

  // --- Time Slots ---
  getTimeSlots(): TimeSlot[] {
    return loadFromStorage<TimeSlot[]>(STORAGE_KEYS.TIME_SLOTS, INITIAL_TIME_SLOTS);
  },

  saveTimeSlots(slots: TimeSlot[]): void {
    const current = this.getTimeSlots();
    const currentMap = new Map(current.map(s => [s.id, s]));
    slots.forEach(s => currentMap.set(s.id, s));
    saveToStorage(STORAGE_KEYS.TIME_SLOTS, Array.from(currentMap.values()));
  },

  updateSlotStatus(slotId: string, status: SlotStatus, notes?: string): void {
    const current = this.getTimeSlots();
    const index = current.findIndex(s => s.id === slotId);
    if (index >= 0) {
      const updated = {
        ...current[index],
        status,
        notes: notes !== undefined ? notes : current[index].notes,
        lockedAt: status === 'PENDING_DEPOSIT' ? new Date().toISOString() : undefined,
      };
      current[index] = updated;
      saveToStorage(STORAGE_KEYS.TIME_SLOTS, current);
    }
  },

  deleteSlot(slotId: string): void {
    const current = this.getTimeSlots().filter(s => s.id !== slotId);
    saveToStorage(STORAGE_KEYS.TIME_SLOTS, current);
  },

  addSingleSlot(slot: TimeSlot): { success: boolean; error?: string } {
    const current = this.getTimeSlots();
    if (hasSlotCollision(slot, current)) {
      return {
        success: false,
        error: 'Existe una colisión o superposición de horario para este especialista en esta fecha.',
      };
    }
    current.push(slot);
    saveToStorage(STORAGE_KEYS.TIME_SLOTS, current);
    return { success: true };
  },

  // --- Bookings (Ciclo de Vida Transaccional) ---
  getBookings(): Booking[] {
    return loadFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  getLastPatientBookingId(): string | null {
    return loadFromStorage<string | null>(STORAGE_KEYS.LAST_BOOKING_ID, null);
  },

  clearLastPatientBookingId(): void {
    saveToStorage<string | null>(STORAGE_KEYS.LAST_BOOKING_ID, null);
  },

  /**
   * Crea una solicitud de reserva e implementa el bloqueo preventivo temporal del casillero horario
   * Previene colisiones de dos usuarios simultáneos.
   */
  requestBooking(data: {
    timeSlotId: string;
    specialistId: string;
    serviceId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientNotes?: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    const slots = this.getTimeSlots();
    const slotIndex = slots.findIndex(s => s.id === data.timeSlotId);

    if (slotIndex < 0) {
      return { success: false, error: 'El turno seleccionado no existe.' };
    }

    const slot = slots[slotIndex];
    if (slot.status !== 'AVAILABLE') {
      return {
        success: false,
        error: 'Este horario acaba de ser reservado por otra persona. Por favor, selecciona otro horario disponible.',
      };
    }

    // Calcular seña según el servicio
    const services = this.getServices();
    const service = services.find(s => s.id === data.serviceId);
    const settings = this.getSettings();

    const price = service ? service.price : 0;
    let depositAmount = 0;
    if (service) {
      if (service.depositType === 'fixed') {
        depositAmount = service.depositValue;
      } else {
        depositAmount = Math.round((price * service.depositValue) / 100);
      }
    } else {
      depositAmount = Math.round((price * settings.defaultDepositPercent) / 100);
    }

    // 1. Bloqueo preventivo en TimeSlot
    slots[slotIndex] = {
      ...slot,
      status: 'PENDING_DEPOSIT',
      lockedAt: new Date().toISOString(),
      serviceId: data.serviceId,
    };
    saveToStorage(STORAGE_KEYS.TIME_SLOTS, slots);

    // 2. Registro de Booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timeSlotId: data.timeSlotId,
      specialistId: data.specialistId,
      serviceId: data.serviceId,
      patientName: data.patientName.trim(),
      patientPhone: data.patientPhone.trim(),
      patientEmail: data.patientEmail?.trim(),
      patientNotes: data.patientNotes?.trim(),
      depositAmount,
      totalAmount: price,
      depositVerified: false,
      createdAt: new Date().toISOString(),
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    saveToStorage(STORAGE_KEYS.LAST_BOOKING_ID, newBooking.id);

    return { success: true, booking: newBooking };
  },

  /**
   * Acción de 1 Clic del Coordinador: Aprobar Seña -> Pasa a CONFIRMED
   */
  confirmBookingDeposit(bookingId: string): void {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.depositVerified = true;
    booking.verifiedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);

    this.updateSlotStatus(booking.timeSlotId, 'CONFIRMED');
  },

  /**
   * Acción de 1 Clic del Coordinador: Liberar Turno / Rechazar Seña -> Pasa a AVAILABLE
   */
  releaseBookingSlot(bookingId: string, reason?: string): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index >= 0) {
      const b = bookings[index];
      this.updateSlotStatus(b.timeSlotId, 'AVAILABLE', reason ? `Cancelado: ${reason}` : undefined);
      bookings.splice(index, 1);
      saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
      if (this.getLastPatientBookingId() === bookingId) {
        this.clearLastPatientBookingId();
      }
    }
  },

  /**
   * Exportar toda la base de datos local en JSON para backup
   */
  exportBackupJson(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        settings: this.getSettings(),
        specialists: this.getSpecialists(),
        services: this.getServices(),
        scheduleDays: this.getScheduleDays(),
        timeSlots: this.getTimeSlots(),
        bookings: this.getBookings(),
      },
      null,
      2
    );
  },

  /**
   * Importar respaldo JSON
   */
  importBackupJson(rawJson: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(rawJson) as {
        settings?: SiteSettings;
        specialists?: Specialist[];
        services?: Service[];
        scheduleDays?: ScheduleDay[];
        timeSlots?: TimeSlot[];
        bookings?: Booking[];
      };
      if (!parsed.settings || !Array.isArray(parsed.specialists)) {
        return { success: false, error: 'El archivo JSON no tiene el formato válido de Casa Encuentro.' };
      }
      saveToStorage(STORAGE_KEYS.SETTINGS, parsed.settings);
      saveToStorage(STORAGE_KEYS.SPECIALISTS, parsed.specialists);
      if (Array.isArray(parsed.services)) saveToStorage(STORAGE_KEYS.SERVICES, parsed.services);
      if (Array.isArray(parsed.scheduleDays)) saveToStorage(STORAGE_KEYS.SCHEDULE_DAYS, parsed.scheduleDays);
      if (Array.isArray(parsed.timeSlots)) saveToStorage(STORAGE_KEYS.TIME_SLOTS, parsed.timeSlots);
      if (Array.isArray(parsed.bookings)) saveToStorage(STORAGE_KEYS.BOOKINGS, parsed.bookings);
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo leer el archivo JSON. Verifica su integridad.' };
    }
  },

  /**
   * Restablece los datos de demostración limpios
   */
  resetToInitialSeeds(): void {
    saveToStorage(STORAGE_KEYS.SPECIALISTS, INITIAL_SPECIALISTS);
    saveToStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    saveToStorage(STORAGE_KEYS.SCHEDULE_DAYS, INITIAL_SCHEDULE_DAYS);
    saveToStorage(STORAGE_KEYS.TIME_SLOTS, INITIAL_TIME_SLOTS);
    saveToStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    saveToStorage<string | null>(STORAGE_KEYS.LAST_BOOKING_ID, null);
  },
};
