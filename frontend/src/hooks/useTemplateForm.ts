import { useState, useCallback } from 'react';
import {
  getTemplateAction,
  createTemplateAction,
  updateTemplateAction,
} from '@/app/actions/template';
import type { paths } from '@/generated/api';

type LatexTemplate = paths['/api/template/{id}/']['get']['responses']['200']['content']['application/json'];

const DEFAULT_TEMPLATE_CONTENT = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

{children}

\\end{document}`;

interface TemplateFormData {
  name: string;
  content: string;
}

export function useTemplateForm() {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    content: DEFAULT_TEMPLATE_CONTENT,
  });
  const [editingTemplate, setEditingTemplate] = useState<LatexTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      content: DEFAULT_TEMPLATE_CONTENT,
    });
    setEditingTemplate(null);
    setError(null);
  }, []);

  const setEditingTemplateData = useCallback(async (templateId: string) => {
    try {
      const fullTemplate = await getTemplateAction(templateId);
      setFormData({
        name: fullTemplate.name,
        content: fullTemplate.content,
      });
      setEditingTemplate(fullTemplate);
      setError(null);
    } catch (err) {
      const errorMessage = 'テンプレートの取得に失敗しました';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateFormData = useCallback((updates: Partial<TemplateFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.name.trim()) {
      setError('テンプレート名を入力してください');
      return false;
    }

    if (!formData.content.includes('{children}')) {
      setError('テンプレートには{children}プレースホルダーが含まれている必要があります');
      return false;
    }

    return true;
  }, [formData]);

  const saveTemplate = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      setError(null);
      const isDefault = editingTemplate ? editingTemplate.is_default ?? false : false;

      if (editingTemplate) {
        await updateTemplateAction(
          editingTemplate.id,
          formData.name,
          formData.content,
          isDefault
        );
      } else {
        await createTemplateAction(formData.name, formData.content, isDefault);
      }
    } catch (err) {
      const errorMessage = '保存に失敗しました';
      setError(errorMessage);
      throw err;
    }
  }, [formData, editingTemplate, validateForm]);

  return {
    formData,
    editingTemplate,
    error,
    resetForm,
    setEditingTemplateData,
    updateFormData,
    validateForm,
    saveTemplate,
  };
}
