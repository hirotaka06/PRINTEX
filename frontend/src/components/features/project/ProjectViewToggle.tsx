'use client';

import { Icon } from '@iconify/react';

type ViewMode = 'grid' | 'list';

interface ProjectViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProjectViewToggle({ viewMode, onViewModeChange }: ProjectViewToggleProps) {
  return (
    <div className="flex h-[42px] w-[84px] items-center bg-gray-100 rounded-3xl p-1 relative">
      {/* アクティブなボタン（グリッドビュー） */}
      <button
        onClick={() => onViewModeChange('grid')}
        className={`w-1/2 h-full transition-all duration-200 flex items-center justify-center rounded-2xl ${
          viewMode === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-600'
        }`}
      >
        <Icon icon="solar:widget-4-linear" width={18} />
      </button>
      {/* アクティブなボタン（リストビュー） */}
      <button
        onClick={() => onViewModeChange('list')}
        className={`w-1/2 h-full transition-all duration-200 flex items-center justify-center rounded-2xl ${
          viewMode === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-600'
        }`}
      >
        <Icon icon="solar:list-linear" width={18} />
      </button>
    </div>
  );
}
