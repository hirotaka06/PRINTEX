import { useState, useMemo } from 'react';
import { filterAndSortProjects } from '@/shared/lib/utils/filter';
import type { paths } from '@/generated/api';

type ProjectListResponse = NonNullable<
  paths['/api/project/']['get']['responses']['200']['content']['application/json']
>[number];

type SortBy = 'updatedAt' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function useProjectListFilter<T extends ProjectListResponse>(
  items: T[],
  initialSearchQuery: string = '',
  initialSortBy: SortBy = 'updatedAt',
  initialSortOrder: SortOrder = 'desc'
) {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  const filteredAndSortedProjects = useMemo<T[]>(() => {
    return filterAndSortProjects(items, searchQuery, sortBy, sortOrder);
  }, [items, searchQuery, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortOrder,
    handleSortChange,
    filteredAndSortedProjects,
  };
}
