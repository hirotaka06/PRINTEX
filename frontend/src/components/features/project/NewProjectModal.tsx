'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { createProjectAction } from '@/app/actions/project';
import { useRouter } from 'next/navigation';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setIsAnimating(false);
      setTimeout(() => {
        setTitle('');
        setError(null);
        onClose();
      }, 200); // アニメーション時間に合わせる
    }
  }, [isLoading, onClose]);

  // モーダルが開いたときのアニメーション
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // 入力フィールドにフォーカス
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, handleClose]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('プロジェクトタイトルを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const project = await createProjectAction(title.trim());
      // プロジェクト作成後、エディタページに遷移
      router.push(`/project/${project.id}/editor`);
      // モーダルを閉じる
      handleClose();
      setTitle('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'プロジェクト作成中にエラーが発生しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-200 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        className={`relative bg-white w-full max-w-md mx-4 rounded-xl ring-1 ring-gray-900/5 transform transition-all duration-200 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-50 disabled:opacity-50"
        >
          <Icon icon="solar:close-circle-linear" width={20} />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 border border-gray-200">
              <Icon icon="solar:add-square-linear" width={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-none mb-1" id="modal-title">
                新規プロジェクト作成
              </h3>
              <p className="text-xs text-gray-500">新しいプロジェクトのタイトルを入力してください</p>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project-title" className="block text-xs font-semibold text-gray-700 mb-1.5">
                タイトル
              </label>
              <input
                ref={inputRef}
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                placeholder="例: 数学II 演習問題"
                disabled={isLoading}
                className="block w-full px-5 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
              />
              {error && (
                <p className="mt-2 text-xs text-red-600">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="px-4 py-2 text-white bg-gray-900 border border-transparent rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" width={20} />
                    作成中...
                  </>
                ) : (
                  '作成する'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
