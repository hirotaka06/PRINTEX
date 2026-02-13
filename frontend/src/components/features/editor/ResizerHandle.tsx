'use client';

interface ResizerHandleProps {
  onMouseDown: () => void;
}

export function ResizerHandle({ onMouseDown }: ResizerHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="resizer-handle h-2 bg-white border-y border-gray-50 hover:bg-gray-50 cursor-row-resize flex items-center justify-center shrink-0 z-10 relative -mx-1 transition-colors group"
    >
      <div className="w-10 h-1 bg-gray-200 rounded-full transition-colors"></div>
    </div>
  );
}
