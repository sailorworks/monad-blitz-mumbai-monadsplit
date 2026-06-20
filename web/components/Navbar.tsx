'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-[var(--ink-on-light)] hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-white outline-none rounded">
        <Logo />
      </Link>
      
      <div className="hidden md:flex items-center gap-1 glass-panel px-4 py-2 rounded-[var(--radius-pill)]">
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-sm font-medium hover:bg-[var(--glass-bg)] transition-colors">Our Story</Link>
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-sm font-medium hover:bg-[var(--glass-bg)] transition-colors">FAQ</Link>
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-sm font-medium hover:bg-[var(--glass-bg)] transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Placeholder for Para connect button */}
        <button aria-label="Connect wallet" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full glass-panel hover:bg-[var(--glass-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
        <Link href="/dashboard" className="glass-panel px-5 py-2 rounded-[var(--radius-pill)] text-sm font-medium hover:bg-[var(--glass-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
