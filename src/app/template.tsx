'use client';
import { SessionProvider } from '@/context/SessionContext';

export default function Template({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
