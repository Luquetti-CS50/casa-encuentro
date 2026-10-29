import React, { useState, useMemo } from 'react';
import { Specialist, Service, DepositType } from '../../types/domain';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ServicesManagerProps {
  specialists: Specialist[];
  services: Service[];
  defaultDepositPercent: number;
  onSaveService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  specialists,
  services,
  defaultDepositPercent,
  onSaveService,
  onDeleteService,
}) => {
  const [filterSpecId, setFilterSpecId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Estado del formulario
  const [specialistId, setSpecialistId] = useState(specialists[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(20000);
  const [depositType, setDepositType] = useState<DepositType>('percentage');
  const [depositValue, setDepositValue] = useState(defaultDepositPercent);
  const [badge, setBadge] = useState('Sesión Individual');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const filteredServices = useMemo(() => {
    if (filterSpecId === 'all') return services;
    return services.filter(s => s.specialistId === filterSpecId);
  }, [services, filterSpecId]);

  const openCreateModal = () => {
    setEditingService(null);
    setSpecialistId(filterSpecId !== 'all' ? filterSpecId : specialists[0]?.id || '');
    setTitle('');
    setDescription('');
    setDurationMinutes(60);
    setPrice(22000);
    setDepositType('percentage');
    setDepositValue(defaultDepositPercent);
    setBadge('Sesión Individual');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setSpecialistId(srv.specialistId);
    setTitle(srv.title);
    setDescription(srv.description);
    setDurationMinutes(srv.durationMinutes);
    setPrice(srv.price);
    setDepositType(srv.depositType);
    setDepositValue(srv.depositValue);
    setBadge(srv.badge || '');
    setIsActive(srv.isActive);
    setIsModalOpen(true);
  };

  const calculatedDepositPreview = useMemo(() => {
    if (depositType === 'fixed') return depositValue;
    return Math.round((price * depositValue) / 100);
  }, [price, depositType, depositValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !specialistId) return;

    setIsSaving(true);
    setTimeout(() => {
      const payload: Service = {
        id: editingService ? editingService.id : `srv-${Date.now()}`,
        specialistId,
        title: title.trim(),
        description: description.trim(),
        durationMinutes: Number(durationMinutes) || 60,
        price: Number(price) || 0,
        depositType,
        depositValue: Number(depositValue) || 0,
        isActive,
        badge: badge.trim() || undefined,
      };
      onSaveService(payload);
      setIsSaving(false);
      setIsModalOpen(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera y Filtro por Profesional */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1B2B1C]">
            Catálogo de Prácticas, Terapias y Tarifas ({filteredServices.length})
          </h2>
          <p className="text-sm text-[#2C3E2D]/75 mt-1">
            Define la duración, el valor de referencia y la política de seña de cada servicio brindado en el espacio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterSpecId}
            onChange={e => setFilterSpecId(e.target.value)}
            aria-label="Filtrar prácticas por profesional"
            className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] text-xs font-bold text-[#1B2B1C] outline-none"
          >
            <option value="all">Todos los Profesionales</option>
            {specialists.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            onClick={openCreateModal}
            leftIcon={<Plus className="w-5 h-5" />}
            className="font-bold shadow-sm"
          >
            + Nueva Práctica / Terapia
          </Button>
        </div>
      </div>

      {/* Grilla de Prácticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map(srv => {
          const spec = specialists.find(s => s.id === srv.specialistId);
          const depositMoney =
            srv.depositType === 'fixed'
              ? srv.depositValue
              : Math.round((srv.price * srv.depositValue) / 100);

          return (
            <div
              key={srv.id}
              className={`zen-card bg-[#FAF7F2] border rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4 ${
                srv.isActive ? 'border-[#E8E0D2]' : 'border-stone-300 bg-stone-100/70 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {srv.badge && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#DCE5D8] text-[#2C3E2D]">
                          {srv.badge}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#3D5A40]">
                        • {spec?.name || 'Sin asignar'}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#1B2B1C] mt-1">
                      {srv.title}
                    </h3>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-serif font-bold text-[#1B2B1C] block">
                      ${srv.price.toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs font-bold text-[#C29352]">
                      Seña: ${depositMoney.toLocaleString('es-AR')}{' '}
                      ({srv.depositType === 'percentage' ? `${srv.depositValue}%` : 'Fija'})
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#2C3E2D]/80 leading-relaxed">
                  {srv.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#2C3E2D]/70 font-semibold pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3D5A40]" />
                    Duración: {srv.durationMinutes} minutos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C29352]" />
                    {srv.isActive ? 'Activa para reservas' : 'Pausada'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E0D2] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSaveService({ ...srv, isActive: !srv.isActive })}
                  className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8E0D2] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-xs font-bold text-[#2C3E2D] cursor-pointer"
                >
                  {srv.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#3D5A40]" />
                      <span>Activar</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(srv)}
                    className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Tarifa / Datos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la práctica "${srv.title}"?`)) {
                        onDeleteService(srv.id);
                      }
                    }}
                    className="touch-target p-2.5 rounded-xl border border-[#D97D64]/40 text-[#A64A32] hover:bg-[#FBEBE7] cursor-pointer"
                    title="Eliminar práctica"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear / Editar Servicio */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Editar Práctica o Terapia' : 'Nueva Práctica o Terapia'}
        subtitle="Configura duración, arancel y política de seña"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Profesional a cargo *
              </label>
              <select
                value={specialistId}
                onChange={e => setSpecialistId(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
              >
                {specialists.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Etiqueta Destacada (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="Ej. Sesión Individual, Recomendado..."
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Título de la Práctica / Terapia *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Sesión de Acupuntura y Moxibustión"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Descripción para el Paciente *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explica en qué consiste la sesión y qué beneficios aporta..."
              className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Duración Estimada (Minutos) *
              </label>
              <input
                type="number"
                min="15"
                step="5"
                required
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Valor Total de la Sesión ($ ARS) *
              </label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm font-bold text-[#1B2B1C]"
              />
            </div>
          </div>

          {/* Política de Seña */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                  Modalidad de Seña
                </label>
                <select
                  value={depositType}
                  onChange={e => setDepositType(e.target.value as DepositType)}
                  className="w-full min-h-[48px] px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm text-[#1B2B1C]"
                >
                  <option value="percentage">Porcentaje del total (%)</option>
                  <option value="fixed">Monto fijo en pesos ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                  {depositType === 'percentage' ? 'Porcentaje de Seña (%)' : 'Monto Fijo de Seña ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={depositType === 'percentage' ? 100 : price}
                  required
                  value={depositValue}
                  onChange={e => setDepositValue(Number(e.target.value))}
                  className="w-full min-h-[48px] px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-sm font-bold text-[#1B2B1C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D2] text-sm">
              <span className="text-[#2C3E2D]/80 font-medium">
                Seña que se le solicitará transferir al paciente:
              </span>
              <span className="text-lg font-serif font-bold text-[#C29352]">
                ${calculatedDepositPreview.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0D2]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              className="font-bold px-6"
            >
              {editingService ? 'Guardar Cambios' : 'Crear Práctica'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
