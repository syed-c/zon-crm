import type { Metadata } from 'next';
import { AuditReport } from '@/components/audit-report';

export const metadata: Metadata = {
  title: 'Audit Report | SEO CRM',
  description: 'Comprehensive CRM audit results and implementation status',
};

export default function AuditReportPage() {
  return <AuditReport />;
}