'use client';

import { Icon } from '@iconify/react';

interface FloatingHelpButtonProps {
  onClick?: () => void;
}

export function FloatingHelpButton({ onClick }: FloatingHelpButtonProps) {
  return (
    <button
      className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 z-50 shadow-sm"
      onClick={onClick}
    >
      <Icon icon="solar:question-circle-linear" width={20} />
    </button>
  );
}
