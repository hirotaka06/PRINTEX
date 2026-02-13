'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type LatexTemplateList =
  paths['/api/template/']['get']['responses']['200']['content']['application/json'];
type LatexTemplate =
  paths['/api/template/{id}/']['get']['responses']['200']['content']['application/json'];
type LatexTemplateRequest =
  paths['/api/template/']['post']['requestBody'] extends {
    content: { 'application/json': infer T };
  }
    ? T
    : never;

export async function getTemplatesAction(): Promise<LatexTemplateList> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.GET('/api/template/');

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from template list API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getTemplateAction(
  templateId: string
): Promise<LatexTemplate> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.GET('/api/template/{id}/', {
      params: {
        path: {
          id: templateId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from template detail API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function createTemplateAction(
  name: string,
  content: string,
  isDefault: boolean = false
): Promise<LatexTemplate> {
  const api = await getApiClient();
  try {
    const request: LatexTemplateRequest = {
      name,
      content,
      is_default: isDefault,
    };
    const { data, error } = await api.POST('/api/template/', {
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from create template API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function updateTemplateAction(
  templateId: string,
  name: string,
  content: string,
  isDefault: boolean
): Promise<LatexTemplate> {
  const api = await getApiClient();
  try {
    const request: LatexTemplateRequest = {
      name,
      content,
      is_default: isDefault,
    };
    const { data, error } = await api.PATCH('/api/template/{id}/', {
      params: {
        path: {
          id: templateId,
        },
      },
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from update template API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function deleteTemplateAction(templateId: string): Promise<void> {
  const api = await getApiClient();
  try {
    const { error } = await api.DELETE('/api/template/{id}/', {
      params: {
        path: {
          id: templateId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function setDefaultTemplateAction(
  templateId: string
): Promise<void> {
  const api = await getApiClient();
  try {
    const { error } = await api.POST('/api/template/{id}/set-default/', {
      params: {
        path: {
          id: templateId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}
