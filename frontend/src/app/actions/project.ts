'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type ProjectDetailResponse =
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json'];
type ProjectResponse =
  paths['/api/project/create/']['post']['responses']['201']['content']['application/json'];
type ProjectCreateRequest = NonNullable<
  paths['/api/project/create/']['post']['requestBody']
>['content']['application/json'];
type ProjectUpdateRequest = NonNullable<
  paths['/api/project/{id}/']['patch']['requestBody']
>['content']['application/json'];

export async function createProjectAction(
  title: string
): Promise<ProjectResponse> {
  const api = await getApiClient();
  try {
    const request: ProjectCreateRequest = { title };
    const { data, error } = await api.POST('/api/project/create/', {
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from create project API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getProjectDetailAction(
  projectId: string
): Promise<ProjectDetailResponse> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.GET('/api/project/{id}/', {
      params: {
        path: {
          id: projectId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from project detail API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function updateProjectSolutionNotesAction(
  projectId: string,
  solutionNotes: string
): Promise<ProjectDetailResponse> {
  const api = await getApiClient();
  try {
    const request: ProjectUpdateRequest = { solution_notes: solutionNotes };
    const { data, error } = await api.PATCH('/api/project/{id}/', {
      params: {
        path: {
          id: projectId,
        },
      },
      body: request,
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from update project API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function deleteProjectAction(
  projectId: string
): Promise<ProjectResponse> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.DELETE('/api/project/{id}/', {
      params: {
        path: {
          id: projectId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from delete project API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function restoreProjectAction(
  projectId: string
): Promise<ProjectResponse> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.POST('/api/project/{id}/restore/', {
      params: {
        path: {
          id: projectId,
        },
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw new Error(apiError.message);
    }

    if (!data) {
      throw new Error('No data received from restore project API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw new Error(apiError.message);
  }
}

export async function permanentlyDeleteProjectAction(
  projectId: string
): Promise<void> {
  const api = await getApiClient();
  try {
    const { error } = await api.DELETE('/api/project/{id}/permanent/', {
      params: {
        path: {
          id: projectId,
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
