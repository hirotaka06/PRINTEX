import { useState, useCallback } from 'react';
import { normalizeBackendUrl } from '@/lib/api/utils';

export function usePdfUrl(initialUrl?: string | null) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(() => {
    if (initialUrl) {
      return normalizeBackendUrl(initialUrl);
    }
    return null;
  });

  const updatePdfUrl = useCallback((url: string | null) => {
    if (url) {
      const normalizedUrl = normalizeBackendUrl(url);
      setPdfUrl(normalizedUrl);
    } else {
      setPdfUrl(null);
    }
  }, []);

  return {
    pdfUrl,
    updatePdfUrl,
  };
}
