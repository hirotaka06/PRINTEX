'use client';

import { Icon } from '@iconify/react';

interface ProjectListHeaderProps {
  projectCount: number;
  title?: string;
}

export function ProjectListHeader({
  projectCount,
  title = 'プロジェクト',
}: ProjectListHeaderProps) {
  return (
    <header className="rounded-xl bg-linear-to-br from-sky-500 to-rose-400 flex items-center justify-between px-6 py-3 h-16 mb-4 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="md:hidden text-white">
          <Icon icon="solar:hamburger-menu-linear" width={24} />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
            {title}
            {projectCount > 0 && (
              <span className="text-xs font-medium text-green-600 bg-white px-2.5 py-1 rounded-full h-6">
                {projectCount}
              </span>
            )}
          </h1>
        </div>
      </div>
    </header>
  );
}
