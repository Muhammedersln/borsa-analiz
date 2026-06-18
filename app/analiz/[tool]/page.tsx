import { notFound } from 'next/navigation';
import { getToolById } from '@/lib/tools';
import AnalysisClient from './AnalysisClient';

interface Props {
  params: Promise<{ tool: string }>;
}

export default async function AnalizPage({ params }: Props) {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) notFound();

  return <AnalysisClient tool={tool} />;
}

export async function generateStaticParams() {
  const { tools } = await import('@/lib/tools');
  return tools.map((t) => ({ tool: t.id }));
}
