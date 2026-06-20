export type AgentStatus = 'queued' | 'in-progress' | 'completed' | 'paused' | 'killed';

export interface Agent {
  id: number;
  name: string;
  task: string;
  status: AgentStatus;
  spent: number;
  limit: number;
  riskScore: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: number;
  vendor: string;
  amount: number;
  status: 'Approved' | 'Rejected';
  reason?: string;
}

// Mock data to use before wallet integration and on-chain reads are active
export const MOCK_AGENTS: Agent[] = [
  { id: 3, name: 'Agent-3', task: 'Scan APIs', status: 'queued', spent: 0, limit: 50, riskScore: 0 },
  { id: 5, name: 'Agent-5', task: 'Monitor feeds', status: 'queued', spent: 0, limit: 25, riskScore: 0 },
  { id: 1, name: 'Agent-1', task: 'Research comp.', status: 'in-progress', spent: 12, limit: 100, riskScore: 5 },
  { id: 4, name: 'Agent-4', task: 'Deploy contract', status: 'in-progress', spent: 3, limit: 200, riskScore: 2 },
  { id: 2, name: 'Agent-2', task: 'Price check', status: 'completed', spent: 45, limit: 50, riskScore: 0 },
  { id: 6, name: 'Agent-6', task: 'Spam simulation', status: 'paused', spent: 200, limit: 200, riskScore: 90 },
];

export const MOCK_EVENTS: ActivityEvent[] = [
  { id: '1', timestamp: '12:03:41', agentId: 1, vendor: 'OpenAI', amount: 2.50, status: 'Approved' },
  { id: '2', timestamp: '12:03:38', agentId: 4, vendor: 'Firecrawl', amount: 1.00, status: 'Approved' },
  { id: '3', timestamp: '12:03:22', agentId: 1, vendor: 'Unknown', amount: 5.00, status: 'Rejected', reason: 'Vendor not allowlisted' },
  { id: '4', timestamp: '12:03:10', agentId: 4, vendor: 'OpenAI', amount: 0.50, status: 'Approved' },
];

export const MOCK_STATS = {
  activeCount: 3,
  pausedCount: 1,
  totalSpent: 847,
  totalBudget: 2000,
  isGloballyPaused: false,
};
