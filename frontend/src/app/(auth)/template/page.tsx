import { getTemplates } from '@/lib/api/server';
import { TemplateListWidget } from '@/widgets/template-list';

export default async function TemplatePage() {
  const templates = await getTemplates();

  return (
    <TemplateListWidget initialTemplates={templates} />
  );
}
