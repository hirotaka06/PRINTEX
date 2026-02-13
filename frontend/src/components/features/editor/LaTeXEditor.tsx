'use client';

import { Icon } from '@iconify/react';
import { useRef, useEffect, useMemo } from 'react';

interface LaTeXEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onCompile?: () => void;
  onGenerateExplanation?: () => void;
  isCompiling?: boolean;
  error?: string | null;
  onErrorDismiss?: () => void;
  isGeneratingExplanation?: boolean;
  explanationError?: string | null;
  onExplanationErrorDismiss?: () => void;
}

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

% ここに本文を入力してください...

\\end{document}`;

export function LaTeXEditor({
  value,
  onChange,
  onCompile,
  onGenerateExplanation,
  isCompiling = false,
  error = null,
  onErrorDismiss,
  isGeneratingExplanation = false,
  explanationError = null,
  onExplanationErrorDismiss,
}: LaTeXEditorProps) {
  const displayValue = value !== undefined ? value : DEFAULT_LATEX;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => {
    return displayValue.split('\n').length;
  }, [displayValue]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !lineNumbers) return;

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => {
      textarea.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white group relative">
      <div className="px-6 py-2 flex items-center gap-1 border-b border-dashed border-gray-100 shrink-0">
        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="太字">
          <Icon icon="solar:text-bold-linear" width={16} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="斜体">
          <Icon icon="solar:text-italic-linear" width={16} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="下線">
          <Icon icon="solar:text-underline-linear" width={16} />
        </button>
        <div className="w-px h-3.5 bg-gray-200 mx-2"></div>
        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="関数">
          <Icon icon="solar:calculator-linear" width={16} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="コードブロック">
          <Icon icon="solar:code-linear" width={16} />
        </button>
        <div className="flex-1"></div>
        <span className="text-[10px] text-gray-300 font-mono">LaTeX Mode</span>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        <div
          ref={lineNumbersRef}
          className="shrink-0 w-12 py-6 pt-4 text-right text-[10px] text-gray-400 font-mono select-none overflow-hidden bg-gray-50/50 border-r border-gray-100 flex flex-col items-center"
          style={{ lineHeight: '1.5rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="flex-1 p-6 pt-4 pl-2 leading-relaxed focus:ring-0 resize-none custom-scrollbar outline-none text-sm text-gray-700 font-mono bg-transparent w-full border-0 placeholder-gray-300"
          spellCheck={false}
          placeholder="% LaTeXコードを入力してください..."
          value={displayValue}
          onChange={handleChange}
          style={{ lineHeight: '1.5rem' }}
        ></textarea>
      </div>

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 z-30 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <Icon icon="solar:danger-triangle-linear" width={20} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-red-700">LaTeXコンパイルエラー</h4>
                {onErrorDismiss && (
                  <button
                    onClick={onErrorDismiss}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="エラーを閉じる"
                  >
                    <Icon icon="solar:close-circle-linear" width={16} />
                  </button>
                )}
              </div>
              <pre className="text-[10px] text-red-600 font-mono whitespace-pre-wrap overflow-x-auto">
                {error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {explanationError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 z-30 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <Icon icon="solar:danger-triangle-linear" width={20} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-red-700">解説生成エラー</h4>
                {onExplanationErrorDismiss && (
                  <button
                    onClick={onExplanationErrorDismiss}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="エラーを閉じる"
                  >
                    <Icon icon="solar:close-circle-linear" width={16} />
                  </button>
                )}
              </div>
              <pre className="text-[10px] text-red-600 font-mono whitespace-pre-wrap overflow-x-auto">
                {explanationError}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-clip-text bg-linear-to-br from-sky-500 to-rose-400 bg-white border border-gradient-to-br border-sky-500 hover:text-gray-900 hover:underline rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCompile}
          disabled={isCompiling}
        >
          {isCompiling ? (
            <>
              <div className="animate-spin">
                <Icon icon="solar:refresh-linear" width={16} />
              </div>
              コンパイル中...
            </>
          ) : (
            <>
              <Icon icon="solar:play-linear" width={16} />
              コンパイル
            </>
          )}
        </button>

        {onGenerateExplanation && (
          <button
            className="flex items-center gap-2 px-6 py-3 text-normal text-white bg-linear-to-br hover:underline from-sky-500 to-rose-400 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={onGenerateExplanation}
            disabled={isGeneratingExplanation}
          >
            {isGeneratingExplanation ? (
              <>
                <div className="animate-spin">
                  <Icon icon="solar:refresh-linear" width={20} />
                </div>
                解説生成中...
              </>
            ) : (
              <>
                <Icon icon="solar:magic-stick-3-linear" width={20} />
                <span className='tracking-wider -mr-2'>AI</span>解説を生成
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
