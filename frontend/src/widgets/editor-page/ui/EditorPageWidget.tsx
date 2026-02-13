'use client';

import { useState, useEffect } from 'react';
import { MainHeader } from '@/components/features/editor/MainHeader';
import { EditorPanel } from '@/components/features/editor/EditorPanel';
import { PreviewPanel } from '@/components/features/editor/PreviewPanel';
import { FloatingHelpButton } from '@/components/features/editor/FloatingHelpButton';
import { usePdfUrl } from '@/hooks/usePdfUrl';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import { generateExplanationAction } from '@/app/actions/explanation';
import type { ProjectDetail } from '@/entities/project';
import type { DocumentMode } from '@/components/features/editor/DocumentModeSwitcher';

interface EditorPageWidgetProps {
  projectId: string;
  initialProjectDetail: ProjectDetail;
}

export function EditorPageWidget({ projectId, initialProjectDetail }: EditorPageWidgetProps) {
  const [documentMode, setDocumentMode] = useState<DocumentMode>('problem');
  const [zoom, setZoom] = useState<number>(100);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const { pdfUrl, updatePdfUrl } = usePdfUrl(
    initialProjectDetail.latest_latex_document?.pdf_url || null
  );

  const { projectDetail, refreshProjectDetail, updateSolutionNotes } = useProjectDetail(
    projectId,
    initialProjectDetail
  );

  // プロジェクト詳細が更新されたときにPDF URLを更新
  useEffect(() => {
    if (projectDetail) {
      const currentPdfUrl =
        documentMode === 'problem'
          ? projectDetail.latest_latex_document?.pdf_url
          : projectDetail.latest_explanation_document?.pdf_url;
      updatePdfUrl(currentPdfUrl || null);
    }
  }, [projectDetail, documentMode, updatePdfUrl]);

  const handleCompile = (newPdfUrl: string) => {
    updatePdfUrl(newPdfUrl);
    refreshProjectDetail();
  };

  const handleSolutionNotesUpdate = async (notes: string) => {
    await updateSolutionNotes(notes);
  };

  const handleModeChange = (mode: DocumentMode) => {
    setDocumentMode(mode);
    if (projectDetail) {
      const currentPdfUrl =
        mode === 'problem'
          ? projectDetail.latest_latex_document?.pdf_url
          : projectDetail.latest_explanation_document?.pdf_url;
      updatePdfUrl(currentPdfUrl || null);
    }
  };

  // 解説生成のハンドラー
  const handleGenerateExplanation = async () => {
    setIsGeneratingExplanation(true);
    setExplanationError(null);

    try {
      await generateExplanationAction(projectId);
      await refreshProjectDetail();
      setDocumentMode('explanation');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '解説の生成に失敗しました';
      setExplanationError(errorMessage);
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleExplanationErrorDismiss = () => {
    setExplanationError(null);
  };

  return (
    <>
      {/* ヘッダー（コンテナの外側） */}
      <MainHeader projectName={projectDetail?.title || 'プロジェクト'} />

      {/* メインコンテンツエリア（角丸コンテナ） */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-2xl shadow-sm">
        <div className="flex-1 flex overflow-hidden rounded-2xl">
          <EditorPanel
            projectId={projectId}
            projectDetail={projectDetail}
            onCompile={handleCompile}
            onGenerateExplanation={handleGenerateExplanation}
            isGeneratingExplanation={isGeneratingExplanation}
            explanationError={explanationError}
            onExplanationErrorDismiss={handleExplanationErrorDismiss}
            onModeChange={handleModeChange}
            initialMode={documentMode}
          />
          <PreviewPanel
            zoom={zoom}
            onZoomChange={setZoom}
            pdfUrl={pdfUrl}
            projectId={projectId}
            projectDetail={projectDetail}
            onSolutionNotesUpdate={handleSolutionNotesUpdate}
          />
        </div>
      </div>
      <FloatingHelpButton />
    </>
  );
}
