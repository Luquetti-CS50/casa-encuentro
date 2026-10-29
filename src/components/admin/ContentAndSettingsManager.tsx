import React, { useState } from 'react';
import { SiteSettings, PathologyCategory, FaqItem } from '../../types/domain';
import { Button } from '../common/Button';
import {
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Building2,
  Heart,
  HelpCircle,
} from 'lucide-react';

interface ContentAndSettingsManagerProps {
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => void;
  onExportBackup: () => string;
  onImportBackup: (rawJson: string) => { success: boolean; error?: string };
  onResetSeeds: () => void;
}

export const ContentAndSettingsManager: React.FC<ContentAndSettingsManagerProps> = ({
  settings,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onResetSeeds,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSaveSettings(formData);
      setIsSaving(false);
      setSaveFeedback('¡Todos los cambios y secciones modulares fueron guardados en tiempo real!');
      setTimeout(() => setSaveFeedback(null), 3500);
    }, 300);
  };

  // --- CRUD de Categorías de Patologías ---
  const handleAddPathologyCategory = () => {
    const nextNum = String(formData.pathologyCategories.length + 1).padStart(2, '0');
    const newCat: PathologyCategory = {
      id: `path-${Date.now()}`,
      numberLabel: nextNum,
      title: 'Nueva Área de Abordaje',
      accentColor: formData.pathologyCategories.length % 2 === 0 ? 'sage' : 'gold',
      items: ['Nuevo síntoma o patología tratada'],
    };
    setFormData({
      ...formData,
      pathologyCategories: [...formData.pathologyCategories, newCat],
    });
  };

  const handleUpdatePathology = (id: string, updated: Partial<PathologyCategory>) => {
    setFormData({
      ...formData,
      pathologyCategories: formData.pathologyCategories.map(c =>
        c.id === id ? { ...c, ...updated } : c
      ),
    });
  };

  const handleDeletePathology = (id: string) => {
    setFormData({
      ...formData,
      pathologyCategories: formData.pathologyCategories.filter(c => c.id !== id),
    });
  };

  // --- CRUD de Preguntas Frecuentes (FAQ) ---
  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: '¿Nueva pregunta frecuente para pacientes?',
      answer: 'Escribe aquí la respuesta clara y cálida.',
    };
    setFormData({
      ...formData,
      faqItems: [...formData.faqItems, newFaq],
    });
  };

  const handleUpdateFaq = (id: string, updated: Partial<FaqItem>) => {
    setFormData({
      ...formData,
      faqItems: formData.faqItems.map(f => (f.id === id ? { ...f, ...updated } : f)),
    });
  };

  const handleDeleteFaq = (id: string) => {
    setFormData({
      ...formData,
      faqItems: formData.faqItems.filter(f => f.id !== id),
    });
  };

  // --- Exportar e Importar Backup ---
  const handleDownloadBackup = () => {
    const json = onExportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-casa-encuentro-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        const res = onImportBackup(content);
        if (res.success) {
          setSaveFeedback('¡Copia de seguridad importada y restaurada con éxito!');
          setTimeout(() => setSaveFeedback(null), 3500);
        } else {
          alert(res.error || 'Error al importar archivo JSON');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* Banner flotante de guardado */}
      {saveFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-[#EBF0EA] border border-[#6E8B68]/40 text-[#233524] text-sm font-bold flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-[#3D5A40] flex-shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Bloque 1: Datos del Espacio, Contacto y Cuenta Bancaria */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D2]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1B2B1C] flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#3D5A40]" />
              <span>1. Identidad, Contacto y Cuenta Bancaria</span>
            </h2>
            <p className="text-sm text-[#2C3E2D]/75 mt-1">
              Todo cambio que realices aquí actualiza instantáneamente la página pública, los modales de seña y los mensajes de WhatsApp.
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold px-6"
          >
            Guardar Todo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Nombre del Establecimiento
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Lema / Eslogan Principal
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Dirección / Localidad
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Teléfono Público Visible
            </label>
            <input
              type="text"
              required
              value={formData.contactPhone}
              onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Número de WhatsApp receptor (sin + ni espacios)
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={e =>
                setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })
              }
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm font-mono text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Alias Bancario para Señas
            </label>
            <input
              type="text"
              required
              value={formData.bankAlias}
              onChange={e => setFormData({ ...formData, bankAlias: e.target.value.toUpperCase() })}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm font-mono font-bold text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              CBU (22 dígitos)
            </label>
            <input
              type="text"
              required
              value={formData.bankCbu}
              onChange={e =>
                setFormData({ ...formData, bankCbu: e.target.value.replace(/[^0-9]/g, '') })
              }
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm font-mono text-[#1B2B1C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Titular Cuenta
              </label>
              <input
                type="text"
                required
                value={formData.bankHolder}
                onChange={e => setFormData({ ...formData, bankHolder: e.target.value })}
                className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Banco
              </label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
            Manifiesto / Descripción de Bienvenida
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
            Plantilla de Mensaje Saliente hacia WhatsApp
          </label>
          <textarea
            rows={4}
            value={formData.whatsappTemplate}
            onChange={e => setFormData({ ...formData, whatsappTemplate: e.target.value })}
            className="w-full p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-mono text-[#1B2B1C]"
          />
        </div>
      </div>

      {/* Bloque 2: Tarjetas Modulares de Patologías ("Tratamos Diversas Patologías") */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D2]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1B2B1C] flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#3D5A40]" />
              <span>2. Sección Modular: Patologías y Áreas Tratadas</span>
            </h2>
            <p className="text-sm text-[#2C3E2D]/75 mt-1">
              Personaliza las tarjetas informativas de patologías que se exhiben en la portada (un ítem por renglón).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPathologyCategory}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Agregar Tarjeta de Área
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {formData.pathologyCategories.map(cat => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={cat.numberLabel}
                    onChange={e => handleUpdatePathology(cat.id, { numberLabel: e.target.value })}
                    className="w-16 min-h-[40px] px-2.5 py-1 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm font-serif font-bold text-center text-[#1B2B1C]"
                    aria-label="Número de tarjeta"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePathology(cat.id)}
                    className="p-2 rounded-xl text-[#A64A32] hover:bg-[#FBEBE7] min-h-0 min-w-0 cursor-pointer"
                    title="Eliminar tarjeta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#2C3E2D]/70 mb-1">
                    Título de la Categoría
                  </label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={e => handleUpdatePathology(cat.id, { title: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm font-bold text-[#1B2B1C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#2C3E2D]/70 mb-1">
                    Patologías / Síntomas (1 por línea)
                  </label>
                  <textarea
                    rows={5}
                    value={cat.items.join('\n')}
                    onChange={e =>
                      handleUpdatePathology(cat.id, {
                        items: e.target.value.split('\n').filter(line => line.trim() !== ''),
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-xs text-[#1B2B1C] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloque 3: Preguntas Frecuentes (FAQ) Editables */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D2]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1B2B1C] flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#3D5A40]" />
              <span>3. Sección Modular: Preguntas Frecuentes (FAQ)</span>
            </h2>
            <p className="text-sm text-[#2C3E2D]/75 mt-1">
              Añade o edita recomendaciones previas al turno para reducir consultas repetitivas por WhatsApp.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFaq}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Agregar Pregunta
          </Button>
        </div>

        <div className="space-y-4">
          {formData.faqItems.map(faq => (
            <div
              key={faq.id}
              className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase text-[#2C3E2D]/70 mb-1">
                    Pregunta
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => handleUpdateFaq(faq.id, { question: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm font-bold text-[#1B2B1C]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="mt-5 p-2.5 rounded-xl text-[#A64A32] hover:bg-[#FBEBE7] cursor-pointer"
                  title="Eliminar pregunta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#2C3E2D]/70 mb-1">
                  Respuesta
                </label>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={e => handleUpdateFaq(faq.id, { answer: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloque 4: Respaldo Portátil y Semillas */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1B2B1C]">
            Respaldo de Base Operativa (JSON) y Restauración
          </h3>
          <p className="text-xs text-[#2C3E2D]/75 mt-1 max-w-xl">
            Descarga una copia completa de tus profesionales, tarifas, turnos y configuraciones para guardarla de forma segura, o restaura los datos iniciales de demostración.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadBackup}
            leftIcon={<Download className="w-4 h-4 text-[#3D5A40]" />}
          >
            Exportar Backup (.json)
          </Button>

          <label className="touch-target inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2C3E2D]/30 bg-[#FAF7F2] hover:bg-[#F4EFE6] text-xs font-bold text-[#2C3E2D] cursor-pointer">
            <Upload className="w-4 h-4 text-[#3D5A40]" />
            <span>Importar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleUploadBackup}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  '¿Restablecer todos los datos a las semillas iniciales de demostración?'
                )
              ) {
                onResetSeeds();
              }
            }}
            className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D97D64]/40 text-xs font-bold text-[#A64A32] hover:bg-[#FBEBE7] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Demo</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </form>
  );
};
