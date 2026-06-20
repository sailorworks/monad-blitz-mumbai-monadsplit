'use client';

import Link from 'next/link';
import { useModal } from '@getpara/react-sdk';
import { useAccount } from 'wagmi';
import Logo from './Logo';

export default function Navbar() {
  const { openModal } = useModal();
  const { isConnected, address } = useAccount();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-[var(--ink-on-light)] hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-white outline-none rounded">
        <Logo />
      </Link>
      
      <div className="hidden md:flex items-center gap-1 glass-panel-light px-4 py-2 rounded-[var(--radius-pill)]">
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-[var(--ink-on-light)] text-sm font-medium hover:bg-black/5 transition-colors">Our Story</Link>
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-[var(--ink-on-light)] text-sm font-medium hover:bg-black/5 transition-colors">FAQ</Link>
        <Link href="#" className="px-4 py-1 rounded-[var(--radius-pill)] text-[var(--ink-on-light)] text-sm font-medium hover:bg-black/5 transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        {!isConnected ? (
          <button 
            onClick={() => openModal()} 
            aria-label="Connect wallet" 
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-[var(--radius-pill)] glass-panel-light hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-black outline-none text-[var(--ink-on-light)] text-sm font-medium"
          >
            Connect
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] glass-panel-light text-[var(--ink-on-light)] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}
        <Link href="/dashboard" className="glass-panel-light px-5 py-2 rounded-[var(--radius-pill)] text-[var(--ink-on-light)] text-sm font-medium hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-black outline-none">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
