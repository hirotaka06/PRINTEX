'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type OCRResponse =
  paths['/api/ocr/']['post']['responses']['201']['content']['application/json'];

export async function createOcrAction(
  formData: FormData
): Promise<OCRResponse> {
  const api = await getApiClient();
  try {
    const imageFile = formData.get('image') as File;
    const problemId = formData.get('problemId') as string;

    if (!imageFile || !problemId) {
      throw new Error('Image file and problem ID are required');
    }

    const requestBody = {
      image: imageFile,
      problem_id: problemId,
    };

    const { data, error } = await api.POST('/api/ocr/', {
      body: requestBody as { image: Blob; problem_id: string },
      bodySerializer(body) {
        if (!body) {
          throw new Error('Request body is required');
        }
        const formData = new FormData();
        formData.append('image', body.image);
        formData.append('problem_id', body.problem_id);
        return formData;
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from OCR API');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}
