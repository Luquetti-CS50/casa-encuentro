import { TimeSlot, Specialist, Service, SiteSettings } from '../types/domain';

function toIcsDateTime(dateStr: string, timeStr: string): string {
  // Convierte YYYY-MM-DD y HH:mm a YYYYMMDDTHHMMSS
  const cleanDate = dateStr.replace(/-/g, '');
  const cleanTime = timeStr.replace(/:/g, '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

export function downloadBookingIcs(params: {
  slot: TimeSlot;
  specialist: Specialist;
  service: Service;
  settings: SiteSettings;
  patientName: string;
}): void {
  const { slot, specialist, service, settings, patientName } = params;
  const dtStart = toIcsDateTime(slot.date, slot.startTime);
  const dtEnd = toIcsDateTime(slot.date, slot.endTime);
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Turno en ${settings.businessName}: ${service.title} con ${specialist.name}`;
  const description = [
    `Paciente: ${patientName}`,
    `Profesional: ${specialist.name} (${specialist.title})`,
    `Práctica: ${service.title}`,
    `Dirección: ${settings.address}`,
    `Contacto: ${settings.contactPhone}`,
  ].join('\\n');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Casa Encuentro//Sistema de Turnos//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${slot.id}@casaencuentro.ar`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${settings.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `turno-casa-encuentro-${slot.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
