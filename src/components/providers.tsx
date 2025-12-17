'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { WebVitalsReporter } from '@/components/analytics/web-vitals-reporter';
import { ToastProvider } from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {/* Web Vitals monitoring (Chapter 18) */}
        <WebVitalsReporter debug={process.env.NODE_ENV === 'development'} />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
