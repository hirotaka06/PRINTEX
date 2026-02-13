'use client';

export type DocumentMode = 'problem' | 'explanation';

interface DocumentModeSwitcherProps {
  currentMode: DocumentMode;
  onModeChange: (mode: DocumentMode) => void;
  className?: string;
}

export function DocumentModeSwitcher({
  currentMode,
  onModeChange,
  className = '',
}: DocumentModeSwitcherProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 rounded-tl-2xl ${className}`}>
      <div className="flex p-1 bg-gray-100 rounded-xl select-none">
        <button
          onClick={() => onModeChange('problem')}
          className={`px-4 py-1.5 text-sm transition-all duration-200 flex items-center gap-2 rounded-lg border ${
            currentMode === 'problem'
              ? 'font-medium text-gray-900 bg-white border-gray-200 shadow-sm'
              : 'font-medium text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          問題ソース
        </button>
        <button
          onClick={() => onModeChange('explanation')}
          className={`px-4 py-1.5 text-sm transition-all duration-200 flex items-center gap-2 rounded-lg border ${
            currentMode === 'explanation'
              ? 'font-medium text-gray-900 bg-white border-gray-200 shadow-sm'
              : 'font-medium text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          解説ソース
        </button>
      </div>
    </div>
  );
}
