'use client';

import { useEffect } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { useTemplateForm } from '@/hooks/useTemplateForm';
import { ErrorMessage } from '@/shared/ui/message';

interface TemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editingTemplateId?: string | null;
}

/**
 * テンプレートフォームコンポーネント
 * テンプレートの作成・編集フォームを提供します
 */
export function TemplateForm({
  isOpen,
  onClose,
  onSave,
  editingTemplateId,
}: TemplateFormProps) {
  const {
    formData,
    editingTemplate,
    error,
    resetForm,
    setEditingTemplateData,
    updateFormData,
    saveTemplate,
  } = useTemplateForm();

  // モーダルが開かれたときにデータを読み込む
  useEffect(() => {
    if (isOpen) {
      if (editingTemplateId) {
        setEditingTemplateData(editingTemplateId).catch(() => {
          // エラーはuseTemplateFormで管理されているため、ここでは何もしない
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingTemplateId, setEditingTemplateData, resetForm]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    try {
      await saveTemplate();
      await onSave();
      handleClose();
    } catch {
      // エラーはuseTemplateFormで管理されているため、ここでは何もしない
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingTemplate ? 'テンプレート編集' : 'テンプレート作成'}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            テンプレート名
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm text-gray-900 placeholder-gray-400 shadow-sm"
            placeholder="例: 標準テンプレート"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            テンプレート内容
            <span className="text-xs text-gray-500 ml-2">
              ({'{children}'}プレースホルダーを含めてください)
            </span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateFormData({ content: e.target.value })}
            className="w-full h-64 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm custom-scrollbar"
            placeholder="\\documentclass{article}&#10;\\usepackage{amsmath}&#10;&#10;\\begin{document}&#10;&#10;{children}&#10;&#10;\\end{document}"
          />
        </div>
      </div>
    </Modal>
  );
}
