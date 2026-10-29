import React, { useState } from 'react';
import { SiteSettings } from '../../types/domain';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  settings: SiteSettings;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ settings }) => {
  const [openId, setOpenId] = useState<string | null>(settings.faqItems[0]?.id || null);

  if (!settings.faqItems || settings.faqItems.length === 0) return null;

  return (
    <section id="preguntas-frecuentes" className="py-16 bg-[#F4EFE6]/60 border-t border-[#E8E0D2] scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE5D8] text-[#2C3E2D] text-xs font-semibold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-[#3D5A40]" />
            <span>Información Útil & Preparación</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1B2B1C]">
            Preguntas Frecuentes
          </h2>
          <p className="text-base text-[#2C3E2D]/80 max-w-xl mx-auto">
            Todo lo que necesitas saber antes de asistir a tu encuentro en nuestro espacio.
          </p>
        </div>

        <div className="space-y-3">
          {settings.faqItems.map(item => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[56px] px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F4EFE6]/50 transition-colors cursor-pointer touch-target"
                >
                  <span className="font-serif font-bold text-lg text-[#1B2B1C]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#3D5A40] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-base text-[#2C3E2D]/85 leading-relaxed border-t border-[#E8E0D2]/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E8E0D2] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-serif font-bold text-lg text-[#1B2B1C]">
              ¿Tienes alguna duda particular sobre tu dolencia o tratamiento?
            </p>
            <p className="text-sm text-[#2C3E2D]/75 mt-0.5">
              Escríbenos directamente a Coordinación y te orientaremos con calidez.
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
              '¡Hola Casa Encuentro! Quisiera recibir orientación sobre qué terapia es más recomendable para mí.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] text-sm font-bold transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#A3D9A5]" />
            <span>Consultar a Coordinación</span>
          </a>
        </div>
      </div>
    </section>
  );
};
