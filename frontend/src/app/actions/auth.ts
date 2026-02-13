'use server';

import { getApiClient, handleServerApiError } from '@/lib/api/server';
import type { paths } from '@/generated/api';

type LoginResponse =
  paths['/api/auth/login/']['post']['responses']['200']['content']['application/json'];
type LogoutResponse =
  paths['/api/auth/logout/']['post']['responses']['200']['content']['application/json'];
type UserResponse =
  paths['/api/auth/user/']['get']['responses']['200']['content']['application/json'];

/**
 * ログイン処理
 */
export async function loginAction(
  username: string,
  password: string
): Promise<LoginResponse> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.POST('/api/auth/login/', {
      body: {
        username,
        password,
      },
    });

    if (error) {
      const apiError = await handleServerApiError(error);
      throw apiError;
    }

    if (!data) {
      throw new Error('No data received from login API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw apiError;
  }
}

/**
 * ログアウト処理
 */
export async function logoutAction(): Promise<LogoutResponse | null> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.POST('/api/auth/logout/');

    if (error) {
      console.warn('Logout API error (ignored):', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.warn('Logout API error (ignored):', error);
    return null;
  }
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUserAction(): Promise<UserResponse> {
  const api = await getApiClient();
  try {
    const { data, error } = await api.GET('/api/auth/user/');

    if (error) {
      const apiError = await handleServerApiError(error);
      throw apiError;
    }

    if (!data) {
      throw new Error('No data received from user API');
    }

    return data;
  } catch (error) {
    const apiError = await handleServerApiError(error);
    throw apiError;
  }
}
