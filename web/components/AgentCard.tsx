'use client';

import type { Agent } from '@/lib/mock-data';

export default function AgentCard({ agent }: { agent: Agent }) {
  const progressPercent = Math.min((agent.spent / agent.limit) * 100, 100);
  
  const statusColor = 
    agent.status === 'completed' ? 'var(--accent-green)' :
    agent.status === 'queued' ? 'var(--accent-blue)' :
    agent.status === 'paused' ? 'var(--accent-amber)' :
    agent.status === 'killed' ? 'var(--accent-red)' :
    'var(--accent-green)'; // in-progress default to green

  return (
    <div className="glass-panel p-4 rounded-[var(--radius-card)] mb-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glass)] transition-all duration-300 cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[var(--ink-muted)]">{agent.name}</span>
          {agent.riskScore > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--glass-bg)] text-[var(--accent-amber)]" title="Risk Score">
              Risk: {agent.riskScore}
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[var(--ink-muted)] hover:text-white" title="Pause">⏸</button>
          <button className="text-[var(--ink-muted)] hover:text-[var(--accent-red)]" title="Kill">☠</button>
        </div>
      </div>
      
      <h3 className="font-display-sans text-lg mb-4 truncate" title={agent.task}>
        "{agent.task}"
      </h3>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--ink-muted)]">${agent.spent} / ${agent.limit}</span>
          <div className="flex items-center gap-1">
            {agent.status === 'in-progress' && (
              <div className="flex gap-1 mr-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: statusColor, boxShadow: agent.status === 'in-progress' ? `0 0 8px ${statusColor}` : 'none' }}
            ></span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-[var(--glass-border)] rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%`, backgroundColor: statusColor }}
          ></div>
        </div>
      </div>
    </div>
  );
}
