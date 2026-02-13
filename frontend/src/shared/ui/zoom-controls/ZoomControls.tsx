'use client';

import { Icon } from '@iconify/react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
}

/**
 * ズームコントロールコンポーネント
 * PDFプレビューなどのズーム機能を提供します
 */
export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  minZoom = 50,
  maxZoom = 200,
  className = '',
}: ZoomControlsProps) {
  return (
    <div className={`flex items-center gap-2 bg-gray-50 rounded-lg p-1 ${className}`}>
      <button
        className="p-1 text-gray-400 hover:text-gray-900 rounded-full transition-all"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        aria-label="ズームアウト"
      >
        <Icon icon="solar:minus-linear" width={14} />
      </button>
      <span className="text-[10px] font-medium w-8 text-center text-gray-600 font-mono">
        {zoom}%
      </span>
      <button
        className="p-1 text-gray-400 hover:text-gray-900 rounded-full transition-all"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="ズームイン"
      >
        <Icon icon="solar:add-linear" width={14} />
      </button>
    </div>
  );
}
