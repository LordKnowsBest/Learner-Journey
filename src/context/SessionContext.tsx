"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SessionState } from '@/lib/types';

const initialState: SessionState = {
  diagnosticScore: null,
  postTestScore: null,
  completedNodes: [],
};

interface SessionContextType {
  session: SessionState;
  submitDiagnostic: (score: number) => void;
  completeNode: (nodeId: string) => void;
  submitPostTest: (score: number) => void;
  startNewSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(initialState);
  const router = useRouter();

  const submitDiagnostic = (score: number) => {
    setSession(prev => ({ ...prev, diagnosticScore: score }));
    router.push('/graph');
  };
  
  const completeNode = (nodeId: string) => {
    setSession(prev => ({
      ...prev,
      completedNodes: [...prev.completedNodes, nodeId],
    }));
    // For MVP, go to post-test after one node
    router.push('/post-test');
  };

  const submitPostTest = (score: number) => {
    setSession(prev => ({ ...prev, postTestScore: score }));
    router.push('/results');
  };
  
  const startNewSession = () => {
    setSession(initialState);
    router.push('/');
  };

  const value = {
    session,
    submitDiagnostic,
    completeNode,
    submitPostTest,
    startNewSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
