import { getTrashedProjects } from '@/lib/api/server';
import { TrashListWidget } from '@/widgets/trash-list';

export default async function TrashPage() {
  const projects = await getTrashedProjects();

  return (
    <TrashListWidget initialProjects={projects} />
  );
}
