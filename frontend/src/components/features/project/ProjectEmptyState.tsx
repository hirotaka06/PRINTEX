'use client';

import { Icon } from '@iconify/react';
import { Button } from '@/shared/ui/button';

interface ProjectEmptyStateProps {
  hasSearchQuery: boolean;
  onNewProjectClick?: () => void;
}

export function ProjectEmptyState({ hasSearchQuery, onNewProjectClick }: ProjectEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Icon icon="solar:document-add-linear" width={64} className="mb-4 text-gray-400 opacity-50" />
      <p className="text-sm text-gray-600 mb-2">
        {hasSearchQuery ? '検索結果が見つかりませんでした' : 'プロジェクトがありません'}
      </p>
      {!hasSearchQuery && (
        <>
          <p className="text-xs text-gray-500 mb-4">新規プロジェクトを作成して始めましょう</p>
          {onNewProjectClick && (
            <Button onClick={onNewProjectClick} leftIcon="solar:add-square-linear">
              新規プロジェクトを作成
            </Button>
          )}
        </>
      )}
    </div>
  );
}
