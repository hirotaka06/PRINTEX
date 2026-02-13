import { getProjects } from '@/lib/api/server';
import { ProjectListWidget } from '@/widgets/project-list';

export default async function ProjectPage() {
  const projects = await getProjects();

  return (
    <ProjectListWidget initialProjects={projects} />
  );
}
