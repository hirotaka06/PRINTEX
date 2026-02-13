'use client';

import { Icon } from '@iconify/react';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';

type SortBy = 'updatedAt' | 'createdAt';
type SortOrder = 'desc' | 'asc';

interface ProjectSortProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

export function ProjectSort({ sortBy, sortOrder, onSortChange }: ProjectSortProps) {
  const getSortLabel = () => {
    if (sortBy === 'updatedAt') {
      return sortOrder === 'desc' ? '最終更新順（新しい順）' : '最終更新順（古い順）';
    } else {
      return sortOrder === 'desc' ? '作成日順（新しい順）' : '作成日順（古い順）';
    }
  };

  const dropdownItems: DropdownItem[] = [
    {
      label: '最終更新順（新しい順）',
      onClick: () => onSortChange('updatedAt', 'desc'),
    },
    {
      label: '最終更新順（古い順）',
      onClick: () => onSortChange('updatedAt', 'asc'),
    },
    {
      label: '作成日順（新しい順）',
      onClick: () => onSortChange('createdAt', 'desc'),
    },
    {
      label: '作成日順（古い順）',
      onClick: () => onSortChange('createdAt', 'asc'),
    },
  ];

  return (
    <div className="relative">
      <Dropdown
        trigger={
          <button className="flex items-center gap-2 px-5 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 shadow-sm">
            <Icon icon="solar:sort-by-alphabet-linear" width={18} />
            <span>{getSortLabel()}</span>
            <Icon icon="solar:alt-arrow-down-linear" width={16} className="text-gray-400" />
          </button>
        }
        items={dropdownItems}
        align="right"
      />
    </div>
  );
}
