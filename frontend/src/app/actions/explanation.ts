'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type ExplanationRequest =
  paths['/api/explanation/generate/']['post']['requestBody']['content']['application/json'];
type ExplanationResponse =
  paths['/api/explanation/generate/']['post']['responses']['200']['content']['application/json'];

/**
 * 解説を生成する
 */
export async function generateExplanationAction(
  problemId: string
): Promise<ExplanationResponse> {
  const api = await getApiClient();
  try {
    const request: ExplanationRequest = { problem_id: problemId };
    const { data, error } = await api.POST('/api/explanation/generate/', {
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from explanation generate API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}
