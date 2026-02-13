import { getProjectDetail } from '@/lib/api/server';
import { EditorPageWidget } from '@/widgets/editor-page';
import { notFound } from 'next/navigation';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const projectDetail = await getProjectDetail(id);

  if (!projectDetail) {
    notFound();
  }

  return <EditorPageWidget projectId={id} initialProjectDetail={projectDetail} />;
}
