import React from 'react';
import { SiteSettings } from '../../types/domain';
import { Heart } from 'lucide-react';

interface TherapiesShowcaseProps {
  settings: SiteSettings;
}

export const TherapiesShowcase: React.FC<TherapiesShowcaseProps> = ({ settings }) => {
  const { pathologyCategories, galleryItems } = settings;

  return (
    <section id="terapias-espacio" className="py-10 sm:py-14 md:py-20 bg-[#FAF7F2] border-b border-[#E8E0D2] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE5D8] text-[#2C3E2D] text-xs font-semibold tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5 text-[#3D5A40]" />
            <span>Abordaje Terapéutico Integral</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1B2B1C]">
            Tratamos Diversas Patologías
          </h2>
          <p className="text-sm sm:text-base text-[#2C3E2D]/80 leading-relaxed">
            Combinamos técnicas orientales y occidentales milenarias para devolver el equilibrio orgánico a tu cuerpo y mente.
          </p>
        </div>

        {/* Columnas Dinámicas de Patologías: carrusel swipe en mobile para no alargar la pantalla */}
        <div>
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible no-scrollbar">
            {pathologyCategories.map(cat => {
              const isGold = cat.accentColor === 'gold';
              return (
                <div
                  key={cat.id}
                  className="w-[85vw] max-w-[320px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-5 sm:p-7 shadow-sm space-y-3 sm:space-y-4 hover:border-[#6E8B68]/50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-lg sm:text-xl ${
                      isGold
                        ? 'bg-[#F9F2E7] text-[#C29352] border border-[#C29352]/20'
                        : 'bg-[#DCE5D8] text-[#2C3E2D] border border-[#6E8B68]/20'
                    }`}
                  >
                    {cat.numberLabel}
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1B2B1C]">
                    {cat.title}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#2C3E2D]/85">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className={`${isGold ? 'text-[#C29352]' : 'text-[#3D5A40]'} font-bold mt-0.5`}>
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="sm:hidden text-center text-[11px] text-[#2C3E2D]/60 mt-1 font-medium">
            &larr; Desliza horizontalmente para ver más abordajes &rarr;
          </p>
        </div>

        {/* Galería Visual Dinámica del Predio: 2 columnas en mobile */}
        {galleryItems.length > 0 && (
          <div className="pt-4 sm:pt-8 space-y-4 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B2B1C]">
                El Encuentro con la Calma
              </h3>
              <p className="text-xs sm:text-sm text-[#2C3E2D]/75 mt-0.5 font-serif italic">
                Naturaleza, silencio y espacios preparados con dedicación
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {galleryItems.map(item => (
                <div
                  key={item.id}
                  className="zen-card relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-sm group border border-[#E8E0D2]"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B1C]/80 via-transparent to-transparent flex items-end p-2.5 sm:p-4">
                    <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
