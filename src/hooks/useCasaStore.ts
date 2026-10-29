import { useState, useEffect, useCallback } from 'react';
import { StorageService, subscribeToStore } from '../services/storageService';
import {
  Specialist,
  Service,
  ScheduleDay,
  TimeSlot,
  SiteSettings,
  SlotStatus,
  AccessibilityPreferences,
} from '../types/domain';

export function useCasaStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const settings = StorageService.getSettings();
  const specialists = StorageService.getSpecialists();
  const services = StorageService.getServices();
  const scheduleDays = StorageService.getScheduleDays();
  const timeSlots = StorageService.getTimeSlots();
  const bookings = StorageService.getBookings();
  const lastPatientBookingId = StorageService.getLastPatientBookingId();
  const a11yPrefs = StorageService.getAccessibilityPrefs();

  // Sincronizar preferencias de accesibilidad en el elemento raíz <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('data-font-scale', a11yPrefs.fontScale);
    html.setAttribute('data-high-contrast', String(a11yPrefs.highContrast));
    html.setAttribute('data-reduced-motion', String(a11yPrefs.reducedMotion));
  }, [a11yPrefs.fontScale, a11yPrefs.highContrast, a11yPrefs.reducedMotion]);

  const updateAccessibilityPrefs = useCallback((prefs: AccessibilityPreferences) => {
    StorageService.saveAccessibilityPrefs(prefs);
  }, []);

  const updateSettings = useCallback((newSettings: SiteSettings) => {
    StorageService.updateSettings(newSettings);
  }, []);

  const saveSpecialist = useCallback((specialist: Specialist) => {
    StorageService.saveSpecialist(specialist);
  }, []);

  const deleteSpecialist = useCallback((id: string) => {
    StorageService.deleteSpecialist(id);
  }, []);

  const reorderSpecialist = useCallback((id: string, direction: 'up' | 'down') => {
    StorageService.reorderSpecialist(id, direction);
  }, []);

  const saveService = useCallback((service: Service) => {
    StorageService.saveService(service);
  }, []);

  const deleteService = useCallback((id: string) => {
    StorageService.deleteService(id);
  }, []);

  const saveScheduleDay = useCallback((day: ScheduleDay) => {
    StorageService.saveScheduleDay(day);
  }, []);

  const saveTimeSlots = useCallback((slots: TimeSlot[]) => {
    StorageService.saveTimeSlots(slots);
  }, []);

  const updateSlotStatus = useCallback((slotId: string, status: SlotStatus, notes?: string) => {
    StorageService.updateSlotStatus(slotId, status, notes);
  }, []);

  const deleteSlot = useCallback((slotId: string) => {
    StorageService.deleteSlot(slotId);
  }, []);

  const addSingleSlot = useCallback((slot: TimeSlot) => {
    return StorageService.addSingleSlot(slot);
  }, []);

  const requestBooking = useCallback(
    (data: {
      timeSlotId: string;
      specialistId: string;
      serviceId: string;
      patientName: string;
      patientPhone: string;
      patientEmail?: string;
      patientNotes?: string;
    }) => {
      return StorageService.requestBooking(data);
    },
    []
  );

  const confirmBookingDeposit = useCallback((bookingId: string) => {
    StorageService.confirmBookingDeposit(bookingId);
  }, []);

  const releaseBookingSlot = useCallback((bookingId: string, reason?: string) => {
    StorageService.releaseBookingSlot(bookingId, reason);
  }, []);

  const clearLastPatientBookingId = useCallback(() => {
    StorageService.clearLastPatientBookingId();
  }, []);

  const exportBackupJson = useCallback(() => {
    return StorageService.exportBackupJson();
  }, []);

  const importBackupJson = useCallback((rawJson: string) => {
    return StorageService.importBackupJson(rawJson);
  }, []);

  const resetToSeeds = useCallback(() => {
    StorageService.resetToInitialSeeds();
  }, []);

  return {
    settings,
    specialists,
    services,
    scheduleDays,
    timeSlots,
    bookings,
    lastPatientBookingId,
    a11yPrefs,
    updateAccessibilityPrefs,
    updateSettings,
    saveSpecialist,
    deleteSpecialist,
    reorderSpecialist,
    saveService,
    deleteService,
    saveScheduleDay,
    saveTimeSlots,
    updateSlotStatus,
    deleteSlot,
    addSingleSlot,
    requestBooking,
    confirmBookingDeposit,
    releaseBookingSlot,
    clearLastPatientBookingId,
    exportBackupJson,
    importBackupJson,
    resetToSeeds,
  };
}
