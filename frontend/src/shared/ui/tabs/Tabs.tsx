'use client';

import { Icon } from '@iconify/react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  items: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * タブコンポーネント
 * 複数のタブから選択できるUIを提供します
 */
export function Tabs({ items, activeTabId, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={`flex h-full ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`h-full px-2 mr-6 text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeTabId === item.id
              ? 'text-gray-900 border-b-2 border-gray-900 font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-200'
          }`}
          onClick={() => onTabChange(item.id)}
        >
          {item.icon && <Icon icon={item.icon} width={16} />}
          {item.label}
        </button>
      ))}
    </div>
  );
}
