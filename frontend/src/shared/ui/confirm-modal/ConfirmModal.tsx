'use client';

import { Modal } from '../modal';
import { Button } from '../button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isProcessing?: boolean;
}

/**
 * 確認モーダルコンポーネント
 * 削除や復元などの確認操作に使用します
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = 'キャンセル',
  variant = 'danger',
  isProcessing = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isProcessing}
            isLoading={isProcessing}
          >
            {confirmLabel || (variant === 'danger' ? '削除' : '確認')}
          </Button>
        </>
      }
    >
      <p className={`text-sm ${variant === 'danger' ? 'text-red-600' : 'text-gray-600'}`}>
        {message}
      </p>
    </Modal>
  );
}
