import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ConfigureAgent from '@/components/ConfigureAgent';

export const metadata: Metadata = {
  title: 'Configure Research — Monadsplit',
  description: 'Set your budget and vendor policies before your AI agent begins research.',
  generator: 'monskills',
};

export default function ConfigurePage() {
  return (
    <main className="theme-landing min-h-screen w-full relative overflow-x-hidden">
      <Navbar />

      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-16 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto w-full">
          <div className="glass-panel px-4 py-1.5 rounded-[var(--radius-pill)] flex items-center gap-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-amber)] animate-[pulseDot_2s_infinite]"></div>
            <span className="text-sm font-medium tracking-wide">Step 2 of 2 — Configure</span>
          </div>

          <h1 className="text-5xl md:text-7xl tracking-tight mb-4 text-balance">
            <span className="font-display-sans block md:inline text-[var(--ink-on-light)]">Set your </span>
            <span className="font-display-serif block md:inline text-[var(--ink-on-light)]">Guardrails</span>
          </h1>

          <p className="text-lg md:text-xl font-light text-[var(--ink-muted-light)] max-w-xl mx-auto leading-relaxed text-balance mb-12">
            Define how much your agent can spend and which APIs it's allowed to use.
          </p>

          <ConfigureAgent />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[var(--ink-muted-light)] border-t border-[var(--glass-border)] relative z-10">
        <p>&copy; {new Date().getFullYear()} Monadsplit. Built on Monad.</p>
      </footer>
    </main>
  );
}
