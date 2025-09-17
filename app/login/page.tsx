import type { Metadata } from 'next';
import { SimpleLoginPageContent } from '@/components/simple-login-page-content';

export const metadata: Metadata = {
  title: 'Login - ZON Digital Marketing CRM',
  description: 'Sign in to your ZON CRM account to manage your digital marketing campaigns and projects.',
};

export default function LoginPage() {
  return <SimpleLoginPageContent />;
}