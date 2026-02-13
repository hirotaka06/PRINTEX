'use client';

import { Icon } from '@iconify/react';
import { Card } from '@/shared/ui/card';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';
import type { paths } from '@/generated/api';
import Image from 'next/image';

type ProjectListResponse = NonNullable<
  paths['/api/project/']['get']['responses']['200']['content']['application/json']
>[number];

interface ProjectCardProps {
  project: ProjectListResponse;
  viewMode: 'grid' | 'list';
  onProjectClick: (projectId: string) => void;
  onDeleteClick: (projectId: string) => void;
  formatRelativeTime: (date: Date) => string;
  formatCreatedDate: (date: Date) => string;
}

export function ProjectCard({
  project,
  viewMode,
  onProjectClick,
  onDeleteClick,
  formatRelativeTime,
  formatCreatedDate,
}: ProjectCardProps) {
  const dropdownItems: DropdownItem[] = [
    {
      label: '削除',
      icon: 'solar:trash-bin-trash-linear',
      onClick: () => onDeleteClick(project.id),
      danger: true,
    },
  ];

  if (viewMode === 'grid') {
    return (
      <Card
        hover
        onClick={() => onProjectClick(project.id)}
        className="group relative p-5"
      >

        <div className="flex items-start justify-between">
          <Image src="/Folder.svg" alt="プロジェクト" width={64} height={64} className='-ml-2'/>
          <div className="" onClick={(e) => e.stopPropagation()}>
            <Dropdown
              trigger={
                <button
                  className="h-8 w-8 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center"
                >
                  <Icon icon="solar:menu-dots-bold" width={20} className="text-gray-700 scale-120" />
                </button>
              }
              items={dropdownItems}
              align="right"
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors mb-1">
            {project.title || '無題のプロジェクト'}
          </h2>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Icon icon="solar:clock-circle-linear" width={14} className="text-gray-400" />
            <span>{formatRelativeTime(new Date(project.updated_at))}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Icon icon="solar:calendar-linear" width={14} className="text-gray-400" />
            <span>{formatCreatedDate(new Date(project.created_at))}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      hover
      onClick={() => onProjectClick(project.id)}
      className="group relative px-4 py-4 flex flex-row items-center gap-4 min-h-[72px]"
    >
      <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
        <Image src="/Folder.svg" alt="プロジェクト" width={64} height={64} />
      </div>

      <div className="flex-1 flex items-center gap-6 min-w-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors mb-1">
            {project.title || '無題のプロジェクト'}
          </h2>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Icon icon="solar:clock-circle-linear" width={14} className="text-gray-400" />
            <span>{formatRelativeTime(new Date(project.updated_at))}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Icon icon="solar:calendar-linear" width={14} className="text-gray-400" />
            <span>{formatCreatedDate(new Date(project.created_at))}</span>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          trigger={
            <button className="h-8 w-8 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center">
              <Icon icon="solar:menu-dots-bold" width={20} className="text-gray-700" />
            </button>
          }
          items={dropdownItems}
          align="right"
        />
      </div>
    </Card>
  );
}
