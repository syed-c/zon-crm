import type { Metadata } from 'next';
import { ClientPortalDashboard } from '@/components/client-portal-dashboard';
import { RoleGuard } from '@/components/role-guard';

export const metadata: Metadata = {
  title: 'Client Portal | SEO CRM',
  description: 'View your projects and progress',
};

export default function ClientPortalPage() {
  return (
    <RoleGuard 
      module="clients" 
      capability="view"
      fallback={
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-crm-text mb-2">Access Restricted</h2>
            <p className="text-crm-muted">This portal is for clients only. Please contact your account manager for access.</p>
          </div>
        </div>
      }
    >
      <ClientPortalDashboard />
    </RoleGuard>
  );
}
