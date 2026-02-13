'use client';

import { Icon } from '@iconify/react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const sizeStyles = {
    sm: 24,
    md: 48,
    lg: 64,
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Icon
        icon="svg-spinners:ring-resize"
        width={sizeStyles[size]}
        className="text-gray-900"
      />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}
