import React, { useState, useRef } from 'react';
import { Specialist, Service } from '../../types/domain';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  UserPlus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Phone,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';

interface SpecialistsManagerProps {
  specialists: Specialist[];
  services: Service[];
  onSaveSpecialist: (specialist: Specialist) => void;
  onDeleteSpecialist: (id: string) => void;
  onReorderSpecialist: (id: string, direction: 'up' | 'down') => void;
}

export const SpecialistsManager: React.FC<SpecialistsManagerProps> = ({
  specialists,
  services,
  onSaveSpecialist,
  onDeleteSpecialist,
  onReorderSpecialist,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialist | null>(null);

  // Estado del formulario
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [specialtyTags, setSpecialtyTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Drag & drop y carga nativa desde almacenamiento
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const processImageFile = (file: File) => {
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('El archivo debe ser una imagen válida (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressed);
        } else {
          setAvatarUrl(dataUrl);
        }
      };
      img.onerror = () => {
        setImageError('No se pudo procesar la imagen seleccionada.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setImageError('Error al leer el archivo desde el dispositivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const openCreateModal = () => {
    setEditingSpec(null);
    setName('');
    setTitle('');
    setBio('');
    setAvatarUrl('');
    setImageError(null);
    setPhone('+54 9 11 ');
    setSpecialtyTags(['Terapia Holística', 'Bienestar']);
    setNewTagInput('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (spec: Specialist) => {
    setEditingSpec(spec);
    setName(spec.name);
    setTitle(spec.title);
    setBio(spec.bio);
    setAvatarUrl(spec.avatarUrl);
    setImageError(null);
    setPhone(spec.phone || '');
    setSpecialtyTags([...spec.specialtyTags]);
    setNewTagInput('');
    setIsActive(spec.isActive);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !specialtyTags.includes(trimmed)) {
      setSpecialtyTags([...specialtyTags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSpecialtyTags(specialtyTags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      const payload: Specialist = {
        id: editingSpec ? editingSpec.id : `spec-${Date.now()}`,
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || '/images/logo.jpg',
        specialtyTags: specialtyTags.length > 0 ? specialtyTags : ['Bienestar Integral'],
        isActive,
        displayOrder: editingSpec ? editingSpec.displayOrder : specialists.length + 1,
        phone: phone.trim(),
      };
      onSaveSpecialist(payload);
      setIsSaving(false);
      setIsModalOpen(false);
    }, 250);
  };

  const handleToggleActive = (spec: Specialist) => {
    onSaveSpecialist({ ...spec, isActive: !spec.isActive });
  };

  const handleConfirmDelete = (spec: Specialist) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar a "${spec.name}"? También puedes simplemente pausar su visibilidad en la cartelera con el botón Activo/Pausado.`
      )
    ) {
      onDeleteSpecialist(spec.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="zen-card bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1B2B1C]">
            Equipo de Profesionales y Terapeutas ({specialists.length})
          </h2>
          <p className="text-sm text-[#2C3E2D]/75 mt-1">
            Agrega nuevos especialistas, edita sus biografías, ordena su prioridad en la cartelera o pausa su visibilidad temporalmente.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          leftIcon={<UserPlus className="w-5 h-5" />}
          className="font-bold shadow-sm flex-shrink-0"
        >
          + Agregar Profesional
        </Button>
      </div>

      {/* Lista de Tarjetas de Profesionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialists.map((spec, idx) => {
          const specServices = services.filter(s => s.specialistId === spec.id);
          return (
            <div
              key={spec.id}
              className={`zen-card bg-[#FAF7F2] border rounded-3xl p-6 shadow-sm transition-all flex flex-col justify-between gap-5 ${
                spec.isActive
                  ? 'border-[#E8E0D2]'
                  : 'border-stone-300 bg-stone-100/70 opacity-80'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={spec.avatarUrl}
                      alt={spec.name}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-[#FAF7F2] shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-serif font-bold text-[#1B2B1C]">
                          {spec.name}
                        </h3>
                        <span
                          className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            spec.isActive
                              ? 'bg-[#DCE5D8] text-[#233524]'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {spec.isActive ? 'Visible en Web' : 'Pausado / Oculto'}
                        </span>
                      </div>
                      <p className="text-sm text-[#3D5A40] font-semibold mt-0.5">
                        {spec.title}
                      </p>
                      {spec.phone && (
                        <p className="text-xs text-[#2C3E2D]/70 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-[#6E8B68]" />
                          <span>{spec.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controles de Ordenamiento */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onReorderSpecialist(spec.id, 'up')}
                      className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg border border-[#E8E0D2] bg-[#F4EFE6] hover:bg-[#DCE5D8] disabled:opacity-30 cursor-pointer flex items-center justify-center"
                      title="Subir orden de aparición"
                      aria-label={`Subir orden de ${spec.name}`}
                    >
                      <ArrowUp className="w-4 h-4 text-[#2C3E2D]" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === specialists.length - 1}
                      onClick={() => onReorderSpecialist(spec.id, 'down')}
                      className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg border border-[#E8E0D2] bg-[#F4EFE6] hover:bg-[#DCE5D8] disabled:opacity-30 cursor-pointer flex items-center justify-center"
                      title="Bajar orden de aparición"
                      aria-label={`Bajar orden de ${spec.name}`}
                    >
                      <ArrowDown className="w-4 h-4 text-[#2C3E2D]" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#2C3E2D]/85 leading-relaxed">
                  {spec.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {spec.specialtyTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F4EFE6] text-[#2C3E2D] border border-[#E8E0D2]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-[#F4EFE6]/70 border border-[#E8E0D2] text-xs text-[#2C3E2D]/80 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-[#1B2B1C]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C29352]" />
                    Prácticas asociadas: {specServices.length}
                  </span>
                  <span className="truncate max-w-[220px]">
                    {specServices.map(s => s.title).join(', ') || 'Ninguna aún'}
                  </span>
                </div>
              </div>

              {/* Barra de Acciones del Profesional */}
              <div className="pt-4 border-t border-[#E8E0D2] flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(spec)}
                  className={`touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    spec.isActive
                      ? 'bg-[#FAF7F2] border-[#E8E0D2] text-[#2C3E2D] hover:bg-[#F4EFE6]'
                      : 'bg-[#DCE5D8] border-[#6E8B68]/40 text-[#1B2B1C]'
                  }`}
                >
                  {spec.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pausar Visibilidad</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#3D5A40]" />
                      <span>Reactivar en Cartelera</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(spec)}
                    className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConfirmDelete(spec)}
                    className="touch-target p-2.5 rounded-xl border border-[#D97D64]/40 text-[#A64A32] hover:bg-[#FBEBE7] transition-colors cursor-pointer"
                    title="Eliminar profesional"
                    aria-label={`Eliminar a ${spec.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Alta / Edición de Profesional */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSpec ? `Editar Profesional: ${editingSpec.name}` : 'Agregar Nuevo Profesional'}
        subtitle="Completa los datos biográficos, etiquetas de especialidad e imagen de presentación"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Nombre o Título del Espacio *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Dra. Clara Méndez"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
                Especialidad / Rol Principal *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Osteopatía & Reiki Integrativo"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              Biografía y Enfoque Terapéutico *
            </label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Describe su experiencia, formación y cómo acompaña a los pacientes..."
              className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C] mb-1">
              WhatsApp del Profesional (para Hoja de Ruta)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+54 9 11 5666-0016"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
            />
          </div>

          {/* Carga de Imagen Drag & Drop para PC / Selector de Almacenamiento en Mobile (Sin links) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C]">
              Fotografía del Profesional *
            </label>

            {/* Input nativo oculto accesible por click o tap */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-3xl p-5 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center touch-target ${
                isDragging
                  ? 'border-[#2C3E2D] bg-[#DCE5D8]/50 scale-[1.01]'
                  : 'border-[#6E8B68]/40 bg-[#FAF7F2] hover:bg-[#F4EFE6] hover:border-[#3D5A40]'
              }`}
            >
              {avatarUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full text-center sm:text-left">
                  <img
                    src={avatarUrl}
                    alt="Previsualización"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FAF7F2] shadow-md flex-shrink-0 bg-[#F4EFE6]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#233524]">
                      <CheckCircle2 className="w-4 h-4 text-[#3D5A40]" />
                      <span>Fotografía cargada</span>
                    </div>
                    <p className="text-xs text-[#2C3E2D]/75">
                      Arrastra otra foto para reemplazarla o toca para elegir desde tu dispositivo / galería
                    </p>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-xs font-semibold text-[#3D5A40] underline hover:text-[#1B2B1C] cursor-pointer"
                    >
                      Seleccionar otra foto
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#DCE5D8] text-[#2C3E2D] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-[#3D5A40]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B2B1C]">
                      Arrastra y suelta tu foto aquí
                    </p>
                    <p className="text-xs text-[#2C3E2D]/70 mt-1">
                      O haz clic para elegir desde tus archivos (en celular abre tu galería o cámara)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {imageError && (
              <p className="text-xs text-rose-600 font-semibold">{imageError}</p>
            )}
          </div>

          {/* Constructor interactivo de etiquetas (Specialty Tags) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1B2B1C]">
              Etiquetas de Especialidad (Tags visibles en la tarjeta)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ej. Reflexología, Acupuntura..."
                className="flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] focus:border-[#2C3E2D] outline-none text-sm text-[#1B2B1C]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Añadir Tag
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {specialtyTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#DCE5D8] text-[#1B2B1C]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:bg-[#2C3E2D]/15 rounded-full min-h-0 min-w-0 cursor-pointer"
                    aria-label={`Quitar etiqueta ${tag}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E0D2]">
            <input
              id="spec-active-toggle"
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded accent-[#2C3E2D] cursor-pointer"
            />
            <label
              htmlFor="spec-active-toggle"
              className="text-sm font-semibold text-[#1B2B1C] cursor-pointer"
            >
              Mostrar este profesional activo en la cartelera pública
            </label>
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
              {editingSpec ? 'Guardar Cambios' : 'Crear Profesional'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
