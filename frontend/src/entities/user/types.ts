import type { User } from '@/shared/types';
import type { paths } from '@/generated/api';

export type { User };

export type AuthUser = User & {
  email?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse =
  paths['/api/auth/login/']['post']['responses']['200']['content']['application/json'];

export type UserResponse =
  paths['/api/auth/user/']['get']['responses']['200']['content']['application/json'];
