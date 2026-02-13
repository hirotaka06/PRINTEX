import { useState, useCallback } from 'react';

export function useConfirmModal() {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const openConfirm = useCallback((id: string) => {
    setConfirmId(id);
  }, []);

  const closeConfirm = useCallback(() => {
    if (!isProcessing) {
      setConfirmId(null);
    }
  }, [isProcessing]);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  const reset = useCallback(() => {
    setConfirmId(null);
    setIsProcessing(false);
  }, []);

  return {
    confirmId,
    isProcessing,
    openConfirm,
    closeConfirm,
    startProcessing,
    stopProcessing,
    reset,
  };
}
