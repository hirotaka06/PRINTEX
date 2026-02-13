'use client';

import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import Image from 'next/image';

interface ImageUploadAreaProps {
  height: number;
  onFileSelect?: (file: File) => void;
  isProcessing?: boolean;
  error?: string | null;
  imageUrl?: string | null;
}

export function ImageUploadArea({
  height,
  onFileSelect,
  isProcessing = false,
  error = null,
  imageUrl = null,
}: ImageUploadAreaProps) {

  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect && !isProcessing) {
      onFileSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div style={{ height, flex: 'none' }} className="px-6 py-4 flex flex-col relative shrink-0">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">問題画像 (OCR対象)</span>
        <button className="text-gray-400 hover:text-gray-600">
          <Icon icon="solar:menu-dots-linear" width={16} />
        </button>
      </div>
      <div className="flex-1 min-h-0 relative">
        {imageUrl ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              key={imageUrl}
              src={imageUrl}
              alt="Uploaded problem image"
              fill
              className="object-contain"
              unoptimized
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                <div className="animate-spin">
                  <Icon icon="solar:refresh-linear" width={24} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">OCR処理中...</p>
                  <p className="text-[10px] text-gray-200 mt-1">しばらくお待ちください</p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center gap-3 px-4">
                <div className="p-2 bg-red-100 rounded-md border border-red-200">
                  <Icon icon="solar:danger-triangle-linear" width={24} className="text-red-500" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">エラーが発生しました</p>
                  <p className="text-[10px] text-red-100 mt-1">{error}</p>
                </div>
              </div>
            )}
            <label className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-md border border-gray-200 cursor-pointer transition-colors">
              <Icon icon="solar:gallery-add-linear" width={16} className="text-gray-700" />
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
          </div>
        ) : (
          <label
            className={`group relative flex flex-col items-center justify-center w-full h-full border border-dashed rounded-2xl transition-all duration-200 overflow-hidden ${
              isProcessing
                ? 'border-gray-400 bg-gray-50 cursor-wait shadow-sm'
                : error
                ? 'border-red-300 bg-red-50/30 hover:bg-red-50/50 hover:border-red-400 cursor-pointer'
                : 'border-gray-300 hover:bg-gray-50/80 hover:border-gray-400 cursor-pointer bg-gray-50/30 shadow-sm'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin">
                  <Icon icon="solar:refresh-linear" width={24} className="text-gray-700" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700">OCR処理中...</p>
                  <p className="text-[10px] text-gray-400 mt-1">しばらくお待ちください</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 px-4">
                <div className="p-2 bg-red-100 rounded-md border border-red-200">
                  <Icon icon="solar:danger-triangle-linear" width={24} className="text-red-500" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-red-700">エラーが発生しました</p>
                  <p className="text-[10px] text-red-500 mt-1">{error}</p>
                  <p className="text-[10px] text-gray-400 mt-2">別の画像を選択してください</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-gray-200 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon icon="solar:gallery-add-linear" width={24} className="text-gray-700" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    画像をアップロード
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">ドラッグ＆ドロップ (PNG, JPG)</p>
                </div>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>
        )}
      </div>
    </div>
  );
}
