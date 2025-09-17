import type { Metadata } from 'next';
import TasksPageContent from '@/components/tasks-page-content';

export const metadata: Metadata = {
  title: 'Task Management | SEO CRM',
  description: 'Manage tasks with Kanban board and team collaboration',
};

export default function TasksPage() {
  return <TasksPageContent />;
}