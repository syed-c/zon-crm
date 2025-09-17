import type { Metadata } from 'next';
import ProjectDetailContent from '@/components/project-detail-content';
import { fetchProjectBySlug } from '@/services/projectsService';

export const metadata: Metadata = {
  title: 'Project Details | SEO CRM',
  description: 'Manage project details, SEO, content, and team',
};

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProjectDetailPage({ params, searchParams }: ProjectDetailPageProps) {
  const { projectId } = await params; // treat as slug if non-uuid
  const { tab } = await searchParams;
  const proj = await fetchProjectBySlug(projectId);
  const resolvedId = proj?.id || projectId;
  return <ProjectDetailContent projectId={resolvedId} initialTab={tab || 'overview'} />;
}