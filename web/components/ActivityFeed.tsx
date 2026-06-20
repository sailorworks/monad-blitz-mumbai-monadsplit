'use client';

import { MOCK_EVENTS } from '@/lib/mock-data';

export default function ActivityFeed() {
  const events = MOCK_EVENTS;

  return (
    <div className="glass-panel rounded-t-[var(--radius-card)] border-b-0 h-64 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-black/20">
        <h3 className="font-display-sans font-medium">Live Activity Feed</h3>
        <span className="text-xs text-[var(--ink-muted)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse"></span>
          Connected to Monad
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between text-sm animate-[slideInRight_0.3s_ease-out]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[var(--ink-muted)] w-20">{event.timestamp}</span>
              <span className="font-medium w-20 text-[var(--ink-on-dark)]">Agent-{event.agentId}</span>
              <span className="text-[var(--ink-muted)]">&rarr;</span>
              <span className="w-24 truncate">{event.vendor}</span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-mono w-16 text-right">${event.amount.toFixed(2)}</span>
              <div className="flex items-center gap-2 w-32">
                {event.status === 'Approved' ? (
                  <>
                    <span className="text-[var(--accent-green)]">✅</span>
                    <span className="text-[var(--accent-green)]">Approved</span>
                  </>
                ) : (
                  <>
                    <span className="text-[var(--accent-red)]">❌</span>
                    <span className="text-[var(--accent-red)]" title={event.reason}>Rejected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
