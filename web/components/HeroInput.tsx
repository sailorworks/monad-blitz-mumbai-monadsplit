'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroInput() {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/configure?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push('/configure');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-12 mb-8 flex flex-col items-center">
      <div 
        className={`w-full relative rounded-[var(--radius-pill)] glass-panel transition-all duration-300 ${
          isFocused ? 'shadow-[0_0_0_4px_rgba(255,255,255,0.1)]' : ''
        }`}
      >
        <input
          type="text"
          name="prompt"
          autoComplete="off"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your agent's task…"
          className="w-full bg-transparent border-none outline-none py-5 px-8 text-lg placeholder-[var(--ink-muted)] text-[var(--ink-on-light)] font-display-sans"
        />
        <button 
          type="submit"
          aria-label="Submit prompt"
          className="absolute right-3 top-3 bottom-3 w-10 flex items-center justify-center rounded-full bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ink-on-light)] outline-none"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      
      <button 
        type="submit"
        className="mt-8 bg-[var(--ink-on-light)] text-[var(--ink-on-dark)] px-8 py-4 rounded-[var(--radius-pill)] font-medium text-lg hover:scale-[1.02] hover:shadow-[var(--shadow-md)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ink-on-light)] outline-none"
      >
        Get Started &rarr;
      </button>
    </form>
  );
}
