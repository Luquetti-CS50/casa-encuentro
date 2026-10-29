import React from 'react';
import { SiteSettings } from '../../types/domain';
import { MessageCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
  onNavigateToAdmin: () => void;
  onNavigateToBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onNavigateToAdmin,
  onNavigateToBooking,
}) => {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E0D2] transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Marca / Logotipo */}
        <a href="#" className="flex items-center gap-3 touch-target">
          <img
            src="/images/logo.jpg"
            alt={settings.businessName}
            className="w-11 h-11 rounded-xl object-cover border border-[#E8E0D2] shadow-2xs"
          />
          <div>
            <span className="font-serif font-bold text-xl text-[#1B2B1C] tracking-tight block leading-none">
              {settings.businessName}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6E8B68] mt-0.5 block">
              General Las Heras
            </span>
          </div>
        </a>

        {/* Enlaces de Navegación Interna */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#2C3E2D]/85">
          <a
            href="#terapias-espacio"
            className="hover:text-[#1B2B1C] transition-colors py-2"
          >
            Abordaje y Patologías
          </a>
          <a
            href="#cartelera-turnos"
            className="hover:text-[#1B2B1C] transition-colors py-2"
          >
            Cartelera de Turnos
          </a>
          <a
            href="#preguntas-frecuentes"
            className="hover:text-[#1B2B1C] transition-colors py-2"
          >
            Preguntas Frecuentes
          </a>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToBooking}
            className="hidden sm:inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] font-semibold text-sm shadow-sm transition-all touch-target cursor-pointer"
          >
            Reservar Turno
          </button>

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
              '¡Hola Casa Encuentro! Quisiera hacer una consulta sobre los turnos.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center justify-center p-2.5 rounded-2xl border border-[#25D366]/40 bg-[#FAF7F2] hover:bg-[#25D366]/10 text-[#1B2B1C] transition-colors"
            title="Mensaje directo a Coordinación"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span className="sr-only">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2C3E2D] hover:text-[#1B2B1C] bg-[#F4EFE6] hover:bg-[#DCE5D8]/70 border border-[#E8E0D2] transition-colors cursor-pointer"
            title="Acceso al panel administrativo y gestión modular"
          >
            <ShieldCheck className="w-4 h-4 text-[#3D5A40]" />
            <span>Panel Admin</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
