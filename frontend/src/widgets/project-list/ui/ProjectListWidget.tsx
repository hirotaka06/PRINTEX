'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ProjectCard } from '@/components/features/project/ProjectCard';
import { ProjectSort } from '@/components/features/project/ProjectSort';
import { ProjectViewToggle } from '@/components/features/project/ProjectViewToggle';
import { ProjectSearch } from '@/components/features/project/ProjectSearch';
import { ProjectEmptyState } from '@/components/features/project/ProjectEmptyState';
import { ProjectListHeader } from '@/components/features/project/ProjectListHeader';
import { NewProjectModal } from '@/components/features/project/NewProjectModal';
import { Card } from '@/shared/ui/card';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { useProjectListFilter } from '@/hooks/useProjectListFilter';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { formatRelativeTime, formatCreatedDate } from '@/shared/lib/utils/date';
import { deleteProjectAction } from '@/app/actions/project';
import type { ProjectListItem } from '@/entities/project';

interface ProjectListWidgetProps {
  initialProjects: ProjectListItem[];
}

export function ProjectListWidget({ initialProjects }: ProjectListWidgetProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectListItem[]>(initialProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortOrder,
    handleSortChange,
    filteredAndSortedProjects,
  } = useProjectListFilter(projects);

  const deleteConfirm = useConfirmModal();

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}/editor`);
  };

  const handleDelete = async (projectId: string) => {
    deleteConfirm.startProcessing();
    try {
      await deleteProjectAction(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      deleteConfirm.reset();
    } catch (err) {
      console.error('プロジェクトの削除に失敗しました:', err);
      alert('プロジェクトの削除に失敗しました');
    } finally {
      deleteConfirm.stopProcessing();
    }
  };

  return (
    <>
      <ProjectListHeader projectCount={projects.length} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-2xl shadow-sm">
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4 flex items-center justify-between gap-3 rounded-t-2xl">
          <div className="flex-1 max-w-md">
            <ProjectSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex items-center gap-3">
            <ProjectSort
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
            <ProjectViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-6 pb-6 custom-scrollbar bg-white rounded-b-2xl">
        {filteredAndSortedProjects.length === 0 ? (
          <ProjectEmptyState
            hasSearchQuery={!!searchQuery.trim()}
            onNewProjectClick={() => setIsModalOpen(true)}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-3'
            }
          >
            <Card
              hover
              onClick={() => setIsModalOpen(true)}
              className={
                viewMode === 'grid'
                  ? 'border-2 border-dashed border-gray-200 p-8 pt-4 gap-y-2 flex flex-col items-center justify-center min-h-[200px]'
                  : 'border-2 border-dashed border-gray-200 px-4 py-4 flex flex-row items-center gap-4 min-h-[72px]'
              }
            >
              {viewMode === 'grid' ? (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon icon="solar:add-square-linear" width={48} className="text-gray-600" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <Icon icon="solar:add-square-linear" width={24} className="text-gray-600" />
                </div>
              )}
              <span className="text-sm text-gray-700 font-medium">
                新しいプロジェクトを作成
              </span>
            </Card>

            {filteredAndSortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onProjectClick={handleProjectClick}
                onDeleteClick={(id) => deleteConfirm.openConfirm(id)}
                formatRelativeTime={formatRelativeTime}
                formatCreatedDate={formatCreatedDate}
              />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm.confirmId}
        onClose={deleteConfirm.closeConfirm}
        onConfirm={() => deleteConfirm.confirmId && handleDelete(deleteConfirm.confirmId)}
        title="プロジェクトを削除しますか？"
        message="このプロジェクトはゴミ箱に移動されます。後で復元することができます。"
        confirmLabel="削除"
        variant="danger"
        isProcessing={deleteConfirm.isProcessing}
      />
    </div>
    </>
  );
}
