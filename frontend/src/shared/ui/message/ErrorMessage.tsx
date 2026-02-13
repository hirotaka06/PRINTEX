'use client';

import { Icon } from '@iconify/react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * エラーメッセージ表示コンポーネント
 * エラー情報をユーザーに表示します
 */
export function ErrorMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 ${className}`}>
      <Icon icon="solar:danger-triangle-linear" width={20} className="text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-red-700 mb-1">保存エラー</p>
        <p className="text-xs text-red-600">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors shrink-0"
          aria-label="エラーを閉じる"
        >
          <Icon icon="solar:close-circle-linear" width={16} />
        </button>
      )}
    </div>
  );
}
