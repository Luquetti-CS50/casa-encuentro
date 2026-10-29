import React, { useState } from 'react';
import { AccessibilityPreferences, FontScale } from '../../types/domain';
import { Eye, Type, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface AccessibilityToolbarProps {
  prefs: AccessibilityPreferences;
  onUpdatePrefs: (prefs: AccessibilityPreferences) => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  prefs,
  onUpdatePrefs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const setFontScale = (scale: FontScale) => {
    onUpdatePrefs({ ...prefs, fontScale: scale });
  };

  const toggleHighContrast = () => {
    onUpdatePrefs({ ...prefs, highContrast: !prefs.highContrast });
  };

  const toggleReducedMotion = () => {
    onUpdatePrefs({ ...prefs, reducedMotion: !prefs.reducedMotion });
  };

  const isCustomized =
    prefs.fontScale !== 'normal' || prefs.highContrast || prefs.reducedMotion;

  return (
    <div className="bg-[#1B2B1C] text-[#FAF7F2] border-b border-[#2C3E2D] text-xs relative z-50">
      {/* Skip-Link accesible para teclado (WCAG 2.4.1) */}
      <a
        href="#cartelera-turnos"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-5 focus:py-3 focus:rounded-2xl focus:bg-[#FAF7F2] focus:text-[#1B2B1C] focus:font-bold focus:shadow-xl focus:ring-2 focus:ring-[#C29352]"
      >
        Saltar directamente a la cartelera de turnos
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#DCE5D8]">
          <Sparkles className="w-3.5 h-3.5 text-[#C29352] flex-shrink-0" />
          <span className="hidden sm:inline font-medium">
            Lectura cómoda y accesibilidad universal
          </span>
          <span className="sm:hidden font-medium">Accesibilidad</span>
        </div>

        {/* Controles rápidos visibles en escritorio y desplegables en móvil */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 bg-[#2C3E2D] p-1 rounded-xl border border-[#6E8B68]/30">
            <span className="px-2 text-[11px] text-[#DCE5D8] flex items-center gap-1">
              <Type className="w-3 h-3" />
              Texto:
            </span>
            {(
              [
                { id: 'normal', label: 'A (100%)' },
                { id: 'large', label: 'A+ (110%)' },
                { id: 'xlarge', label: 'A++ (120%)' },
              ] as { id: FontScale; label: string }[]
            ).map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFontScale(item.id)}
                aria-pressed={prefs.fontScale === item.id}
                className={`min-h-[34px] min-w-[44px] px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  prefs.fontScale === item.id
                    ? 'bg-[#FAF7F2] text-[#1B2B1C] shadow-xs'
                    : 'text-[#FAF7F2]/80 hover:bg-[#3D5A40]/50'
                }`}
                title={`Cambiar tamaño de letra a ${item.label}`}
              >
                {item.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={prefs.highContrast}
            className={`hidden md:inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1 rounded-xl border font-semibold transition-colors cursor-pointer ${
              prefs.highContrast
                ? 'bg-[#C29352] text-[#1B2B1C] border-[#C29352]'
                : 'bg-[#2C3E2D] text-[#FAF7F2] border-[#6E8B68]/30 hover:bg-[#3D5A40]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Alto Contraste</span>
            {prefs.highContrast && <Check className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-pressed={prefs.reducedMotion}
            className={`hidden lg:inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1 rounded-xl border font-semibold transition-colors cursor-pointer ${
              prefs.reducedMotion
                ? 'bg-[#DCE5D8] text-[#1B2B1C] border-[#DCE5D8]'
                : 'bg-[#2C3E2D] text-[#FAF7F2] border-[#6E8B68]/30 hover:bg-[#3D5A40]'
            }`}
            title="Desactiva animaciones y transiciones (ideal para personas con migraña o sensibilidad visual)"
          >
            <span>Calma Visual</span>
            {prefs.reducedMotion && <Check className="w-3 h-3" />}
          </button>

          {/* Botón desplegable para móvil / tablet */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="md:hidden min-h-[38px] px-3 py-1 rounded-xl bg-[#2C3E2D] border border-[#6E8B68]/40 text-[#FAF7F2] font-semibold inline-flex items-center gap-1.5"
          >
            <Type className="w-3.5 h-3.5 text-[#C29352]" />
            <span>Ajustar Vista {isCustomized ? '• Activo' : ''}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Panel móvil desplegable */}
      {isExpanded && (
        <div className="md:hidden bg-[#2C3E2D] border-t border-[#6E8B68]/30 px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-[#DCE5D8]">Tamaño de texto:</span>
            <div className="flex gap-1.5">
              {(
                [
                  { id: 'normal', label: 'Normal (A)' },
                  { id: 'large', label: 'Grande (A+)' },
                  { id: 'xlarge', label: 'Extra (A++)' },
                ] as { id: FontScale; label: string }[]
              ).map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFontScale(item.id)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-xl font-bold text-xs ${
                    prefs.fontScale === item.id
                      ? 'bg-[#FAF7F2] text-[#1B2B1C]'
                      : 'bg-[#1B2B1C] text-[#FAF7F2]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`min-h-[44px] px-3 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border ${
                prefs.highContrast
                  ? 'bg-[#C29352] text-[#1B2B1C] border-[#C29352]'
                  : 'bg-[#1B2B1C] text-[#FAF7F2] border-[#6E8B68]/30'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Alto Contraste</span>
            </button>

            <button
              type="button"
              onClick={toggleReducedMotion}
              className={`min-h-[44px] px-3 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border ${
                prefs.reducedMotion
                  ? 'bg-[#DCE5D8] text-[#1B2B1C] border-[#DCE5D8]'
                  : 'bg-[#1B2B1C] text-[#FAF7F2] border-[#6E8B68]/30'
              }`}
            >
              <span>Calma Visual</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
