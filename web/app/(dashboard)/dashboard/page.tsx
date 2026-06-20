import type { Metadata } from 'next';
import DashboardContent from '@/components/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard — Monadsplit',
  description: 'Monitor and manage your AI research agent in real-time.',
  generator: 'monskills',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
