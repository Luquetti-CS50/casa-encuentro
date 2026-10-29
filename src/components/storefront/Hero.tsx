import React from 'react';
import { Sparkles, Calendar, Heart, MessageCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { SiteSettings } from '../../types/domain';

interface HeroProps {
  settings: SiteSettings;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onExploreClick }) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] pt-8 pb-10 sm:pt-12 sm:pb-14 md:pt-16 md:pb-20 border-b border-[#E8E0D2]">
      {/* Detalle orgánico decorativo superior */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6E8B68]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna de Texto y Manifiesto */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE5D8]/70 border border-[#6E8B68]/30 text-xs font-semibold tracking-wider text-[#2C3E2D] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#3D5A40]" />
              <span>Espacio de Salud, Bienestar & Terapias Holísticas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1B2B1C] tracking-tight leading-[1.15]">
              Cuerpo en equilibrio,{' '}
              <span className="italic font-normal text-[#3D5A40]">vida en armonía.</span>
            </h1>

            <p className="text-lg sm:text-2xl font-serif text-[#3D5A40] italic leading-relaxed">
              "{settings.tagline}"
            </p>

            <p className="text-sm sm:text-base text-[#2C3E2D]/85 leading-relaxed max-w-2xl font-sans">
              {settings.description}
            </p>

            {/* Puntos destacados compactos en mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-3 rounded-2xl bg-[#FAF7F2]/80 border border-[#E8E0D2]">
                <div className="p-1.5 sm:p-2.5 rounded-xl bg-[#DCE5D8] text-[#2C3E2D] flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-[#2C3E2D]/70 uppercase font-semibold">Atención</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1B2B1C] leading-tight">Personalizada</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-3 rounded-2xl bg-[#FAF7F2]/80 border border-[#E8E0D2]">
                <div className="p-1.5 sm:p-2.5 rounded-xl bg-[#F9F2E7] text-[#C29352] flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-[#2C3E2D]/70 uppercase font-semibold">Reserva</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1B2B1C] leading-tight">Simple y Ágil</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-3 rounded-2xl bg-[#FAF7F2]/80 border border-[#E8E0D2]">
                <div className="p-1.5 sm:p-2.5 rounded-xl bg-[#DCE5D8] text-[#2C3E2D] flex-shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-[#2C3E2D]/70 uppercase font-semibold">Seña Bancaria</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1B2B1C] leading-tight">Alias & WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Llamados a la Acción */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onExploreClick}
                className="w-full sm:w-auto text-sm sm:text-base font-semibold shadow-md"
              >
                Ver Cartelera y Reservar Turno
              </Button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('¡Hola Casa Encuentro! Quisiera hacer una consulta general.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] sm:min-h-[52px] px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl border border-[#2C3E2D]/30 bg-transparent hover:bg-[#FAF7F2] text-[#2C3E2D] font-medium transition-colors touch-target text-sm sm:text-base"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>

          {/* Columna Visual: Tarjeta de Presentación Zen sin sobreposiciones */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md bg-[#FAF7F2] rounded-3xl p-3 sm:p-4 shadow-xl border border-[#E8E0D2]">
              {/* Imagen Principal limpia */}
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-inner">
                <img
                  src="/images/medicina-china.jpg"
                  alt="Espacio de atención en Casa Encuentro"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pie de tarjeta integrado en flujo natural (sin superponerse a la imagen ni a textos) */}
              <div className="pt-3 px-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo.jpg"
                    alt="Logo Casa Encuentro"
                    className="w-10 h-10 rounded-xl object-cover border border-[#E8E0D2] shadow-2xs"
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-[#3D5A40]">Coordinación</p>
                    <p className="text-sm font-bold text-[#1B2B1C]">{settings.businessName}</p>
                  </div>
                </div>
                <span className="text-xs text-[#2C3E2D]/75 font-semibold bg-[#E8E0D2]/60 px-3 py-1 rounded-full whitespace-nowrap">
                  General Las Heras
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
