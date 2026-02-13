
'use server';

import { apiGet, apiPost } from '@/shared/lib/api/client';
import type { paths } from '@/generated/api';
import { Result } from '@/shared/lib/result';
import type { LoginResponse, UserResponse } from './types';

export async function login(
  username: string,
  password: string
): Promise<Result<LoginResponse>> {
  return apiPost<LoginResponse>('/api/auth/login/', {
    body: {
      username,
      password,
    },
  });
}

export async function logout(): Promise<Result<void>> {
  const result = await apiPost<paths['/api/auth/logout/']['post']['responses']['200']['content']['application/json']>(
    '/api/auth/logout/'
  );

  // ログアウトは成功したとみなす（エラーでも無視）
  if (!result.success) {
    return { success: true, data: undefined };
  }

  return { success: true, data: undefined };
}

export async function getCurrentUser(): Promise<Result<UserResponse>> {
  return apiGet<UserResponse>('/api/auth/user/');
}
