export type User = {
  id: number;
  username: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type SortOrder = 'asc' | 'desc';

export type ViewMode = 'grid' | 'list';

export type DocumentMode = 'problem' | 'explanation';

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
};
