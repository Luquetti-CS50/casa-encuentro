import { Specialist, Service, ScheduleDay, TimeSlot, Booking, SiteSettings } from '../types/domain';

export const AVAILABLE_BRAND_IMAGES: { label: string; url: string }[] = [
  { label: 'Mariano — Medicina China y Acupuntura', url: '/images/mariano-terapias.jpg' },
  { label: 'Silvana Camiño — Masajes y Drenaje', url: '/images/masajes-silvana.jpg' },
  { label: 'Nathalia — Yoga al Aire Libre', url: '/images/yoga-nathalia.jpg' },
  { label: 'Pausa — Biosónica y Samafones', url: '/images/pausa-sonido.jpg' },
  { label: 'Sala de Medicina China y Camilla', url: '/images/medicina-china.jpg' },
  { label: 'Jornada de Bienestar y Meditación', url: '/images/jornada-bienestar.jpg' },
  { label: 'Cuencos Sonoros en el Parque', url: '/images/cuencos-pausa.jpg' },
  { label: 'Logotipo Oficial Casa Encuentro', url: '/images/logo.jpg' },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'current',
  businessName: 'Casa Encuentro',
  tagline: 'En calma se ven los colores con mayor intensidad',
  description:
    'Un espacio para sanar, soltar y volver a tu centro. Acompañamos tu bienestar de manera integral, combinando técnicas orientales y occidentales para restaurar el equilibrio del cuerpo, la mente y la energía.',
  address: 'General Las Heras, Provincia de Buenos Aires',
  contactPhone: '+54 9 11 5666-0016',
  whatsappNumber: '5491156660016',
  bankAlias: 'CASA.ENCUENTRO.HERAS',
  bankCbu: '0000003100012345678901',
  bankName: 'Banco Santander',
  bankHolder: 'Felicia Torres',
  defaultDepositPercent: 30,
  depositExpirationMinutes: 60,
  whatsappTemplate:
    '¡Hola Casa Encuentro! ✨ Quiero coordinar mi turno:\n• Paciente: {patient_name}\n• Especialista: {specialist_name}\n• Práctica: {service_title}\n• Fecha: {date}\n• Horario: {time}\n• Seña a abonar: ${deposit_amount}\n\nAdjunto el comprobante de transferencia bancaria. ¡Muchas gracias!',
  developerCreditName: 'Zenith Studio',
  developerCreditUrl:
    'https://wa.me/5491156660016?text=Hola%20Zenith,%20vi%20la%20plataforma%20de%20Casa%20Encuentro%20y%20quisiera%20consultar%20por%20un%20desarrollo%20web.',
  pathologyCategories: [
    {
      id: 'path-1',
      numberLabel: '01',
      title: 'Dolor y Movilidad',
      accentColor: 'sage',
      items: [
        'Dolor crónico lumbar, cervical y dorsal.',
        'Dolores articulares, hernias discales y nervio ciático.',
        'Artritis reumatoidea, rigidez en cuello y columna.',
        'Túnel carpiano, tendinitis, calambres y bruxismo.',
      ],
    },
    {
      id: 'path-2',
      numberLabel: '02',
      title: 'Digestivo y Metabólico',
      accentColor: 'gold',
      items: [
        'Dolores estomacales y colon irritable.',
        'SIBO, diarreas crónicas, constipación y gastritis.',
        'Hígado graso, reflujo gástrico y digestión lenta.',
        'Pesadez abdominal y náuseas recurrentes.',
      ],
    },
    {
      id: 'path-3',
      numberLabel: '03',
      title: 'Bienestar Integral',
      accentColor: 'sage',
      items: [
        'Regulación profunda del sistema nervioso autónomo.',
        'Alivio de insomnio, ansiedad y estrés acumulado.',
        'Recuperación de vitalidad, foco y claridad mental.',
        'Migrañas, mareos tensionales y dolores por pérdidas.',
      ],
    },
  ],
  galleryItems: [
    {
      id: 'gal-1',
      imageUrl: '/images/yoga-nathalia.jpg',
      caption: 'Yoga al Aire Libre',
    },
    {
      id: 'gal-2',
      imageUrl: '/images/pausa-sonido.jpg',
      caption: 'Sonoterapia & Cuencos',
    },
    {
      id: 'gal-3',
      imageUrl: '/images/masajes-silvana.jpg',
      caption: 'Masajes & Drenaje',
    },
    {
      id: 'gal-4',
      imageUrl: '/images/jornada-bienestar.jpg',
      caption: 'Jornadas de Bienestar',
    },
  ],
  faqItems: [
    {
      id: 'faq-1',
      question: '¿Cómo funciona la reserva y la seña del turno?',
      answer:
        'Al elegir tu horario y completar tus datos, el casillero queda reservado preventivamente para vos. Luego podrás copiar el Alias bancario en un clic y enviar el comprobante por WhatsApp para que coordinación deje tu turno 100% confirmado.',
    },
    {
      id: 'faq-2',
      question: '¿Qué debo llevar a mi sesión o clase de yoga?',
      answer:
        'Para sesiones en consultorio (acupuntura, quiropraxia o masajes) solo te sugerimos asistir con ropa cómoda. En el espacio contamos con camillas vestidas, mantas y elementos esterilizados. Para Yoga en el parque, disponemos de mats y almohadones zafu.',
    },
    {
      id: 'faq-3',
      question: '¿Con cuánta anticipación puedo reprogramar mi turno?',
      answer:
        'Si necesitas reprogramar tu cita, te pedimos avisarnos por WhatsApp con al menos 24 horas de anticipación para poder reasignar la seña a una nueva fecha y liberar el horario para otro paciente.',
    },
  ],
  symptomFilters: [
    {
      id: 'sym-all',
      label: 'Todas las prácticas',
      keywords: [],
    },
    {
      id: 'sym-columna',
      label: 'Dolor Lumbar / Cervical / Ciático',
      keywords: ['acupuntura', 'quiropraxia', 'lumbar', 'descontracturante', 'ventoterapia', 'moxibustión', 'columna', 'lumbosacro'],
    },
    {
      id: 'sym-bruxismo',
      label: 'Bruxismo y Tensión Facial',
      keywords: ['bruxismo', 'facial', 'cráneo', 'mandíbula', 'acupuntura'],
    },
    {
      id: 'sym-estres',
      label: 'Estrés, Ansiedad e Insomnio',
      keywords: ['yoga', 'biosónica', 'pausa', 'sonido', 'relajante', 'meditación', 'acupuntura', 'cuencos'],
    },
    {
      id: 'sym-circulacion',
      label: 'Retención de Líquidos / Circulación',
      keywords: ['drenaje', 'vodder', 'linfático', 'ventoterapia', 'circulación'],
    },
    {
      id: 'sym-movimiento',
      label: 'Yoga y Aire Libre',
      keywords: ['yoga', 'parque', 'aire libre', 'pranayama', 'flexibilidad'],
    },
  ],
};

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-mariano',
    name: 'Mariano',
    title: 'Medicina China & Terapias Holísticas',
    bio: 'Más de 16 años de experiencia acompañando a personas en su camino hacia el bienestar físico, emocional y energético. Especialista en acupuntura tradicional, quiropraxia y ventoterapia.',
    avatarUrl: '/images/mariano-terapias.jpg',
    specialtyTags: ['Acupuntura', 'Quiropraxia', 'Ventoterapia', 'Moxibustión'],
    isActive: true,
    displayOrder: 1,
    phone: '+54 9 11 5666-0016',
  },
  {
    id: 'spec-silvana',
    name: 'Silvana Camiño',
    title: 'Masajes Terapéuticos & Drenaje',
    bio: 'Dedicada al alivio de tensiones y la restauración del movimiento corporal armónico. Formada en drenaje linfático Método Vodder, resolución de dolores lumbosacros y tratamiento del bruxismo.',
    avatarUrl: '/images/masajes-silvana.jpg',
    specialtyTags: ['Descontracturante', 'Método Vodder', 'Bruxismo Facial', 'Lumbosacro'],
    isActive: true,
    displayOrder: 2,
    phone: '+54 9 11 5666-0016',
  },
  {
    id: 'spec-nathalia',
    name: 'Nathalia',
    title: 'Instructora de Hatha & Vinyasa Yoga',
    bio: 'Guía de prácticas corporales conscientes al aire libre. Sesiones diseñadas para conectar con el cuerpo, calmar la mente y habitar plenamente el momento presente rodeados de naturaleza.',
    avatarUrl: '/images/yoga-nathalia.jpg',
    specialtyTags: ['Yoga al Aire Libre', 'Pranayama', 'Consciencia Corporal', 'Flexibilidad'],
    isActive: true,
    displayOrder: 3,
    phone: '+54 9 11 3299-6633',
  },
  {
    id: 'spec-pausa',
    name: 'Jornadas de Bienestar & Pausa',
    title: 'Encuentros de Biosónica & Sonido Terapéutico',
    bio: 'Talleres inmersivos coordinados en el predio de Casa Encuentro. Cuencos de cuarzo y tibetanos, samafones armónicos, meditaciones guiadas y merienda saludable incluida.',
    avatarUrl: '/images/pausa-sonido.jpg',
    specialtyTags: ['Biosónica', 'Cuencos Tibetanos', 'Meditación Guiada', 'Sonoterapia'],
    isActive: true,
    displayOrder: 4,
    phone: '+54 9 11 5666-0016',
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-acupuntura',
    specialistId: 'spec-mariano',
    title: 'Sesión de Acupuntura & Medicina China',
    description: 'Estimulación de puntos específicos para armonizar la energía vital (Qi). Tratamiento integral de dolor crónico lumbar, cervical, ciático y cefaleas.',
    durationMinutes: 60,
    price: 24000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Sesión Individual',
  },
  {
    id: 'srv-quiropraxia',
    specialistId: 'spec-mariano',
    title: 'Ajuste Quiropráctico & Desbloqueo',
    description: 'Liberación de bloqueos articulares, corrección postural y alineación vertebral para devolver la fluidez al sistema neuro-músculo-esquelético.',
    durationMinutes: 45,
    price: 22000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Sesión Individual',
  },
  {
    id: 'srv-ventosa-moxi',
    specialistId: 'spec-mariano',
    title: 'Ventoterapia y Moxibustión Profunda',
    description: 'Alivio de contracturas profundas donde las manos no llegan mediante ventosas y aplicación de calor terapéutico con moxa de artemisa.',
    durationMinutes: 60,
    price: 24000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Tradicional',
  },
  {
    id: 'srv-masaje-descontracturante',
    specialistId: 'spec-silvana',
    title: 'Masaje Descontracturante & Lumbar',
    description: 'Terapia manual intensiva enfocada en nudos musculares, columna, hombros y resolución de conflictos lumbosacros.',
    durationMinutes: 60,
    price: 20000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Recomendado',
  },
  {
    id: 'srv-masaje-facial-bruxismo',
    specialistId: 'spec-silvana',
    title: 'Masaje Cérvico-Cráneo-Facial (Bruxismo)',
    description: 'Maniobras especializadas en mandíbula, articulación temporomandibular, cuello y cráneo para liberar tensiones originadas por estrés.',
    durationMinutes: 50,
    price: 19000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Alivio Facial',
  },
  {
    id: 'srv-drenaje-vodder',
    specialistId: 'spec-silvana',
    title: 'Drenaje Linfático Manual (Método Vodder)',
    description: 'Estimulación suave del sistema linfático para favorecer la circulación, desinflamación y eliminación de toxinas.',
    durationMinutes: 60,
    price: 21000,
    depositType: 'percentage',
    depositValue: 30,
    isActive: true,
    badge: 'Salud Circulatoria',
  },
  {
    id: 'srv-yoga-parque',
    specialistId: 'spec-nathalia',
    title: 'Clase de Yoga al Aire Libre',
    description: 'Práctica grupal sobre el césped de Casa Encuentro. Respiración consciente, asanas y relajación final bajo la arboleda.',
    durationMinutes: 60,
    price: 7000,
    depositType: 'percentage',
    depositValue: 50,
    isActive: true,
    badge: 'En el Parque',
  },
  {
    id: 'srv-taller-biosonica',
    specialistId: 'spec-pausa',
    title: 'Pausa: Encuentro de Biosónica y Samafones',
    description: 'Taller sonoro inmersivo para hacer de lo ordinario algo extraordinario. Sonidos armónicos, meditación y merienda casera compartida.',
    durationMinutes: 120,
    price: 25000,
    depositType: 'percentage',
    depositValue: 40,
    isActive: true,
    badge: 'Taller Especial',
  },
];

// Generador de fechas base dinámicas para garantizar que siempre haya turnos vigentes hoy y en días próximos
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const addDays = (d: Date, days: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
};

const dateDay0 = formatDate(today);
const dateDay1 = formatDate(addDays(today, 1));
const dateDay2 = formatDate(addDays(today, 2));
const dateDay3 = formatDate(addDays(today, 3));
const dateDay4 = formatDate(addDays(today, 5));

export const INITIAL_SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: 'sch-mariano-1',
    specialistId: 'spec-mariano',
    date: dateDay1,
    startTime: '09:00',
    endTime: '13:00',
    slotIntervalMinutes: 60,
    isActive: true,
  },
  {
    id: 'sch-mariano-2',
    specialistId: 'spec-mariano',
    date: dateDay3,
    startTime: '14:00',
    endTime: '18:00',
    slotIntervalMinutes: 60,
    isActive: true,
  },
  {
    id: 'sch-silvana-1',
    specialistId: 'spec-silvana',
    date: dateDay0,
    startTime: '09:30',
    endTime: '13:30',
    slotIntervalMinutes: 60,
    isActive: true,
  },
  {
    id: 'sch-silvana-2',
    specialistId: 'spec-silvana',
    date: dateDay2,
    startTime: '14:30',
    endTime: '18:30',
    slotIntervalMinutes: 60,
    isActive: true,
  },
  {
    id: 'sch-nathalia-1',
    specialistId: 'spec-nathalia',
    date: dateDay1,
    startTime: '15:30',
    endTime: '16:30',
    slotIntervalMinutes: 60,
    isActive: true,
  },
  {
    id: 'sch-pausa-1',
    specialistId: 'spec-pausa',
    date: dateDay4,
    startTime: '15:00',
    endTime: '17:00',
    slotIntervalMinutes: 120,
    isActive: true,
  },
];

export const INITIAL_TIME_SLOTS: TimeSlot[] = [
  // Mariano - Día 1
  {
    id: 'slot-m1-1',
    scheduleDayId: 'sch-mariano-1',
    specialistId: 'spec-mariano',
    serviceId: 'srv-acupuntura',
    date: dateDay1,
    startTime: '09:00',
    endTime: '10:00',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-m1-2',
    scheduleDayId: 'sch-mariano-1',
    specialistId: 'spec-mariano',
    serviceId: 'srv-acupuntura',
    date: dateDay1,
    startTime: '10:00',
    endTime: '11:00',
    status: 'PENDING_DEPOSIT',
    lockedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // Hace 18 minutos
  },
  {
    id: 'slot-m1-3',
    scheduleDayId: 'sch-mariano-1',
    specialistId: 'spec-mariano',
    serviceId: 'srv-quiropraxia',
    date: dateDay1,
    startTime: '11:00',
    endTime: '12:00',
    status: 'CONFIRMED',
  },
  {
    id: 'slot-m1-4',
    scheduleDayId: 'sch-mariano-1',
    specialistId: 'spec-mariano',
    serviceId: 'srv-ventosa-moxi',
    date: dateDay1,
    startTime: '12:00',
    endTime: '13:00',
    status: 'AVAILABLE',
  },

  // Mariano - Día 3
  {
    id: 'slot-m3-1',
    scheduleDayId: 'sch-mariano-2',
    specialistId: 'spec-mariano',
    serviceId: 'srv-acupuntura',
    date: dateDay3,
    startTime: '14:00',
    endTime: '15:00',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-m3-2',
    scheduleDayId: 'sch-mariano-2',
    specialistId: 'spec-mariano',
    serviceId: 'srv-quiropraxia',
    date: dateDay3,
    startTime: '15:00',
    endTime: '16:00',
    status: 'AVAILABLE',
  },

  // Silvana - Día 0 (Hoy)
  {
    id: 'slot-s0-1',
    scheduleDayId: 'sch-silvana-1',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-descontracturante',
    date: dateDay0,
    startTime: '09:30',
    endTime: '10:30',
    status: 'CONFIRMED',
  },
  {
    id: 'slot-s0-2',
    scheduleDayId: 'sch-silvana-1',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-facial-bruxismo',
    date: dateDay0,
    startTime: '10:30',
    endTime: '11:30',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-s0-3',
    scheduleDayId: 'sch-silvana-1',
    specialistId: 'spec-silvana',
    serviceId: 'srv-drenaje-vodder',
    date: dateDay0,
    startTime: '11:30',
    endTime: '12:30',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-s0-4',
    scheduleDayId: 'sch-silvana-1',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-descontracturante',
    date: dateDay0,
    startTime: '12:30',
    endTime: '13:30',
    status: 'BLOCKED',
    notes: 'Reservado para coordinación de insumos',
  },

  // Silvana - Día 2
  {
    id: 'slot-s2-1',
    scheduleDayId: 'sch-silvana-2',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-descontracturante',
    date: dateDay2,
    startTime: '14:30',
    endTime: '15:30',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-s2-2',
    scheduleDayId: 'sch-silvana-2',
    specialistId: 'spec-silvana',
    serviceId: 'srv-drenaje-vodder',
    date: dateDay2,
    startTime: '15:30',
    endTime: '16:30',
    status: 'AVAILABLE',
  },
  {
    id: 'slot-s2-3',
    scheduleDayId: 'sch-silvana-2',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-facial-bruxismo',
    date: dateDay2,
    startTime: '16:30',
    endTime: '17:30',
    status: 'AVAILABLE',
  },

  // Nathalia - Yoga Día 1
  {
    id: 'slot-n1-1',
    scheduleDayId: 'sch-nathalia-1',
    specialistId: 'spec-nathalia',
    serviceId: 'srv-yoga-parque',
    date: dateDay1,
    startTime: '15:30',
    endTime: '16:30',
    status: 'AVAILABLE',
  },

  // Pausa - Biosónica Día 4
  {
    id: 'slot-p4-1',
    scheduleDayId: 'sch-pausa-1',
    specialistId: 'spec-pausa',
    serviceId: 'srv-taller-biosonica',
    date: dateDay4,
    startTime: '15:00',
    endTime: '17:00',
    status: 'AVAILABLE',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    timeSlotId: 'slot-m1-2',
    specialistId: 'spec-mariano',
    serviceId: 'srv-acupuntura',
    patientName: 'Camila Rossi',
    patientPhone: '+54 9 11 4455-8899',
    patientEmail: 'camila.rossi@email.com',
    patientNotes: 'Dolor persistente en zona lumbar por teletrabajo.',
    depositAmount: 7200,
    totalAmount: 24000,
    depositVerified: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'book-2',
    timeSlotId: 'slot-m1-3',
    specialistId: 'spec-mariano',
    serviceId: 'srv-quiropraxia',
    patientName: 'Facundo Gómez',
    patientPhone: '+54 9 11 6589-1122',
    patientEmail: 'facu.gomez@email.com',
    patientNotes: 'Alineación de columna y cuello.',
    depositAmount: 6600,
    totalAmount: 22000,
    depositVerified: true,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'book-3',
    timeSlotId: 'slot-s0-1',
    specialistId: 'spec-silvana',
    serviceId: 'srv-masaje-descontracturante',
    patientName: 'Lucía Benítez',
    patientPhone: '+54 9 11 3211-9988',
    patientEmail: 'lucia.b@email.com',
    patientNotes: 'Mucho dolor cervical y de hombros.',
    depositAmount: 6000,
    totalAmount: 20000,
    depositVerified: true,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
];
