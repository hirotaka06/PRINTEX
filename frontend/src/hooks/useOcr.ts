import { useState, useCallback } from 'react';
import { createOcrAction } from '@/app/actions/ocr';
import { normalizeBackendUrl } from '@/lib/api/utils';

export interface OcrResult {
  latexCode: string;
  latexDocumentId: string | null;
  pdfUrl: string | null;
}

/**
 * OCR処理の状態管理と実行を行うカスタムフック
 * @param projectId プロジェクトID
 * @returns OCR処理の状態と実行関数
 */
export function useOcr(projectId: string) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processOcr = useCallback(async (file: File): Promise<OcrResult | null> => {
    // ファイルタイプの検証
    if (!file.type.startsWith('image/')) {
      const errorMessage = '画像ファイルを選択してください';
      setError(errorMessage);
      return null;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMessage = 'ファイルサイズが大きすぎます（最大10MB）';
      setError(errorMessage);
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('problemId', projectId);

      const result = await createOcrAction(formData);

      if (result.latex_code) {
        return {
          latexCode: result.latex_code,
          latexDocumentId: result.latex_document_id || null,
          pdfUrl: result.pdf_url ? normalizeBackendUrl(result.pdf_url) : null,
        };
      } else {
        const errorMessage = 'LaTeXコードの生成に失敗しました';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'OCR処理中にエラーが発生しました';
      setError(errorMessage);
      console.error('OCR processing error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [projectId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    processOcr,
    clearError,
  };
}
