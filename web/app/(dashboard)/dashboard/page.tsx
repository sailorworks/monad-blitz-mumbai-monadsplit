import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StatsBar from '@/components/StatsBar';

export const metadata: Metadata = {
  title: 'Dashboard — Monadsplit',
  description: 'Monitor and manage your AI agents in real-time.',
};

// Dynamic imports for heavy client components (Next.js Best Practice)
const KanbanBoard = dynamic(() => import('@/components/KanbanBoard'), {
  loading: () => (
    <div className="flex-1 p-6 flex gap-6">
      <div className="flex-1 h-96 rounded-[var(--radius-card)] bg-[var(--glass-bg)] animate-pulse"></div>
      <div className="flex-1 h-96 rounded-[var(--radius-card)] bg-[var(--glass-bg)] animate-pulse"></div>
      <div className="flex-1 h-96 rounded-[var(--radius-card)] bg-[var(--glass-bg)] animate-pulse"></div>
    </div>
  ),
});

const ActivityFeed = dynamic(() => import('@/components/ActivityFeed'), {
  loading: () => (
    <div className="h-64 glass-panel rounded-t-[var(--radius-card)] border-b-0 animate-pulse"></div>
  ),
});

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
      <StatsBar />
      <KanbanBoard />
      <ActivityFeed />
    </div>
  );
}
