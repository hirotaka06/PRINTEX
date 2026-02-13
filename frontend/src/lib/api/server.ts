import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api';
import { cookies } from 'next/headers';
import { API_BASE_URL } from './utils';

export async function getApiClient() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid');
  const csrfToken = cookieStore.get('csrftoken');

  const cookieParts: string[] = [];
  if (sessionId) {
    cookieParts.push(`sessionid=${sessionId.value}`);
  }
  if (csrfToken) {
    cookieParts.push(`csrftoken=${csrfToken.value}`);
  }
  const cookieHeader = cookieParts.join('; ');

  const client = createClient<paths>({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(csrfToken ? { 'X-CSRFToken': csrfToken.value } : {}),
    },
  });

  return client;
}

export async function getProjects() {
  const api = await getApiClient();
  const { data, error } = await api.GET('/api/project/');

  if (error) {
    throw await handleServerApiError(error);
  }

  return data;
}

export async function getProjectDetail(projectId: string) {
  const api = await getApiClient();
  const { data, error } = await api.GET('/api/project/{id}/', {
    params: {
      path: {
        id: projectId,
      },
    },
  });

  if (error) {
    throw await handleServerApiError(error);
  }

  return data;
}

export async function getTrashedProjects() {
  const api = await getApiClient();
  const { data, error } = await api.GET('/api/project/trash/');

  if (error) {
    throw await handleServerApiError(error);
  }

  return data;
}

export async function getTemplates() {
  const api = await getApiClient();
  const { data, error } = await api.GET('/api/template/');

  if (error) {
    throw await handleServerApiError(error);
  }

  return data;
}

export class ServerApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ServerApiError';
  }
}

export async function handleServerApiError(
  error: unknown
): Promise<ServerApiError> {
  if (error && typeof error === 'object') {
    if ('response' in error && error.response instanceof Response) {
      try {
        const errorData = await error.response.json();
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `API request failed with status ${error.response.status}`;
        return new ServerApiError(
          errorMessage,
          error.response.status,
          error.response
        );
      } catch {
        return new ServerApiError(
          `API request failed with status ${error.response.status}`,
          error.response.status,
          error.response
        );
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return new ServerApiError(error.message);
    }
  }

  if (error instanceof Error) {
    return new ServerApiError(error.message);
  }

  return new ServerApiError('Unknown error occurred');
}
