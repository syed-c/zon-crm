import type { Metadata } from 'next';
import ClientsPageContent from '@/components/clients-page-content';

export const metadata: Metadata = {
  title: 'Client Management | SEO CRM',
  description: 'Manage your clients and their project portfolios',
};

export default function ClientsPage() {
  return <ClientsPageContent />;
}