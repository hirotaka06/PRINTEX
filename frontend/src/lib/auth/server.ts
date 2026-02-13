import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApiClient } from '@/lib/api/server';

type User = {
  id: number;
  username: string;
};

export async function requireAuth(): Promise<User> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid');

  if (!sessionId) {
    redirect('/login');
  }

  try {
    const api = await getApiClient();
    const { data: user, error } = await api.GET('/api/auth/user/');

    if (error || !user || !user.id || !user.username) {
      redirect('/login');
    }

    return {
      id: user.id,
      username: user.username,
    };
  } catch (error) {
    console.warn(error);
    redirect('/login');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid');

  if (!sessionId) {
    return null;
  }

  try {
    const api = await getApiClient();
    const { data: user, error } = await api.GET('/api/auth/user/');

    if (error || !user || !user.id || !user.username) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
    };
  } catch (error) {
    console.warn(error);
    return null;
  }
}
