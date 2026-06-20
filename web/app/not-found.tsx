import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="theme-dashboard flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-4xl font-display-sans mb-4">404</h2>
      <p className="font-display-serif text-2xl text-[var(--ink-muted)] mb-8">
        Page Not Found
      </p>
      <Link 
        href="/"
        className="glass-panel px-6 py-3 rounded-[var(--radius-pill)] hover:bg-[var(--glass-bg)] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
