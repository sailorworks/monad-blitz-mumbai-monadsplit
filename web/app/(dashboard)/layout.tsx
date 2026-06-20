import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-dashboard min-h-screen text-[var(--ink-on-dark)] flex flex-col">
      <nav className="sticky top-0 z-50 glass-panel border-b border-[var(--glass-border)] px-6 py-4 flex items-center justify-between bg-[#0D1412]/80">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-[var(--ink-on-dark)]">Dashboard</Link>
            <Link href="#" className="text-[var(--ink-muted)] hover:text-[var(--ink-on-dark)] transition-colors">Agents</Link>
            <Link href="#" className="text-[var(--accent-red)] hover:text-red-400 transition-colors">Kill Switch</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors">
            <span className="text-xl">👤</span>
          </button>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
