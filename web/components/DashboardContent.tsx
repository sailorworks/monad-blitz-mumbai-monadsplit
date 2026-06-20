'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const VENDOR_MAP: Record<string, { name: string; icon: string }> = {
  openai: { name: 'OpenAI', icon: '🤖' },
  firecrawl: { name: 'Firecrawl', icon: '🔥' },
  apify: { name: 'Apify', icon: '🕷️' },
  anthropic: { name: 'Anthropic', icon: '🧠' },
  serper: { name: 'Serper', icon: '🔍' },
  browserless: { name: 'Browserless', icon: '🌐' },
};

const MOCK_EVENTS = [
  { id: '1', time: '12:03:41', vendor: 'openai', amount: 2.50, status: 'approved' as const },
  { id: '2', time: '12:03:38', vendor: 'firecrawl', amount: 1.00, status: 'approved' as const },
  { id: '3', time: '12:03:22', vendor: 'unknown', amount: 5.00, status: 'rejected' as const, reason: 'Vendor not allowlisted' },
  { id: '4', time: '12:03:10', vendor: 'openai', amount: 0.50, status: 'approved' as const },
  { id: '5', time: '12:02:55', vendor: 'firecrawl', amount: 3.00, status: 'approved' as const },
  { id: '6', time: '12:02:40', vendor: 'openai', amount: 1.20, status: 'approved' as const },
];

/* ─── Simulation Steps ─── */
interface SimStep {
  label: string;
  detail: string;
  icon: string;
  duration: number; // ms to stay on this step
}

function getSimSteps(prompt: string, budget: string, vendors: string[]): SimStep[] {
  const vendorNames = vendors.map(v => VENDOR_MAP[v]?.name).filter(Boolean).join(', ');
  return [
    { label: 'Registering Agent', detail: 'Creating on-chain identity on Monad…', icon: '🆔', duration: 1400 },
    { label: 'Setting Budget Policy', detail: `Deploying $${budget} USDC budget to Treasury Vault…`, icon: '💰', duration: 1200 },
    { label: 'Configuring Allowlist', detail: `Allowlisting vendors: ${vendorNames}`, icon: '🛡️', duration: 1000 },
    { label: 'Policy Check', detail: 'Running checkSpend() — all 6 on-chain checks…', icon: '✅', duration: 1100 },
    { label: 'Initializing Research', detail: `Task: "${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}"`, icon: '🔬', duration: 1300 },
    { label: 'Agent Live', detail: 'Your agent is now transacting on Monad. Redirecting…', icon: '🚀', duration: 800 },
  ];
}

/* ─── Simulation Screen ─── */
function SimulationScreen({ prompt, budget, vendors, onComplete }: {
  prompt: string;
  budget: string;
  vendors: string[];
  onComplete: () => void;
}) {
  const steps = getSimSteps(prompt, budget, vendors);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= steps.length) {
      // Small delay before showing dashboard
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }, steps[currentStep].duration);

    return () => clearTimeout(t);
  }, [currentStep, steps, onComplete]);

  const overallProgress = Math.min(((currentStep) / steps.length) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] animate-[fadeUp_0.4s_ease-out]">
      
      {/* Header */}
      <div className="glass-panel px-4 py-1.5 rounded-[var(--radius-pill)] inline-flex items-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-[var(--accent-amber)] animate-[pulseDot_2s_infinite]"></div>
        <span className="text-sm font-medium tracking-wide text-[var(--ink-on-light)]">Deploying on Monad</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-display-sans tracking-tight text-[var(--ink-on-light)] mb-3 text-center">
        Setting up your <span className="font-display-serif">agent</span>
      </h1>
      <p className="text-[var(--ink-muted-light)] text-lg mb-12 text-center">
        Deploying smart contracts and configuring policies on-chain…
      </p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden mb-10">
        <div 
          className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="w-full space-y-3">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = currentStep === i;
          const isPending = !isCompleted && !isActive;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-[var(--radius-card)] transition-all duration-300 ${
                isActive
                  ? 'glass-panel shadow-[var(--shadow-sm)]'
                  : isCompleted
                  ? 'bg-black/[0.02]'
                  : 'opacity-40'
              }`}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-amber)] border-t-transparent animate-spin"></div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-black/10"></div>
                )}
              </div>

              {/* Icon */}
              <span className="text-xl flex-shrink-0">{step.icon}</span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className={`font-display-sans text-sm font-medium ${
                  isPending ? 'text-[var(--ink-muted-light)]' : 'text-[var(--ink-on-light)]'
                }`}>
                  {step.label}
                </div>
                {(isActive || isCompleted) && (
                  <div className="text-xs text-[var(--ink-muted-light)] mt-0.5 truncate">
                    {step.detail}
                  </div>
                )}
              </div>

              {/* Timing */}
              {isCompleted && (
                <span className="text-xs font-mono text-[var(--accent-green)] flex-shrink-0">
                  {(step.duration / 1000).toFixed(1)}s
                </span>
              )}
              {isActive && (
                <span className="text-xs font-mono text-[var(--accent-amber)] flex-shrink-0 animate-pulse">
                  running…
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Monad branding */}
      <div className="mt-10 text-xs text-[var(--ink-muted-light)] font-mono flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse"></span>
        10,000 TPS · 400ms blocks · 800ms finality
      </div>
    </div>
  );
}


/* ─── Dashboard View (unchanged) ─── */
function DashboardView({ prompt, budget: initialBudget, perTxLimit: initialPerTx, vendors }: {
  prompt: string;
  budget: string;
  perTxLimit: string;
  vendors: string[];
}) {
  const [budget, setBudget] = useState(initialBudget);
  const [perTxLimit, setPerTxLimit] = useState(initialPerTx);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const totalSpent = 8.20;
  const budgetNum = parseFloat(budget) || 50;
  const progressPercent = Math.min((totalSpent / budgetNum) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 animate-[fadeUp_0.4s_ease-out]">

      {/* Header: Task + Status */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="glass-panel px-4 py-1.5 rounded-[var(--radius-pill)] inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-[pulseDot_2s_infinite]"></div>
            <span className="text-sm font-medium tracking-wide text-[var(--ink-on-light)]">Agent Running</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display-sans tracking-tight text-[var(--ink-on-light)] mb-2">Research Dashboard</h1>
          <div className="glass-panel p-4 rounded-[var(--radius-card)] mt-4">
            <div className="text-xs font-medium text-[var(--ink-muted-light)] uppercase tracking-wider mb-1">Your Task</div>
            <p className="text-lg text-[var(--ink-on-light)] font-display-sans">&ldquo;{prompt}&rdquo;</p>
          </div>
        </div>

        {/* Kill Switch */}
        <div className="flex gap-3 pt-2">
          <button className="glass-panel px-5 py-3 rounded-[var(--radius-pill)] text-[var(--accent-amber)] hover:bg-black/5 transition-colors text-sm font-medium flex items-center gap-2">
            ⏸ Pause Agent
          </button>
          <button className="glass-panel px-5 py-3 rounded-[var(--radius-pill)] text-[var(--accent-red)] hover:bg-red-500/10 transition-colors text-sm font-medium flex items-center gap-2">
            🔴 Kill Switch
          </button>
        </div>
      </div>

      {/* Budget & Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Card */}
        <div className="glass-panel p-6 rounded-[var(--radius-card)] col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--ink-muted-light)] uppercase tracking-wider">Budget</h3>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-xs text-[var(--accent-blue)] hover:underline font-medium"
            >
              {isEditingBudget ? 'Done' : 'Edit'}
            </button>
          </div>

          {isEditingBudget ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-[var(--ink-muted-light)] block mb-1">Total Budget (USDC)</label>
                <div className="flex items-center gap-1 glass-panel rounded-[var(--radius-sm)] px-3 py-2">
                  <span className="text-[var(--ink-muted-light)]">$</span>
                  <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xl font-display-sans text-[var(--ink-on-light)]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--ink-muted-light)] block mb-1">Per-Tx Limit (USDC)</label>
                <div className="flex items-center gap-1 glass-panel rounded-[var(--radius-sm)] px-3 py-2">
                  <span className="text-[var(--ink-muted-light)]">$</span>
                  <input
                    type="number"
                    min="1"
                    value={perTxLimit}
                    onChange={(e) => setPerTxLimit(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xl font-display-sans text-[var(--ink-on-light)]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-display-sans font-semibold text-[var(--ink-on-light)]">${totalSpent.toFixed(2)}</span>
              <span className="text-lg text-[var(--ink-muted-light)] mb-1">/ ${budget} USDC</span>
              <span className="text-xs text-[var(--ink-muted-light)] ml-auto mb-1">${perTxLimit} per tx limit</span>
            </div>
          )}

          <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-[var(--ink-muted-light)]">
            <span>{progressPercent.toFixed(0)}% used</span>
            <span>${(budgetNum - totalSpent).toFixed(2)} remaining</span>
          </div>
        </div>

        {/* Vendor Allowlist Card */}
        <div className="glass-panel p-6 rounded-[var(--radius-card)]">
          <h3 className="text-sm font-medium text-[var(--ink-muted-light)] uppercase tracking-wider mb-4">Allowed Vendors</h3>
          <div className="space-y-3">
            {vendors.map(vendorId => {
              const vendor = VENDOR_MAP[vendorId];
              if (!vendor) return null;
              return (
                <div key={vendorId} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-black/[0.03] border border-black/[0.06]">
                  <span className="text-lg">{vendor.icon}</span>
                  <span className="font-display-sans text-sm font-medium text-[var(--ink-on-light)]">{vendor.name}</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
                </div>
              );
            })}
            {vendors.length === 0 && (
              <p className="text-sm text-[var(--ink-muted-light)] italic">No vendors selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-panel rounded-[var(--radius-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--glass-border)] flex items-center justify-between">
          <h3 className="font-display-sans font-medium text-[var(--ink-on-light)]">Live Activity Feed</h3>
          <span className="text-xs text-[var(--ink-muted-light)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse"></span>
            Connected to Monad
          </span>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {MOCK_EVENTS.map((event) => {
            const vendor = VENDOR_MAP[event.vendor];
            const isApproved = event.status === 'approved';
            return (
              <div key={event.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-black/[0.02] transition-colors">
                <div className="flex items-center gap-5">
                  <span className="font-mono text-xs text-[var(--ink-muted-light)] w-16">{event.time}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{vendor?.icon || '❓'}</span>
                    <span className="font-display-sans text-sm text-[var(--ink-on-light)]">{vendor?.name || event.vendor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-[var(--ink-on-light)]">${event.amount.toFixed(2)}</span>
                  {isApproved ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-[var(--radius-pill)] bg-emerald-500/10 text-emerald-700">
                      ✓ Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-[var(--radius-pill)] bg-red-500/10 text-red-600" title={event.reason}>
                      ✕ Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Check Visualizer */}
      <div className="glass-panel p-6 rounded-[var(--radius-card)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--ink-muted-light)] uppercase tracking-wider">Last Policy Check</h3>
          <span className="text-xs font-mono text-[var(--ink-muted-light)]">400ms on Monad</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Agent Active', pass: true },
            { label: 'Vendor Allowed', pass: true },
            { label: 'Under Per-Tx Limit', pass: true },
            { label: 'Under Daily Budget', pass: true },
            { label: 'Cooldown Elapsed', pass: true },
            { label: 'Not Paused', pass: true },
          ].map((check, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] bg-black/[0.03] border border-black/[0.06]">
              <span className={`text-sm ${check.pass ? 'text-emerald-600' : 'text-red-500'}`}>
                {check.pass ? '✓' : '✕'}
              </span>
              <span className="text-xs text-[var(--ink-on-light)]">{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ─── Orchestrator ─── */
function DashboardInner() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || 'Research competitors for my product';
  const budget = searchParams.get('budget') || '50';
  const perTxLimit = searchParams.get('perTxLimit') || '10';
  const vendorParam = searchParams.get('vendors') || 'openai,firecrawl';
  const vendors = vendorParam.split(',').filter(Boolean);

  const [simDone, setSimDone] = useState(false);

  const handleSimComplete = useCallback(() => {
    setSimDone(true);
  }, []);

  if (!simDone) {
    return (
      <SimulationScreen
        prompt={prompt}
        budget={budget}
        vendors={vendors}
        onComplete={handleSimComplete}
      />
    );
  }

  return (
    <DashboardView
      prompt={prompt}
      budget={budget}
      perTxLimit={perTxLimit}
      vendors={vendors}
    />
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="h-32 glass-panel rounded-[var(--radius-card)] animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 glass-panel rounded-[var(--radius-card)] animate-pulse col-span-2"></div>
          <div className="h-48 glass-panel rounded-[var(--radius-card)] animate-pulse"></div>
        </div>
        <div className="h-64 glass-panel rounded-[var(--radius-card)] animate-pulse"></div>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
