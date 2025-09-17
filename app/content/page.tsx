import type { Metadata } from 'next';
import ContentPageContent from '@/components/content-page-content';

export const metadata: Metadata = {
  title: 'Content Management | SEO CRM',
  description: 'Manage your content pipeline with approval workflows',
};

export default function ContentPage() {
  return <ContentPageContent />;
}