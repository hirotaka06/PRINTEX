'use client';

import { useState, useEffect } from 'react';
import { MainHeader } from './MainHeader';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { FloatingHelpButton } from './FloatingHelpButton';
import { usePdfUrl } from '@/hooks/usePdfUrl';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import { generateExplanationAction } from '@/app/actions/explanation';
import type { paths } from '@/generated/api';
import type { DocumentMode } from './DocumentModeSwitcher';

type ProjectDetailResponse = NonNullable<
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json']
>;

interface EditorPageClientProps {
  projectId: string;
  initialProjectDetail: ProjectDetailResponse;
}

export function EditorPageClient({ projectId, initialProjectDetail }: EditorPageClientProps) {
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      <MainHeader projectName={projectDetail?.title || 'プロジェクト'} />
      <div className="flex-1 flex overflow-hidden">
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
      <FloatingHelpButton />
    </div>
  );
}
