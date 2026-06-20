'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="theme-dashboard min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-display-sans mb-4">Something went wrong!</h2>
      <p className="text-[var(--accent-red)] mb-8 font-mono text-sm">{error.message}</p>
      <button
        onClick={() => reset()}
        className="glass-panel px-6 py-3 rounded-[var(--radius-pill)] hover:bg-[var(--glass-bg)] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
