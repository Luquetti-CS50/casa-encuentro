import React from 'react';
import { SiteSettings } from '../../types/domain';
import { MapPin, Phone, Sparkles, MessageSquare } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminClick }) => {
  return (
    <footer className="bg-[#F4EFE6] border-t border-[#E8E0D2] pt-16 pb-12 text-[#2C3E2D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E8E0D2]">
          
          {/* Columna Marca */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt={settings.businessName}
                className="w-12 h-12 rounded-xl object-cover border border-[#E8E0D2]"
              />
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1B2B1C]">
                  {settings.businessName}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#6E8B68] font-semibold">
                  Salud & Bienestar Integral
                </p>
              </div>
            </div>
            <p className="text-sm font-serif italic text-[#3D5A40] leading-relaxed">
              "{settings.tagline}"
            </p>
            <p className="text-xs text-[#2C3E2D]/75 leading-relaxed max-w-sm">
              Un espacio para sanar, soltar y volver a tu centro. Acompañamos tu salud física y energética en armonía con la naturaleza.
            </p>
          </div>

          {/* Columna Contacto & Ubicación */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1B2B1C]">
              Encuéntranos en
            </h4>
            <div className="space-y-2.5 text-sm text-[#2C3E2D]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#3D5A40] flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#3D5A40] flex-shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Columna Acceso Rápido & Coordinación */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1B2B1C]">
              Coordinación
            </h4>
            <p className="text-xs text-[#2C3E2D]/75">
              Portal interno de gestión de agenda, validación de señas y configuración de especialistas.
            </p>
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#2C3E2D]/20 text-xs font-semibold text-[#1B2B1C] hover:bg-[#E8E0D2]/50 transition-colors"
              >
                <span>Acceder al Panel (/admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra Inferior & Componente de Créditos Profesionales con Derivación Comercial */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2C3E2D]/70">
          <p>
            &copy; {new Date().getFullYear()} {settings.businessName}. Todos los derechos reservados.
          </p>

          {/* 
            Requisito mandatorio del prompt:
            "Integra en el pie de página público el componente de créditos profesionales enlazado a consulta comercial vía WhatsApp."
          */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D2] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C29352]" />
            <span className="text-[#2C3E2D]/80">Desarrollado con excelencia por</span>
            <a
              href={settings.developerCreditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#1B2B1C] hover:text-[#3D5A40] inline-flex items-center gap-1 underline underline-offset-2 transition-colors touch-target min-h-0 min-w-0"
              title="Contactar para desarrollo web y sistemas"
            >
              <span>{settings.developerCreditName}</span>
              <MessageSquare className="w-3 h-3 text-[#25D366]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
