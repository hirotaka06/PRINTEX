'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Icon } from '@iconify/react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 focus:ring-gray-900 shadow-sm',
      secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-900 shadow-sm',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500 shadow-sm',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-900',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs h-6', // 約24px高さ（タグ用）
      md: 'px-6 py-3 text-sm', // 標準ボタン
      lg: 'px-7 py-3 text-base', // 大きなボタン
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Icon icon="svg-spinners:ring-resize" width={16} className="mr-2" />
            <span>処理中...</span>
          </>
        ) : (
          <>
            {leftIcon && <Icon icon={leftIcon} width={16} className="mr-2" />}
            {children}
            {rightIcon && <Icon icon={rightIcon} width={16} className="ml-2" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
