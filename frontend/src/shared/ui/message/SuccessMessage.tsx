'use client';

import { Icon } from '@iconify/react';

interface SuccessMessageProps {
  message?: string;
  className?: string;
}

/**
 * 成功メッセージ表示コンポーネント
 * 成功情報をユーザーに表示します
 */
export function SuccessMessage({ message = '保存しました', className = '' }: SuccessMessageProps) {
  return (
    <div className={`p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 ${className}`}>
      <Icon icon="solar:check-circle-linear" width={20} className="text-green-500 shrink-0" />
      <p className="text-xs font-semibold text-green-700">{message}</p>
    </div>
  );
}
