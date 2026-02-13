'use client';

import { Icon } from '@iconify/react';
import { Card } from '@/shared/ui/card';
import type { paths } from '@/generated/api';

type LatexTemplateList = NonNullable<
  paths['/api/template/']['get']['responses']['200']['content']['application/json']
>[number];

interface TemplateCardProps {
  template: LatexTemplateList;
  onEdit: (template: LatexTemplateList) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onSetDefault,
}: TemplateCardProps) {
  return (
    <Card key={template.id} hover className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
          {template.is_default && (
            <span className="px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full h-5">
              デフォルト
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(template)}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
            title="編集"
          >
            <Icon icon="solar:pen-linear" width={16} />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            title="削除"
          >
            <Icon icon="solar:trash-bin-trash-linear" width={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
        <span>
          {template.updated_at
            ? new Date(template.updated_at).toLocaleDateString('ja-JP')
            : template.created_at
            ? new Date(template.created_at).toLocaleDateString('ja-JP')
            : '日付不明'}
        </span>
        {!template.is_default && (
          <button
            onClick={() => onSetDefault(template.id)}
            className="text-xs text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            デフォルトに設定
          </button>
        )}
      </div>
    </Card>
  );
}
