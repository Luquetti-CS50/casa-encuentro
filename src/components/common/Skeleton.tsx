import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bloque esqueleto base con brillo y pulso cálido
 * Directiva: Mide exactamente lo mismo que el contenido real para evitar saltos (CLS)
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * Esqueleto idéntico a la tarjeta de especialista (SpecialistCard)
 */
export const SpecialistCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F4EFE6] border border-[#E8E0D2] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="pt-4 border-t border-[#E8E0D2]/60 space-y-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
};

/**
 * Esqueleto idéntico a un bloque de horario individual (mínimo 48px)
 */
export const SlotButtonSkeleton: React.FC = () => {
  return <Skeleton className="h-12 min-h-[48px] w-full rounded-xl" />;
};

/**
 * Esqueleto idéntico a tarjeta de métricas en Dashboard (/admin)
 */
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F4EFE6] border border-[#E8E0D2] rounded-2xl p-5 shadow-sm h-[116px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
};

/**
 * Esqueleto idéntico a las filas de la tabla de reservas en /admin
 */
export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-[#E8E0D2]/70">
      <td className="py-4 px-4"><Skeleton className="h-4 w-28 rounded" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-32 rounded" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-24 rounded" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
      <td className="py-4 px-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
      <td className="py-4 px-4 text-right"><Skeleton className="h-9 w-28 rounded-lg ml-auto" /></td>
    </tr>
  );
};
