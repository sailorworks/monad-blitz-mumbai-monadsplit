import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-landing min-h-screen w-full relative overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-16 px-4 md:px-8 relative z-10">
        {children}
      </main>

      <footer className="py-8 text-center text-sm text-[var(--ink-muted-light)] border-t border-[var(--glass-border)] relative z-10">
        <p>&copy; {new Date().getFullYear()} Monadsplit. Built on Monad.</p>
      </footer>
    </div>
  );
}
