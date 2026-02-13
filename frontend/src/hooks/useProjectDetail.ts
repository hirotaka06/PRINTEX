import { useState, useCallback } from 'react';
import { getProjectDetailAction, updateProjectSolutionNotesAction } from '@/app/actions/project';
import type { paths } from '@/generated/api';

type ProjectDetailResponse = NonNullable<
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json']
>;

export function useProjectDetail(projectId: string, initialDetail: ProjectDetailResponse) {
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse>(initialDetail);

  const refreshProjectDetail = useCallback(async () => {
    try {
      const updatedDetail = await getProjectDetailAction(projectId);
      setProjectDetail(updatedDetail);
      return updatedDetail;
    } catch (error) {
      console.error('Failed to refresh project detail:', error);
      throw error;
    }
  }, [projectId]);

  const updateSolutionNotes = useCallback(async (solutionNotes: string) => {
    try {
      const updatedDetail = await updateProjectSolutionNotesAction(projectId, solutionNotes);
      setProjectDetail(updatedDetail);
      return updatedDetail;
    } catch (error) {
      console.error('Failed to update solution notes:', error);
      throw error;
    }
  }, [projectId]);

  return {
    projectDetail,
    setProjectDetail,
    refreshProjectDetail,
    updateSolutionNotes,
  };
}
