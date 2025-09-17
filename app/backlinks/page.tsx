import type { Metadata } from 'next';
import BacklinksPageContent from '@/components/backlinks-page-content';

export const metadata: Metadata = {
  title: 'Backlinks Management | SEO CRM',
  description: 'Track and manage backlink building campaigns',
};

export default function BacklinksPage() {
  return <BacklinksPageContent />;
}