'use server';

import { apiGet, apiPost, apiPatch, apiDelete } from '@/shared/lib/api/client';
import type {
  ProjectDetail,
  ProjectListItem,
  TrashedProjectItem,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectCreateResponse,
} from './types';
import { Result } from '@/shared/lib/result';

export async function getProjects(): Promise<Result<ProjectListItem[]>> {
  return apiGet<ProjectListItem[]>('/api/project/');
}

export async function getProjectDetail(
  projectId: string
): Promise<Result<ProjectDetail>> {
  return apiGet<ProjectDetail>('/api/project/{id}/', {
    params: {
      path: {
        id: projectId,
      },
    },
  });
}

export async function createProject(
  title: string
): Promise<Result<ProjectCreateResponse>> {
  const request: ProjectCreateRequest = { title };
  return apiPost<ProjectCreateResponse>('/api/project/create/', {
    body: request,
  });
}

export async function updateProject(
  projectId: string,
  updates: ProjectUpdateRequest
): Promise<Result<ProjectDetail>> {
  return apiPatch<ProjectDetail>('/api/project/{id}/', {
    params: {
      path: {
        id: projectId,
      },
    },
    body: updates,
  });
}

export async function updateProjectSolutionNotes(
  projectId: string,
  solutionNotes: string
): Promise<Result<ProjectDetail>> {
  return updateProject(projectId, { solution_notes: solutionNotes });
}

export async function deleteProject(
  projectId: string
): Promise<Result<ProjectCreateResponse>> {
  return apiDelete<ProjectCreateResponse>('/api/project/{id}/', {
    params: {
      path: {
        id: projectId,
      },
    },
  });
}

export async function getTrashedProjects(): Promise<Result<TrashedProjectItem[]>> {
  return apiGet<TrashedProjectItem[]>('/api/project/trash/');
}

export async function restoreProject(
  projectId: string
): Promise<Result<ProjectCreateResponse>> {
  return apiPost<ProjectCreateResponse>('/api/project/{id}/restore/', {
    params: {
      path: {
        id: projectId,
      },
    },
  });
}

export async function permanentlyDeleteProject(
  projectId: string
): Promise<Result<void>> {
  return apiDelete<void>('/api/project/{id}/permanent/', {
    params: {
      path: {
        id: projectId,
      },
    },
  });
}
