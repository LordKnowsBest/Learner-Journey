'use client';
import { SessionProvider } from '@/context/SessionContext';
import { ExplainabilityProvider } from '@/context/ExplainabilityContext';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ExplainabilityProvider>
        {children}
      </ExplainabilityProvider>
    </SessionProvider>
  );
}
