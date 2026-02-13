'use server';

import { apiGet, apiPost, apiPatch, apiDelete } from '@/shared/lib/api/client';
import type {
  TemplateListItem,
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from './types';
import { Result } from '@/shared/lib/result';

export async function getTemplates(): Promise<Result<TemplateListItem[]>> {
  return apiGet<TemplateListItem[]>('/api/template/');
}

export async function createTemplate(
  request: TemplateCreateRequest
): Promise<Result<TemplateListItem>> {
  return apiPost<TemplateListItem>('/api/template/', {
    body: request,
  });
}

export async function updateTemplate(
  templateId: string,
  request: TemplateUpdateRequest
): Promise<Result<TemplateListItem>> {
  return apiPatch<TemplateListItem>('/api/template/{id}/', {
    params: {
      path: {
        id: templateId,
      },
    },
    body: request,
  });
}

export async function deleteTemplate(
  templateId: string
): Promise<Result<void>> {
  return apiDelete<void>('/api/template/{id}/', {
    params: {
      path: {
        id: templateId,
      },
    },
  });
}

export async function setDefaultTemplate(
  templateId: string
): Promise<Result<void>> {
  return apiPost<void>('/api/template/{id}/set-default/', {
    params: {
      path: {
        id: templateId,
      },
    },
  });
}
