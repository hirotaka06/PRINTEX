'use client';

import { Icon } from '@iconify/react';

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProjectSearch({ value, onChange, placeholder = '検索...' }: ProjectSearchProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <Icon
          icon="solar:magnifer-linear"
          width={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm text-gray-900 placeholder-gray-400 shadow-sm"
        />
      </div>
    </div>
  );
}
