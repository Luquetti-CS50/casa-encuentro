import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SiteSettings } from '../../types/domain';
import { Save, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
  onResetSeeds: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onResetSeeds,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar datos si cambia settings desde afuera
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    }, 350);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todos los turnos y configuraciones a los valores iniciales de demostración?')) {
      onResetSeeds();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajustes Operativos del Establecimiento"
      subtitle="Parámetros dinámicos: contacto, cuenta bancaria, señas y mensajes salientes"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección: Identidad del Espacio */}
        <div className="space-y-4">
          <h3 className="text-sm uppercase font-bold tracking-wider text-[#3D5A40] pb-1 border-b border-[#E8E0D2]">
            1. Identidad de Casa Encuentro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Nombre del Espacio
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Lema o Eslogan
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
              Dirección Física
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
              Descripción o Manifiesto
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            />
          </div>
        </div>

        {/* Sección: Contacto y WhatsApp */}
        <div className="space-y-4">
          <h3 className="text-sm uppercase font-bold tracking-wider text-[#3D5A40] pb-1 border-b border-[#E8E0D2]">
            2. Canales de Contacto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Teléfono visible para el público
              </label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                WhatsApp Coordinación (Numérico internacional)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="5491156660016"
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
              <span className="text-[11px] text-[#2C3E2D]/60 mt-0.5 block">
                Sin signos + ni espacios (ej: 5491156660016)
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Cuenta Bancaria y Seña */}
        <div className="space-y-4">
          <h3 className="text-sm uppercase font-bold tracking-wider text-[#3D5A40] pb-1 border-b border-[#E8E0D2]">
            3. Datos de Cobro de Seña
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Alias Bancario
              </label>
              <input
                type="text"
                required
                value={formData.bankAlias}
                onChange={e => setFormData({ ...formData, bankAlias: e.target.value.toUpperCase() })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm font-mono text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Porcentaje de Seña por Defecto (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.defaultDepositPercent}
                onChange={e => setFormData({ ...formData, defaultDepositPercent: Number(e.target.value) })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
              CBU (22 dígitos)
            </label>
            <input
              type="text"
              required
              value={formData.bankCbu}
              onChange={e => setFormData({ ...formData, bankCbu: e.target.value.replace(/[^0-9]/g, '') })}
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm font-mono text-[#1B2B1C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Titular de la Cuenta
              </label>
              <input
                type="text"
                required
                value={formData.bankHolder}
                onChange={e => setFormData({ ...formData, bankHolder: e.target.value })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
                Banco Emisor
              </label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>
          </div>
        </div>

        {/* Sección: Plantilla Dinámica de WhatsApp */}
        <div className="space-y-4">
          <h3 className="text-sm uppercase font-bold tracking-wider text-[#3D5A40] pb-1 border-b border-[#E8E0D2]">
            4. Plantilla de Mensaje para Derivación a WhatsApp
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#1B2B1C] mb-1">
              Estructura con variables dinámicas
            </label>
            <textarea
              rows={4}
              required
              value={formData.whatsappTemplate}
              onChange={e => setFormData({ ...formData, whatsappTemplate: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-xs font-mono text-[#1B2B1C]"
            />
            <p className="text-[11px] text-[#2C3E2D]/60 mt-1">
              Variables disponibles: <code className="bg-[#E8E0D2] px-1 rounded">{'{patient_name}'}</code>,{' '}
              <code className="bg-[#E8E0D2] px-1 rounded">{'{specialist_name}'}</code>,{' '}
              <code className="bg-[#E8E0D2] px-1 rounded">{'{service_title}'}</code>,{' '}
              <code className="bg-[#E8E0D2] px-1 rounded">{'{date}'}</code>,{' '}
              <code className="bg-[#E8E0D2] px-1 rounded">{'{time}'}</code>,{' '}
              <code className="bg-[#E8E0D2] px-1 rounded">{'{deposit_amount}'}</code>.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-[#EBF0EA] border border-[#6E8B68]/40 text-[#233524] text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡Configuración guardada y actualizada en toda la plataforma!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E8E0D2]">
          <button
            type="button"
            onClick={handleReset}
            className="touch-target text-xs text-[#D97D64] hover:underline flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Semillas de Demostración</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="font-bold px-6"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
