'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/shared/ui/button';
import { Loading } from '@/shared/ui/loading';
import { TemplateForm } from '@/components/features/template/TemplateForm';
import { TemplateCard } from '@/components/features/template/TemplateCard';
import {
  getTemplatesAction,
  deleteTemplateAction,
  setDefaultTemplateAction,
} from '@/app/actions/template';
import type { TemplateListItem } from '@/entities/template';

interface TemplateListWidgetProps {
  initialTemplates: TemplateListItem[];
}

export function TemplateListWidget({ initialTemplates }: TemplateListWidgetProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>(initialTemplates);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getTemplatesAction();
      setTemplates(data);
      setError(null);
    } catch (err) {
      console.error('テンプレートの取得に失敗しました:', err);
      setError('テンプレートの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingTemplateId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (template: TemplateListItem) => {
    setEditingTemplateId(template.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplateId(null);
  };

  const handleSave = async () => {
    await fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このテンプレートを削除しますか？')) {
      return;
    }

    try {
      await deleteTemplateAction(id);
      await fetchTemplates();
    } catch (err) {
      console.error('テンプレートの削除に失敗しました:', err);
      setError('削除に失敗しました');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultTemplateAction(id);
      await fetchTemplates();
    } catch (err) {
      console.error('テンプレートのデフォルト設定に失敗しました:', err);
      setError('デフォルト設定に失敗しました');
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* ヘッダー（コンテナの外側） */}
      <header className="rounded-xl bg-linear-to-br from-sky-500 to-rose-400 flex items-center justify-between px-6 py-3 h-16 mb-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="md:hidden text-white">
            <Icon icon="solar:hamburger-menu-linear" width={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">テンプレート</h1>
        </div>
      </header>

      {/* メインコンテンツエリア（角丸コンテナ） */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-2xl shadow-sm">
        <div className="flex-1 overflow-auto px-6 pt-6 pb-6 custom-scrollbar bg-white rounded-2xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Icon icon="solar:document-text-linear" width={64} className="mb-4 opacity-50" />
              <p className="text-sm font-medium text-gray-600 mb-2">テンプレートがありません</p>
              <p className="text-xs text-gray-500 mb-4">新しいテンプレートを作成してください</p>
              <Button variant="secondary" onClick={handleCreateClick}>
                テンプレートを作成
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TemplateForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingTemplateId={editingTemplateId}
      />
    </>
  );
}
