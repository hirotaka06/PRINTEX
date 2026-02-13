import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/api/utils';
import { Result, ok, err } from '../result';
import { ApiError, NetworkError, AppError } from '../errors';

type ApiClient = Awaited<ReturnType<typeof getApiClient>>;
type GetOptions = Parameters<ApiClient['GET']>[1];
type PostOptions = Parameters<ApiClient['POST']>[1];
type PatchOptions = Parameters<ApiClient['PATCH']>[1];
type DeleteOptions = Parameters<ApiClient['DELETE']>[1];

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

async function handleApiError(error: unknown): Promise<Result<never, AppError>> {
  if (error && typeof error === 'object') {
    if ('response' in error && error.response instanceof Response) {
      try {
        const errorData = await error.response.json();
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `API request failed with status ${error.response.status}`;
        return err(
          new ApiError(
            errorMessage,
            error.response.status,
            error.response,
            errorData
          )
        );
      } catch {
        return err(
          new ApiError(
            `API request failed with status ${error.response.status}`,
            error.response.status,
            error.response
          )
        );
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return err(new ApiError(error.message, 500));
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return err(new NetworkError(error.message, error));
    }
    return err(new ApiError(error.message, 500));
  }

  return err(new ApiError('Unknown error occurred', 500));
}

export async function apiGet<T>(
  path: string,
  options?: GetOptions
): Promise<Result<T, AppError>> {
  try {
    const api = await getApiClient();
    const { data, error } = await api.GET(path as Parameters<ApiClient['GET']>[0], options);

    if (error) {
      return await handleApiError(error);
    }

    if (!data) {
      return err(new ApiError('No data received from API', 500));
    }

    return ok(data as T);
  } catch (error) {
    return await handleApiError(error);
  }
}

export async function apiPost<T>(
  path: string,
  options?: PostOptions
): Promise<Result<T, AppError>> {
  try {
    const api = await getApiClient();
    const { data, error } = await api.POST(path as Parameters<ApiClient['POST']>[0], options);

    if (error) {
      return await handleApiError(error);
    }

    if (!data) {
      return err(new ApiError('No data received from API', 500));
    }

    return ok(data as T);
  } catch (error) {
    return await handleApiError(error);
  }
}

export async function apiPatch<T>(
  path: string,
  options?: PatchOptions
): Promise<Result<T, AppError>> {
  try {
    const api = await getApiClient();
    const { data, error } = await api.PATCH(
      path as Parameters<ApiClient['PATCH']>[0],
      options as PatchOptions
    );

    if (error) {
      return await handleApiError(error);
    }

    if (!data) {
      return err(new ApiError('No data received from API', 500));
    }

    return ok(data as T);
  } catch (error) {
    return await handleApiError(error);
  }
}

export async function apiDelete<T>(
  path: string,
  options?: DeleteOptions
): Promise<Result<T, AppError>> {
  try {
    const api = await getApiClient();
    const { data, error } = await api.DELETE(
      path as Parameters<ApiClient['DELETE']>[0],
      options as DeleteOptions
    );

    if (error) {
      return await handleApiError(error);
    }

    return ok((data ?? undefined) as T);
  } catch (error) {
    return await handleApiError(error);
  }
}
