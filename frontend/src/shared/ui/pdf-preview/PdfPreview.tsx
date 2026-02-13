'use client';

import { Icon } from '@iconify/react';

interface PdfPreviewProps {
  pdfUrl: string | null;
  zoom: number;
  className?: string;
}

/**
 * PDFプレビューコンポーネント
 * PDFを表示するためのコンポーネントです
 */
export function PdfPreview({ pdfUrl, zoom, className = '' }: PdfPreviewProps) {
  if (!pdfUrl) {
    return (
      <div className={`h-full p-8 flex items-start justify-center ${className}`}>
        <div className="w-full max-w-[500px] min-h-[700px] bg-white border border-gray-200 rounded-sm p-12 flex flex-col items-center justify-center text-gray-500">
          <Icon icon="solar:document-text-linear" width={64} className="mb-4 opacity-50" />
          <p className="text-sm font-medium text-gray-600">PDFプレビュー</p>
          <p className="text-xs mt-2 text-gray-500">コンパイルボタンを押してPDFを生成してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex items-start justify-center p-8 ${className}`}>
      <div
        className="bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-200"
        style={{
          width: `${(210 * zoom) / 100}mm`, // A4幅（210mm）を基準にズーム
          minHeight: `${(297 * zoom) / 100}mm`, // A4高さ（297mm）を基準にズーム
        }}
      >
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full border-0"
          style={{
            height: `${(297 * zoom) / 100}mm`,
            minHeight: '500px',
          }}
          title="PDF Preview"
        />
      </div>
    </div>
  );
}
