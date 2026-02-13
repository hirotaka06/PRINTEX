'use client';

import { useState } from 'react';
import { ProjectSort } from '@/components/features/project/ProjectSort';
import { ProjectViewToggle } from '@/components/features/project/ProjectViewToggle';
import { ProjectEmptyState } from '@/components/features/project/ProjectEmptyState';
import { ProjectListHeader } from '@/components/features/project/ProjectListHeader';
import { TrashCard } from '@/components/features/trash/TrashCard';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { useProjectListFilter } from '@/hooks/useProjectListFilter';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { restoreProjectAction, permanentlyDeleteProjectAction } from '@/app/actions/project';
import type { TrashedProjectItem } from '@/entities/project';

interface TrashListWidgetProps {
  initialProjects: TrashedProjectItem[];
}

export function TrashListWidget({ initialProjects }: TrashListWidgetProps) {
  const [projects, setProjects] = useState<TrashedProjectItem[]>(initialProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    searchQuery,
    sortBy,
    sortOrder,
    handleSortChange,
    filteredAndSortedProjects,
  } = useProjectListFilter(projects);

  const restoreConfirm = useConfirmModal();
  const deleteConfirm = useConfirmModal();

  const handleRestore = async (projectId: string) => {
    restoreConfirm.startProcessing();
    try {
      await restoreProjectAction(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      restoreConfirm.reset();
    } catch (err) {
      console.error('プロジェクトの復元に失敗しました:', err);
      alert('プロジェクトの復元に失敗しました');
    } finally {
      restoreConfirm.stopProcessing();
    }
  };

  const handlePermanentDelete = async (projectId: string) => {
    deleteConfirm.startProcessing();
    try {
      await permanentlyDeleteProjectAction(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      deleteConfirm.reset();
    } catch (err) {
      console.error('プロジェクトの完全削除に失敗しました:', err);
      alert('プロジェクトの完全削除に失敗しました');
    } finally {
      deleteConfirm.stopProcessing();
    }
  };

  return (
    <>
      <ProjectListHeader
        projectCount={projects.length}
        title="ゴミ箱"
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-2xl shadow-sm">
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4 flex items-center justify-end gap-3 rounded-t-2xl">
          <ProjectSort
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          <ProjectViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6 custom-scrollbar bg-white rounded-b-2xl">
        {filteredAndSortedProjects.length === 0 ? (
          <ProjectEmptyState hasSearchQuery={!!searchQuery.trim()} />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-3'
            }
          >
            {filteredAndSortedProjects.map((project) => (
              <TrashCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onRestore={(id) => restoreConfirm.openConfirm(id)}
                onPermanentDelete={(id) => deleteConfirm.openConfirm(id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!restoreConfirm.confirmId}
        onClose={restoreConfirm.closeConfirm}
        onConfirm={() => restoreConfirm.confirmId && handleRestore(restoreConfirm.confirmId)}
        title="プロジェクトを復元しますか？"
        message="このプロジェクトはプロジェクト一覧に戻ります。"
        confirmLabel="復元"
        variant="primary"
        isProcessing={restoreConfirm.isProcessing}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm.confirmId}
        onClose={deleteConfirm.closeConfirm}
        onConfirm={() => deleteConfirm.confirmId && handlePermanentDelete(deleteConfirm.confirmId)}
        title="プロジェクトを完全に削除しますか？"
        message="この操作は取り消せません。プロジェクトが完全に削除されます。"
        confirmLabel="完全に削除"
        variant="danger"
        isProcessing={deleteConfirm.isProcessing}
      />
    </div>
    </>
      )}
