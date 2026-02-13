'use client';

import { useState, useRef, useEffect, Activity } from 'react';
import { ImageUploadArea } from './ImageUploadArea';
import { ResizerHandle } from './ResizerHandle';
import { LaTeXEditor } from './LaTeXEditor';
import { DocumentModeSwitcher, type DocumentMode } from './DocumentModeSwitcher';
import { useOcr } from '@/hooks/useOcr';
import { useLatexCompile } from '@/hooks/useLatexCompile';
import { useResizer } from '@/hooks/useResizer';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
import { normalizeBackendUrl } from '@/lib/api/utils';
import type { paths } from '@/generated/api';

type ProjectDetailResponse = NonNullable<
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json']
>;

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

% ここに本文を入力してください...

\\end{document}`;

interface EditorPanelProps {
  projectId: string;
  projectDetail?: ProjectDetailResponse | null;
  onCompile?: (pdfUrl: string) => void;
  onGenerateExplanation?: () => void;
  isGeneratingExplanation?: boolean;
  explanationError?: string | null;
  onExplanationErrorDismiss?: () => void;
  onModeChange?: (mode: DocumentMode) => void;
  initialMode?: DocumentMode;
}

export function EditorPanel({
  projectId,
  projectDetail,
  onCompile,
  onGenerateExplanation,
  isGeneratingExplanation = false,
  explanationError = null,
  onExplanationErrorDismiss,
  onModeChange,
  initialMode = 'problem',
}: EditorPanelProps) {
  const [documentMode, setDocumentMode] = useState<DocumentMode>(initialMode);
  const [latexValue, setLatexValue] = useState<string>(DEFAULT_LATEX);
  const [latexDocumentId, setLatexDocumentId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isOcrResultRef = useRef<boolean>(false);

  const defaultLatex = useTemplateLoader(projectDetail);
  const { topPaneHeight, startResizing } = useResizer(containerRef, 300);
  const { isProcessing: isOcrProcessing, error: ocrError, processOcr, clearError: clearOcrError } = useOcr(projectId);
  const { isCompiling, error: compileError, compile, clearError: clearCompileError } = useLatexCompile(projectId, documentMode);

  useEffect(() => {
    setLatexValue(DEFAULT_LATEX);
    setLatexDocumentId(null);
    setUploadedImageUrl(null);
    isOcrResultRef.current = false;
    clearOcrError();
    clearCompileError();
  }, [projectId, clearOcrError, clearCompileError]);

  useEffect(() => {
    if (!isGeneratingExplanation && projectDetail?.latest_explanation_document) {
      isOcrResultRef.current = false;
    }
  }, [isGeneratingExplanation, projectDetail]);

  useEffect(() => {
    if (isOcrResultRef.current) {
      return;
    }

    if (projectDetail) {
      if (documentMode === 'problem') {
        if (projectDetail.latest_latex_document) {
          setLatexValue(projectDetail.latest_latex_document.latex_code);
          setLatexDocumentId(projectDetail.latest_latex_document.id);
        } else {
          setLatexValue(defaultLatex);
          setLatexDocumentId(null);
        }
      } else {
        if (projectDetail.latest_explanation_document) {
          setLatexValue(projectDetail.latest_explanation_document.latex_code);
          setLatexDocumentId(projectDetail.latest_explanation_document.id);
        } else {
          setLatexValue(defaultLatex);
          setLatexDocumentId(null);
        }
      }

      if (projectDetail.image_url && !uploadedImageUrl?.startsWith('blob:')) {
        const normalizedImageUrl = normalizeBackendUrl(projectDetail.image_url);
        if (normalizedImageUrl) {
          setUploadedImageUrl(normalizedImageUrl);
        }
      } else if (!projectDetail.image_url && !uploadedImageUrl?.startsWith('blob:')) {
        setUploadedImageUrl(null);
      }
    } else {
      setLatexValue(defaultLatex);
      setLatexDocumentId(null);
      setUploadedImageUrl(null);
    }
  }, [projectDetail, documentMode, defaultLatex, uploadedImageUrl]);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const handleFileSelect = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);

    const result = await processOcr(file);

    if (result) {
      isOcrResultRef.current = true;
      setLatexValue(result.latexCode);
      setLatexDocumentId(result.latexDocumentId);

      if (result.pdfUrl && onCompile) {
        onCompile(result.pdfUrl);
      }
    } else {
      isOcrResultRef.current = false;
    }
  };

  const handleCompile = async () => {
    const result = await compile(latexValue, latexDocumentId);

    if (result) {
      if (result.latexDocumentId) {
        setLatexDocumentId(result.latexDocumentId);
      }

      if (result.pdfUrl && onCompile) {
        onCompile(result.pdfUrl);
      }
    }
  };

  const handleModeChange = (mode: DocumentMode) => {
    setDocumentMode(mode);
    clearCompileError();
    isOcrResultRef.current = false;
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  useEffect(() => {
    setDocumentMode(initialMode);
  }, [initialMode]);

  return (
    <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200 bg-white h-full relative z-0 rounded-l-2xl">
      <DocumentModeSwitcher
        currentMode={documentMode}
        onModeChange={handleModeChange}
      />

      <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden relative">
        <Activity mode={documentMode === 'problem' ? 'visible' : 'hidden'}>
          <ImageUploadArea
            height={topPaneHeight}
            onFileSelect={handleFileSelect}
            isProcessing={isOcrProcessing}
            error={ocrError}
            imageUrl={uploadedImageUrl}
          />
          <ResizerHandle onMouseDown={startResizing} />
        </Activity>
        <LaTeXEditor
          value={latexValue}
          onChange={setLatexValue}
          onCompile={handleCompile}
          onGenerateExplanation={documentMode === 'problem' ? onGenerateExplanation : undefined}
          isCompiling={isCompiling}
          error={compileError}
          onErrorDismiss={clearCompileError}
          isGeneratingExplanation={isGeneratingExplanation}
          explanationError={explanationError}
          onExplanationErrorDismiss={onExplanationErrorDismiss}
        />
      </div>
    </div>
  );
}
