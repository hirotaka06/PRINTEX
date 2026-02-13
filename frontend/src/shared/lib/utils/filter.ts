export function filterAndSortProjects<
  T extends { title: string; updated_at: string; created_at: string },
>(
  items: T[],
  searchQuery: string,
  sortBy: 'updatedAt' | 'createdAt',
  sortOrder: 'asc' | 'desc'
): T[] {
  let result = [...items];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(item =>
      (item.title || '').toLowerCase().includes(query)
    );
  }

  result.sort((a, b) => {
    const aValue = sortBy === 'updatedAt' ? a.updated_at : a.created_at;
    const bValue = sortBy === 'updatedAt' ? b.updated_at : b.created_at;
    const comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
}
