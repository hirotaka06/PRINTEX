export type Ok<T> = {
  success: true;
  data: T;
};

export type Err<E = Error> = {
  success: false;
  error: E;
};

export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
  return {
    success: true,
    data,
  };
}

export function err<E = Error>(error: E): Err<E> {
  return {
    success: false,
    error,
  };
}

export function match<T, E, R>(
  result: Result<T, E>,
  onSuccess: (data: T) => R,
  onError: (error: E) => R
): R {
  if (result.success) {
    return onSuccess(result.data);
  } else {
    return onError(result.error);
  }
}

export function unwrap<T, E>(result: Result<T, E>): T | undefined {
  return result.success ? result.data : undefined;
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.success ? result.data : defaultValue;
}

export function unwrapOrThrow<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}

export function unwrapOrThrowWith<T, E>(
  result: Result<T, E>,
  createError: (error: E) => Error
): T {
  if (result.success) {
    return result.data;
  }
  throw createError(result.error);
}
