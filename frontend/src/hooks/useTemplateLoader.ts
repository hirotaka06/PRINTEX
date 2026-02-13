import { useState, useEffect } from 'react';
import { getTemplatesAction, getTemplateAction } from '@/app/actions/template';

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

% ここに本文を入力してください...

\\end{document}`;

export function useTemplateLoader(projectDetail?: { latest_latex_document?: unknown } | null) {
  const [defaultLatex, setDefaultLatex] = useState<string>(DEFAULT_LATEX);

  useEffect(() => {
    if (projectDetail?.latest_latex_document) {
      return;
    }

    const loadDefaultTemplate = async () => {
      try {
        // テンプレート一覧を取得
        const templates = await getTemplatesAction();
        const defaultTemplate = templates.find(t => t.is_default === true);

        if (defaultTemplate) {
          // デフォルトテンプレートの詳細を取得
          const fullTemplate = await getTemplateAction(defaultTemplate.id);

          // {children}を空文字列に置き換えて初期値として設定
          const initialLatex = fullTemplate.content.replace('{children}', '% ここに本文を入力してください...');
          setDefaultLatex(initialLatex);
        }
      } catch (error) {
        console.warn('Failed to load default template:', error);
      }
    };

    loadDefaultTemplate();
  }, [projectDetail]);

  return defaultLatex;
}
