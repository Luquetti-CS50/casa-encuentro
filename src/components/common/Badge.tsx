import React from 'react';
import { SlotStatus } from '../../types/domain';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'forest' | 'sage' | 'gold' | 'terracotta' | 'stone';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#F4EFE6] text-[#2C3E2D] border border-[#E8E0D2]',
    forest: 'bg-[#2C3E2D]/10 text-[#2C3E2D] border border-[#2C3E2D]/20',
    sage: 'bg-[#DCE5D8] text-[#233524] border border-[#6E8B68]/30',
    gold: 'bg-[#F9F2E7] text-[#8C6126] border border-[#C29352]/40',
    terracotta: 'bg-[#FBEBE7] text-[#A64A32] border border-[#D97D64]/40',
    stone: 'bg-stone-100 text-stone-600 border border-stone-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: SlotStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'AVAILABLE':
      return (
        <Badge variant="sage" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A40]" />
          Disponible
        </Badge>
      );
    case 'PENDING_DEPOSIT':
      return (
        <Badge variant="gold" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C29352] animate-ping" />
          Esperando Seña
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge variant="forest" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B2B1C]" />
          Confirmado
        </Badge>
      );
    case 'BLOCKED':
      return (
        <Badge variant="stone" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          Bloqueado
        </Badge>
      );
  }
};
