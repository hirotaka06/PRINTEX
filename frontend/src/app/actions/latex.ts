'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type LatexRenderRequest =
  paths['/api/latex/render/']['post']['requestBody']['content']['application/json'];
type LatexRenderResponse =
  paths['/api/latex/render/']['post']['responses']['200']['content']['application/json'];

/**
 * LaTeXコードをPDFに変換する
 */
export async function renderLatexAction(
  latexCode: string,
  problemId: string,
  documentType: 'problem' | 'explanation',
  latexDocumentId?: string | null
): Promise<LatexRenderResponse> {
  const api = await getApiClient();
  try {
    const request: LatexRenderRequest = {
      latex_code: latexCode,
      problem_id: problemId,
      document_type: documentType as 'problem' | 'explanation',
      latex_document_id: latexDocumentId || undefined,
    };
    const { data, error } = await api.POST('/api/latex/render/', {
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from latex render API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}
