'use client';

import { useState } from 'react';
import { Tabs, type TabItem } from '@/shared/ui/tabs';
import { ZoomControls } from '@/shared/ui/zoom-controls';
import { PdfPreview } from '@/shared/ui/pdf-preview';
import { ErrorMessage, SuccessMessage } from '@/shared/ui/message';
import { updateProjectSolutionNotesAction } from '@/app/actions/project';
import type { paths } from '@/generated/api';

type ProjectDetailResponse = NonNullable<
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json']
>;

interface PreviewPanelProps {
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  pdfUrl?: string | null;
  projectId: string;
  projectDetail?: ProjectDetailResponse | null;
  onSolutionNotesUpdate?: (notes: string) => void;
}

export function PreviewPanel({
  zoom: externalZoom = 100,
  onZoomChange,
  pdfUrl = null,
  projectId,
  projectDetail,
  onSolutionNotesUpdate,
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'chat'>('preview');
  const [localZoom, setLocalZoom] = useState<number>(externalZoom);
  const [solutionNotes, setSolutionNotes] = useState<string>(
    projectDetail?.solution_notes || ''
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // ズームの管理（外部から制御される場合はそれを使用、そうでなければローカル状態を使用）
  const zoom = onZoomChange ? externalZoom : localZoom;
  const handleZoomChange = onZoomChange || setLocalZoom;

  const handleZoomIn = () => {
    if (zoom < 200) {
      handleZoomChange(Math.min(zoom + 10, 200));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      handleZoomChange(Math.max(zoom - 10, 50));
    }
  };

  const handleSolutionNotesChange = (value: string) => {
    setSolutionNotes(value);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSolutionNotesSave = async () => {
    try {
      setSaveError(null);
      setSaveSuccess(false);
      await updateProjectSolutionNotesAction(projectId, solutionNotes);
      setSaveSuccess(true);
      if (onSolutionNotesUpdate) {
        onSolutionNotesUpdate(solutionNotes);
      }
      // 3秒後に成功メッセージを非表示
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : '保存に失敗しました'
      );
    }
  };

  const tabItems: TabItem[] = [
    { id: 'preview', label: 'プレビュー', icon: 'solar:eye-linear' },
    { id: 'chat', label: 'チャット補足', icon: 'solar:chat-line-linear' },
  ];

  return (
    <div className="w-full lg:w-1/2 flex flex-col bg-white h-full rounded-r-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 border-b border-gray-200 bg-white h-14 shrink-0 rounded-tr-2xl">
        <Tabs
          items={tabItems}
          activeTabId={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'preview' | 'chat')}
        />
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'preview' ? (
          <PdfPreview pdfUrl={pdfUrl} zoom={zoom} />
        ) : (
          <div className="h-full p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解答ノート
                </label>
                <textarea
                  value={solutionNotes}
                  onChange={(e) => handleSolutionNotesChange(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm text-gray-900 placeholder-gray-400 resize-none custom-scrollbar shadow-sm"
                  placeholder="解答の補足やメモを入力してください..."
                />
                <div className="mt-2 flex items-center justify-end">
                  <button
                    onClick={handleSolutionNotesSave}
                    className="px-5 py-3 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 shadow-sm"
                  >
                    保存
                  </button>
                </div>
              </div>

              {/* エラーメッセージ */}
              {saveError && (
                <ErrorMessage
                  message={saveError}
                  onDismiss={() => setSaveError(null)}
                />
              )}

              {/* 成功メッセージ */}
              {saveSuccess && <SuccessMessage />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
