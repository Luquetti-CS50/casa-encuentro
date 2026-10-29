/**
 * CASA ENCUENTRO — Modelo de Dominio y Tipado Estricto de TypeScript
 * Cumple estrictamente con las directrices de arquitectura de GEMINI.md
 */

export type SlotStatus = 'AVAILABLE' | 'PENDING_DEPOSIT' | 'CONFIRMED' | 'BLOCKED';

export type DepositType = 'percentage' | 'fixed';

export interface Specialist {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  specialtyTags: string[];
  isActive: boolean;
  displayOrder: number;
  phone?: string;
  email?: string;
}

export interface Service {
  id: string;
  specialistId: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  depositType: DepositType;
  depositValue: number; // Porcentaje (ej. 30) o monto fijo (ej. 10000)
  isActive: boolean;
  badge?: string; // Ej: "Sesión 60 min", "Taller grupal", etc.
}

export interface ScheduleDay {
  id: string;
  specialistId: string;
  date: string; // ISO formato YYYY-MM-DD
  startTime: string; // HH:mm (ej. "09:00")
  endTime: string; // HH:mm (ej. "13:30")
  slotIntervalMinutes: number; // Intervalo o duración de bloque
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  scheduleDayId: string;
  specialistId: string;
  serviceId?: string;
  date: string; // ISO formato YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: SlotStatus;
  lockedAt?: string; // Timestamp ISO de cuando se solicitó (bloqueo preventivo)
  notes?: string;
}

export interface Booking {
  id: string;
  timeSlotId: string;
  specialistId: string;
  serviceId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
  depositAmount: number;
  totalAmount: number;
  depositVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  cancellationReason?: string;
}

export interface PathologyCategory {
  id: string;
  numberLabel: string;
  title: string;
  items: string[];
  accentColor: 'sage' | 'gold';
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SymptomFilter {
  id: string;
  label: string;
  keywords: string[];
}

export interface SiteSettings {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  address: string;
  contactPhone: string;
  whatsappNumber: string; // Formato internacional sin +, ej: "5491156660016"
  bankAlias: string;
  bankCbu: string;
  bankName: string;
  bankHolder: string;
  defaultDepositPercent: number; // Ej. 30
  depositExpirationMinutes: number; // Ej. 60 minutos sugeridos para enviar comprobante
  whatsappTemplate: string;
  developerCreditName: string;
  developerCreditUrl: string;
  pathologyCategories: PathologyCategory[];
  galleryItems: GalleryItem[];
  faqItems: FaqItem[];
  symptomFilters: SymptomFilter[];
}

export type ExplorationMode = 'specialist' | 'date';

export type FontScale = 'normal' | 'large' | 'xlarge';

export interface AccessibilityPreferences {
  fontScale: FontScale;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface BookingFormData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
}
