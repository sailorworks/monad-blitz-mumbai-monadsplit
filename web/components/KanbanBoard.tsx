'use client';

import { MOCK_AGENTS } from '@/lib/mock-data';
import AgentCard from './AgentCard';

export default function KanbanBoard() {
  const agents = MOCK_AGENTS;
  
  const queued = agents.filter(a => a.status === 'queued');
  const inProgress = agents.filter(a => a.status === 'in-progress' || a.status === 'paused');
  const completed = agents.filter(a => a.status === 'completed' || a.status === 'killed');

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-hidden">
      {/* Queued Column */}
      <div className="flex flex-col h-full animate-[fadeUp_0.4s_ease-out]">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-display-sans font-medium text-[var(--ink-muted)] tracking-wider text-sm uppercase">Queued</h3>
          <span className="bg-[var(--glass-bg)] px-2 py-0.5 rounded-full text-xs">{queued.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {queued.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="flex flex-col h-full animate-[fadeUp_0.5s_ease-out]">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-display-sans font-medium text-[var(--ink-muted)] tracking-wider text-sm uppercase">In Progress</h3>
          <span className="bg-[var(--glass-bg)] px-2 py-0.5 rounded-full text-xs">{inProgress.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {inProgress.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className="flex flex-col h-full animate-[fadeUp_0.6s_ease-out]">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-display-sans font-medium text-[var(--ink-muted)] tracking-wider text-sm uppercase">Completed</h3>
          <span className="bg-[var(--glass-bg)] px-2 py-0.5 rounded-full text-xs">{completed.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {completed.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
