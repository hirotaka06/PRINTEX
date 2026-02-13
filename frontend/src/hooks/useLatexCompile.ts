import { useState, useCallback } from 'react';
import { renderLatexAction } from '@/app/actions/latex';
import { normalizeBackendUrl } from '@/lib/api/utils';

export type DocumentMode = 'problem' | 'explanation';

export interface LatexCompileResult {
  latexDocumentId: string | null;
  pdfUrl: string | null;
}

export function useLatexCompile(projectId: string, documentMode: DocumentMode) {
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compile = useCallback(async (
    latexCode: string,
    latexDocumentId?: string | null
  ): Promise<LatexCompileResult | null> => {
    setIsCompiling(true);
    setError(null);

    try {
      const result = await renderLatexAction(
        latexCode,
        projectId,
        documentMode,
        latexDocumentId || undefined
      );

      return {
        latexDocumentId: result.latex_document_id || null,
        pdfUrl: result.pdf_url ? normalizeBackendUrl(result.pdf_url) : null,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'PDF生成中にエラーが発生しました';
      setError(errorMessage);
      return null;
    } finally {
      setIsCompiling(false);
    }
  }, [projectId, documentMode]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isCompiling,
    error,
    compile,
    clearError,
  };
}
