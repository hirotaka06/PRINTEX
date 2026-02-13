import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api';
import { API_BASE_URL } from './utils';

export function getClientApiClient() {
  const client = createClient<paths>({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  });

  return client;
}
