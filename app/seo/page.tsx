import type { Metadata } from 'next';
import SeoPageContent from '@/components/seo-page-content';

export const metadata: Metadata = {
  title: 'SEO Management | SEO CRM',
  description: 'Track and manage on-page SEO optimization tasks',
};

export default function SeoPage() {
  return <SeoPageContent />;
}