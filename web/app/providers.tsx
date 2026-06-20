'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 
        TODO: ParaProvider will go here once the user runs the CLI setup.
        For now, we just wrap with React Query which is a prerequisite.
      */}
      {children}
    </QueryClientProvider>
  );
}
