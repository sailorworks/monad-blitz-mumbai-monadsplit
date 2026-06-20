'use client';

import { MOCK_STATS } from '@/lib/mock-data';

export default function StatsBar() {
  // In the future, these stats will be derived from on-chain reads (wagmi)
  const { activeCount, pausedCount, totalSpent, totalBudget } = MOCK_STATS;
  const progressPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  return (
    <div className="w-full glass-panel border-x-0 border-t-0 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-display-sans">Welcome back. Your agents are running.</h2>
      </div>
      
      <div className="flex items-center gap-6 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-[pulseDot_2s_infinite]"></span>
          <span className="text-[var(--ink-muted)]">Active:</span>
          <span>{activeCount}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]"></span>
          <span className="text-[var(--ink-muted)]">Paused:</span>
          <span>{pausedCount}</span>
        </div>

        <div className="h-6 w-px bg-[var(--glass-border)] mx-2"></div>

        <div className="flex flex-col gap-1 w-48">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--ink-muted)]">Budget Used</span>
            <span>${totalSpent} / ${totalBudget}</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--glass-border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent-blue)] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <button className="glass-panel px-4 py-2 rounded-[var(--radius-pill)] hover:bg-[var(--glass-bg)] transition-colors text-[var(--ink-on-dark)] ml-4">
          + New Agent
        </button>
      </div>
    </div>
  );
}
