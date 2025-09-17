import type { Metadata } from 'next';
import { SuperAdminOnboarding } from '@/components/super-admin-onboarding';
import { RoleGuard } from '@/components/role-guard';

export const metadata: Metadata = {
  title: 'Add Team Member | SEO CRM',
  description: 'Create new team member with role-based permissions',
};

export default function NewUserPage() {
  return (
    <RoleGuard module="settings" capability="edit">
      <SuperAdminOnboarding />
    </RoleGuard>
  );
}
