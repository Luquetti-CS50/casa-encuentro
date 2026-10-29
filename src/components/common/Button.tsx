import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'danger' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Directiva de accesibilidad universal: Área mínima garantizada de 48px
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
    'active:scale-[0.98]';

  const sizeStyles = {
    sm: 'min-h-[48px] px-4 py-2 text-sm rounded-xl gap-2',
    default: 'min-h-[48px] px-6 py-3 text-base rounded-2xl gap-2.5',
    lg: 'min-h-[52px] px-8 py-3.5 text-lg rounded-2xl gap-3',
    icon: 'min-h-[48px] min-w-[48px] p-2.5 rounded-xl justify-center',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#2C3E2D] hover:bg-[#1B2B1C] text-[#FAF7F2] shadow-sm shadow-[#2C3E2D]/20 focus-visible:ring-[#2C3E2D]',
    secondary:
      'bg-[#6E8B68] hover:bg-[#5B7556] text-[#FAF7F2] shadow-sm focus-visible:ring-[#6E8B68]',
    outline:
      'bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#2C3E2D] border border-[#2C3E2D]/30 focus-visible:ring-[#2C3E2D]',
    gold:
      'bg-[#C29352] hover:bg-[#AD8043] text-[#FAF7F2] shadow-sm shadow-[#C29352]/25 focus-visible:ring-[#C29352]',
    danger:
      'bg-[#D97D64] hover:bg-[#C26B54] text-[#FAF7F2] shadow-sm focus-visible:ring-[#D97D64]',
    ghost:
      'bg-transparent hover:bg-[#F4EFE6] text-[#2C3E2D] focus-visible:ring-[#2C3E2D]/50',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* 
        Directiva estricta de video: Los spinners SÍ sirven, 
        pero EXCLUSIVAMENTE para micro-acciones dentro de botones
      */}
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
