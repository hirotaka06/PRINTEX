import { Result, err, ok } from './result';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public statusCode: number,
    public response?: Response,
    public responseData?: unknown
  ) {
    super(message, 'API_ERROR', statusCode);
    this.name = 'ApiError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, cause);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '認証に失敗しました') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'アクセス権限がありません') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'リソースが見つかりません') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', undefined, error);
  }

  return new AppError(
    typeof error === 'string' ? error : '予期しないエラーが発生しました',
    'UNKNOWN_ERROR'
  );
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const appError = toAppError(error);
  switch (appError.code) {
    case 'API_ERROR':
      if (appError instanceof ApiError) {
        switch (appError.statusCode) {
          case 400:
            return 'リクエストが不正です。入力内容を確認してください。';
          case 401:
            return '認証に失敗しました。再度ログインしてください。';
          case 403:
            return 'アクセス権限がありません。';
          case 404:
            return 'リソースが見つかりません。';
          case 500:
            return 'サーバーエラーが発生しました。しばらくしてから再度お試しください。';
          default:
            return appError.message || 'エラーが発生しました。';
        }
      }
      return appError.message || 'エラーが発生しました。';

    case 'NETWORK_ERROR':
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';

    case 'VALIDATION_ERROR':
      return appError.message || '入力内容に誤りがあります。';

    case 'AUTHENTICATION_ERROR':
      return '認証に失敗しました。再度ログインしてください。';

    case 'AUTHORIZATION_ERROR':
      return 'アクセス権限がありません。';

    case 'NOT_FOUND_ERROR':
      return 'リソースが見つかりません。';

    default:
      return appError.message || '予期しないエラーが発生しました。';
  }
}

export function errorToResult<T, E extends AppError = AppError>(
  error: unknown
): Result<T, E> {
  const appError = toAppError(error) as E;
  return err(appError);
}

export async function toResult<T>(
  promise: Promise<T>
): Promise<Result<T, AppError>> {
  try {
    const data = await promise;
    return ok(data);
  } catch (error) {
    return errorToResult<T>(error);
  }
}
