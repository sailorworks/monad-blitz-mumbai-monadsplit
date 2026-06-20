import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroInput from '@/components/HeroInput';

export const metadata: Metadata = {
  title: 'Monadsplit — On-Chain CFO for AI Agents',
  description: 'The financial control layer for autonomous AI agents. Budget, control, and audit every transaction on Monad.',
  generator: 'monskills',
};

export default function MarketingPage() {
  return (
    <main className="theme-landing min-h-screen w-full relative overflow-x-hidden">
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-16 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <div className="glass-panel px-4 py-1.5 rounded-[var(--radius-pill)] flex items-center gap-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-[pulseDot_2s_infinite]"></div>
            <span className="text-sm font-medium tracking-wide">On-chain AI Control</span>
          </div>

          <h1 className="text-6xl md:text-8xl tracking-tight mb-8 text-balance">
            <span className="font-display-sans block md:inline text-[var(--ink-on-light)]">Clarity in </span>
            <span className="font-display-serif block md:inline text-[var(--ink-on-light)]">Complexity</span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-[var(--ink-muted-light)] max-w-2xl mx-auto leading-relaxed text-balance">
            The on-chain CFO for your autonomous AI agents. <br className="hidden md:block"/> Budget, control, audit.
          </p>

          <HeroInput />
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="py-24 px-6 md:px-12 relative z-10 border-t border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display-sans mb-4 text-[var(--ink-on-light)] text-balance">Granular Control. Total Visibility.</h2>
            <p className="text-lg text-[var(--ink-muted-light)] max-w-2xl mx-auto text-balance">Empower your agents to transact autonomously without sacrificing security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-[var(--radius-card)] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--glass-bg)] flex items-center justify-center mb-6 text-2xl">🛡️</div>
              <h3 className="text-xl font-display-sans font-semibold mb-3 text-[var(--ink-on-light)]">Vendor Allowlisting</h3>
              <p className="text-[var(--ink-muted-light)] leading-relaxed">Restrict agent spending exclusively to pre-approved smart contracts and protocols. Prevent rogue transactions before they happen.</p>
            </div>
            <div className="glass-panel p-8 rounded-[var(--radius-card)] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--glass-bg)] flex items-center justify-center mb-6 text-2xl">⏱️</div>
              <h3 className="text-xl font-display-sans font-semibold mb-3 text-[var(--ink-on-light)]">Dynamic Budgets</h3>
              <p className="text-[var(--ink-muted-light)] leading-relaxed">Set daily, weekly, or monthly spend limits per agent. Automatically pause execution when thresholds are reached.</p>
            </div>
            <div className="glass-panel p-8 rounded-[var(--radius-card)] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--glass-bg)] flex items-center justify-center mb-6 text-2xl">📊</div>
              <h3 className="text-xl font-display-sans font-semibold mb-3 text-[var(--ink-on-light)]">Immutable Audit Trail</h3>
              <p className="text-[var(--ink-muted-light)] leading-relaxed">Every approved and rejected transaction is logged on-chain. Track your agent's financial history with cryptographic certainty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WORKFLOW */}
      <section className="py-24 px-6 md:px-12 relative z-10 bg-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-display-serif mb-6 text-[var(--ink-on-light)] text-balance">How it works</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--ink-on-light)]">Register your Agent</h4>
                    <p className="text-[var(--ink-muted-light)]">Deploy your agent and assign it a unique on-chain identity.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--ink-on-light)]">Define the Policy</h4>
                    <p className="text-[var(--ink-muted-light)]">Set budget limits and allowlist authorized vendors via the dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--ink-on-light)]">Autonomous Execution</h4>
                    <p className="text-[var(--ink-muted-light)]">The agent transacts freely within its boundaries. Real-time reporting feeds back to your CFO dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-glass)]">
                 <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mb-4">
                   <div className="font-mono text-sm text-[var(--ink-on-light)]">Policy Check</div>
                   <div className="flex gap-2">
                     <span className="w-3 h-3 rounded-full bg-[var(--accent-red)]"></span>
                     <span className="w-3 h-3 rounded-full bg-[var(--accent-amber)]"></span>
                     <span className="w-3 h-3 rounded-full bg-[var(--accent-green)]"></span>
                   </div>
                 </div>
                 <div className="font-mono text-xs text-[var(--ink-muted-light)] space-y-2">
                   <p><span className="text-[var(--accent-blue)]">function</span> <span className="text-yellow-600">checkSpend</span>(agentId, vendor, amount) {'{'}</p>
                   <p className="pl-4">require(vendors[vendor].isAllowed, "Vendor not authorized");</p>
                   <p className="pl-4">require(spend[agentId] + amount &lt;= limit[agentId], "Budget exceeded");</p>
                   <p className="pl-4">return true;</p>
                   <p>{'}'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-[var(--ink-muted-light)] border-t border-[var(--glass-border)] relative z-10">
        <p>&copy; {new Date().getFullYear()} Monadsplit. Built on Monad.</p>
      </footer>
    </main>
  );
}
