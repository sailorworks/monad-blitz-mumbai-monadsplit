'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const AVAILABLE_VENDORS = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', description: 'GPT models & embeddings' },
  { id: 'firecrawl', name: 'Firecrawl', icon: '🔥', description: 'Web scraping & crawling' },
  { id: 'apify', name: 'Apify', icon: '🕷️', description: 'Web automation & data extraction' },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', description: 'Claude AI models' },
  { id: 'serper', name: 'Serper', icon: '🔍', description: 'Google search API' },
  { id: 'browserless', name: 'Browserless', icon: '🌐', description: 'Headless browser automation' },
];

function ConfigureAgentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';

  const [budget, setBudget] = useState('50');
  const [perTxLimit, setPerTxLimit] = useState('10');
  const [selectedVendors, setSelectedVendors] = useState<string[]>(['openai', 'firecrawl']);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(v => v !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      prompt,
      budget,
      perTxLimit,
      vendors: selectedVendors.join(','),
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <form onSubmit={handleLaunch} className="w-full text-left space-y-10 animate-[fadeUp_0.4s_ease-out]">
      
      {/* Prompt Display */}
      {prompt && (
        <div className="glass-panel p-5 rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-muted-light)] uppercase tracking-wider mb-2">Your Research Task</div>
          <p className="text-lg text-[var(--ink-on-light)] font-display-sans">&ldquo;{prompt}&rdquo;</p>
        </div>
      )}

      {/* Budget Section */}
      <div>
        <h3 className="text-xl font-display-sans font-semibold text-[var(--ink-on-light)] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] flex items-center justify-center text-sm font-bold">1</span>
          Set Budget
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-[var(--radius-card)]">
            <label className="text-sm text-[var(--ink-muted-light)] block mb-2">Total Budget (USDC)</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[var(--ink-muted-light)]">$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-3xl font-display-sans text-[var(--ink-on-light)] placeholder-[var(--ink-muted-light)]"
                placeholder="50"
              />
              <span className="text-sm text-[var(--ink-muted-light)] font-mono">USDC</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-[var(--radius-card)]">
            <label className="text-sm text-[var(--ink-muted-light)] block mb-2">Per-Transaction Limit (USDC)</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[var(--ink-muted-light)]">$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={perTxLimit}
                onChange={(e) => setPerTxLimit(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-3xl font-display-sans text-[var(--ink-on-light)] placeholder-[var(--ink-muted-light)]"
                placeholder="10"
              />
              <span className="text-sm text-[var(--ink-muted-light)] font-mono">USDC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy / Vendor Allowlist Section */}
      <div>
        <h3 className="text-xl font-display-sans font-semibold text-[var(--ink-on-light)] mb-2 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] flex items-center justify-center text-sm font-bold">2</span>
          Vendor Allowlist
        </h3>
        <p className="text-sm text-[var(--ink-muted-light)] mb-6 ml-11">Select which APIs your agent is allowed to spend on.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_VENDORS.map(vendor => {
            const isSelected = selectedVendors.includes(vendor.id);
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => toggleVendor(vendor.id)}
                className={`p-4 rounded-[var(--radius-card)] text-left transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[var(--ink-on-light)]/10 border-[var(--ink-on-light)]/30 shadow-[var(--shadow-sm)]'
                    : 'glass-panel hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{vendor.icon}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-[var(--accent-green)] bg-[var(--accent-green)]' : 'border-[var(--glass-border)]'
                  }`}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="font-display-sans font-medium text-[var(--ink-on-light)] text-sm">{vendor.name}</div>
                <div className="text-xs text-[var(--ink-muted-light)] mt-0.5">{vendor.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + Launch */}
      <div className="glass-panel p-6 rounded-[var(--radius-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm text-[var(--ink-muted-light)]">Summary</div>
          <div className="text-[var(--ink-on-light)] font-display-sans">
            <span className="font-semibold">${budget || '0'} USDC</span> budget
            <span className="mx-2 text-[var(--ink-muted-light)]">·</span>
            <span className="font-semibold">${perTxLimit || '0'}</span> per tx
            <span className="mx-2 text-[var(--ink-muted-light)]">·</span>
            <span className="font-semibold">{selectedVendors.length}</span> vendor{selectedVendors.length !== 1 ? 's' : ''}
          </div>
        </div>
        <button
          type="submit"
          disabled={selectedVendors.length === 0 || !budget}
          className="bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] px-8 py-4 rounded-[var(--radius-pill)] font-medium text-lg hover:scale-[1.02] hover:shadow-[var(--shadow-md)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ink-on-light)] outline-none"
        >
          Launch Agent &rarr;
        </button>
      </div>
    </form>
  );
}

export default function ConfigureAgent() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-6 animate-pulse">
        <div className="glass-panel h-20 rounded-[var(--radius-card)]"></div>
        <div className="glass-panel h-32 rounded-[var(--radius-card)]"></div>
        <div className="glass-panel h-48 rounded-[var(--radius-card)]"></div>
      </div>
    }>
      <ConfigureAgentInner />
    </Suspense>
  );
}
