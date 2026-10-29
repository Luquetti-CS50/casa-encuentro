import { useState, useEffect } from 'react';
import { useCasaStore } from './hooks/useCasaStore';
import { Navbar } from './components/storefront/Navbar';
import { ActiveBookingBanner } from './components/storefront/ActiveBookingBanner';
import { Hero } from './components/storefront/Hero';
import { TherapiesShowcase } from './components/storefront/TherapiesShowcase';
import { DualBoard } from './components/storefront/DualBoard';
import { FaqSection } from './components/storefront/FaqSection';
import { Footer } from './components/storefront/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const {
    settings,
    specialists,
    services,
    scheduleDays,
    timeSlots,
    bookings,
    lastPatientBookingId,
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
    requestBooking,
    confirmBookingDeposit,
    releaseBookingSlot,
    clearLastPatientBookingId,
    exportBackupJson,
    importBackupJson,
    resetToSeeds,
  } = useCasaStore();

  // Gestión de ruta activa (/ o /admin)
  const [currentRoute, setCurrentRoute] = useState<'storefront' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'storefront';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('storefront');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'storefront' | 'admin') => {
    setCurrentRoute(route);
    const targetPath = route === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    const el = document.getElementById('cartelera-turnos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reserva reciente del paciente en este dispositivo (Calidad de Vida / QoL)
  const activePatientBooking = lastPatientBookingId
    ? bookings.find(b => b.id === lastPatientBookingId)
    : undefined;

  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminDashboard
          specialists={specialists}
          services={services}
          scheduleDays={scheduleDays}
          timeSlots={timeSlots}
          bookings={bookings}
          settings={settings}
          onConfirmDeposit={confirmBookingDeposit}
          onReleaseSlot={releaseBookingSlot}
          onUpdateSlotStatus={updateSlotStatus}
          onDeleteSlot={deleteSlot}
          onSaveSchedule={(day, slots) => {
            saveScheduleDay(day);
            saveTimeSlots(slots);
          }}
          onSaveSpecialist={saveSpecialist}
          onDeleteSpecialist={deleteSpecialist}
          onReorderSpecialist={reorderSpecialist}
          onSaveService={saveService}
          onDeleteService={deleteService}
          onUpdateSettings={updateSettings}
          onExportBackup={exportBackupJson}
          onImportBackup={importBackupJson}
          onResetSeeds={resetToSeeds}
          onRequestBooking={data => {
            const res = requestBooking({
              timeSlotId: data.timeSlotId,
              specialistId: data.specialistId,
              serviceId: data.serviceId,
              patientName: data.patientName,
              patientPhone: data.patientPhone,
              patientNotes: data.patientNotes,
            });
            if (res.success && res.booking && data.depositVerified) {
              confirmBookingDeposit(res.booking.id);
            }
          }}
          onBackToStorefront={() => navigateTo('storefront')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E2D] flex flex-col font-sans">
      <Navbar
        settings={settings}
        onNavigateToAdmin={() => navigateTo('admin')}
        onNavigateToBooking={scrollToBooking}
      />

      {activePatientBooking && (
        <ActiveBookingBanner
          booking={activePatientBooking}
          slot={timeSlots.find(s => s.id === activePatientBooking.timeSlotId)}
          specialist={specialists.find(s => s.id === activePatientBooking.specialistId)}
          service={services.find(s => s.id === activePatientBooking.serviceId)}
          settings={settings}
          onDismiss={clearLastPatientBookingId}
        />
      )}

      <main className="flex-1">
        <Hero settings={settings} onExploreClick={scrollToBooking} />

        <TherapiesShowcase settings={settings} />

        <DualBoard
          specialists={specialists}
          services={services}
          timeSlots={timeSlots}
          settings={settings}
          onRequestBooking={requestBooking}
        />

        <FaqSection settings={settings} />
      </main>

      <Footer
        settings={settings}
        onAdminClick={() => navigateTo('admin')}
      />
    </div>
  );
}

export default App;
