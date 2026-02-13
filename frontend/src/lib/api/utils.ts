export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function normalizeBackendUrl(url: string | null | undefined): string | null {
  // URLが空の場合はnullを返す
  if (!url || url.trim() === '') {
    return null;
  }

  const trimmedUrl = url.trim();

  // ルートパス（/）のみの場合はnullを返す
  if (trimmedUrl === '/' || (trimmedUrl.endsWith('/') && trimmedUrl.split('/').filter(Boolean).length === 0)) {
    return null;
  }

  // ローカルホスト8000で始まるURLをAPI_BASE_URLに置き換え
  if (trimmedUrl.startsWith('http://localhost:8000') || trimmedUrl.startsWith('https://localhost:8000')) {
    return trimmedUrl.replace(/^https?:\/\/localhost:8000/, API_BASE_URL);
  }

  // 既にAPI_BASE_URLで始まっている場合はそのまま返す
  if (trimmedUrl.startsWith(API_BASE_URL)) {
    return trimmedUrl;
  }

  // 相対パスの場合はAPI_BASE_URLを先頭に追加
  if (trimmedUrl.startsWith('/')) {
    return `${API_BASE_URL}${trimmedUrl}`;
  }

  // その他の場合はそのまま返す
  return trimmedUrl;
}
