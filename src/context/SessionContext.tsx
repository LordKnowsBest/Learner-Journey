"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PBLSessionState,
  ProblemProgress,
  PhaseProgress,
  ConceptDiscovery,
  ReflectionResponse,
  SessionState,
  LearningPath,
  KnowledgeNode,
} from '@/lib/types';
import { getProblemById } from '@/lib/data';
import { PathRouter } from '@/lib/engines/PathRouter';

// ============================================
// INITIAL STATE
// ============================================

const initialPBLState: PBLSessionState = {
  currentProblemId: null,
  problemsProgress: [],
  allDiscoveredConcepts: [],
  conceptMastery: {},
  totalLearningTime: 0,
  sessionStartedAt: null,
  // Graph-Based Path
  currentPath: null,
  nextRecommendedNode: null,
};

// Legacy state for backward compatibility
const initialLegacyState: SessionState = {
  diagnosticScore: null,
  postTestScore: null,
  completedNodes: [],
};

// ============================================
// CONTEXT TYPE
// ============================================

interface PBLSessionContextType {
  // PBL State
  session: PBLSessionState;
  legacySession: SessionState;

  // Problem Management
  startProblem: (problemId: string) => void;
  getCurrentProblem: () => ProblemProgress | null;

  // Phase Management
  startPhase: (phaseId: string) => void;
  completePhase: (phaseId: string) => void;
  getCurrentPhase: () => PhaseProgress | null;
  addPhaseNote: (phaseId: string, note: string) => void;
  addPhaseQuestion: (phaseId: string, question: string) => void;

  // Concept Discovery
  discoverConcept: (conceptId: string, phaseId: string, insights?: string[]) => void;
  isConceptDiscovered: (conceptId: string) => boolean;
  updateConceptMastery: (conceptId: string, level: number) => void;

  // Investigation Notes
  updateInvestigationNotes: (notes: string) => void;

  // Reflection & Completion
  submitReflection: (promptId: string, response: string, conceptsReferenced: string[]) => void;
  completeProblem: (solutionProposal?: string) => void;

  // Session Management
  startNewSession: () => void;
  updateLearningTime: (seconds: number) => void;

  // Legacy Support
  submitDiagnostic: (score: number) => void;
  completeNode: (nodeId: string) => void;
  submitPostTest: (score: number) => void;
}

// ============================================
// CONTEXT CREATION
// ============================================

const PBLSessionContext = createContext<PBLSessionContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PBLSessionState>(initialPBLState);
  const [legacySession, setLegacySession] = useState<SessionState>(initialLegacyState);
  const router = useRouter();

  // Initialize Routing Engine
  const pathRouter = React.useMemo(() => new PathRouter(), []);

  // Compute initial path on mount (or if empty)
  React.useEffect(() => {
    async function initPath() {
      if (!session.currentPath) {
        // For MVP, using a dummy student ID 'demo-student'
        const path = await pathRouter.computeOptimalPath('demo-student');
        const nextNode = pathRouter.getNextNode(path);
        setSession(prev => ({
          ...prev,
          currentPath: path,
          nextRecommendedNode: nextNode
        }));
      }
    }
    initPath();
  }, [session.currentPath, pathRouter]);



  // ---------- Problem Management ----------

  const startProblem = useCallback((problemId: string) => {
    const problem = getProblemById(problemId);
    if (!problem) return;

    const existingProgress = session.problemsProgress.find(p => p.scenarioId === problemId);

    if (existingProgress) {
      // Resume existing problem
      setSession(prev => ({
        ...prev,
        currentProblemId: problemId,
        sessionStartedAt: prev.sessionStartedAt || new Date(),
      }));
    } else {
      // Initialize new problem progress
      const phasesProgress: PhaseProgress[] = problem.phases.map((phase, index) => ({
        phaseId: phase.id,
        status: index === 0 ? 'active' : 'locked',
        notesWritten: [],
        questionsAsked: [],
      }));

      const newProgress: ProblemProgress = {
        scenarioId: problemId,
        status: 'investigating',
        startedAt: new Date(),
        currentPhaseId: problem.phases[0]?.id || null,
        phasesProgress,
        discoveredConcepts: [],
        reflectionResponses: [],
        investigationNotes: '',
      };

      setSession(prev => ({
        ...prev,
        currentProblemId: problemId,
        problemsProgress: [...prev.problemsProgress, newProgress],
        sessionStartedAt: prev.sessionStartedAt || new Date(),
      }));
    }

    router.push(`/investigate/${problemId}`);
  }, [session.problemsProgress, router]);

  const getCurrentProblem = useCallback((): ProblemProgress | null => {
    if (!session.currentProblemId) return null;
    return session.problemsProgress.find(p => p.scenarioId === session.currentProblemId) || null;
  }, [session.currentProblemId, session.problemsProgress]);

  // ---------- Phase Management ----------

  const startPhase = useCallback((phaseId: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const phaseIndex = problem.phasesProgress.findIndex(p => p.phaseId === phaseId);
      if (phaseIndex === -1) return prev;

      problem.phasesProgress[phaseIndex] = {
        ...problem.phasesProgress[phaseIndex],
        status: 'active',
        startedAt: new Date(),
      };
      problem.currentPhaseId = phaseId;

      return { ...prev, problemsProgress: updatedProgress };
    });
  }, []);

  const completePhase = useCallback((phaseId: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const phaseIndex = problem.phasesProgress.findIndex(p => p.phaseId === phaseId);
      if (phaseIndex === -1) return prev;

      // Complete current phase
      problem.phasesProgress[phaseIndex] = {
        ...problem.phasesProgress[phaseIndex],
        status: 'completed',
        completedAt: new Date(),
      };

      // Unlock next phase if exists
      if (phaseIndex < problem.phasesProgress.length - 1) {
        problem.phasesProgress[phaseIndex + 1].status = 'active';
        problem.currentPhaseId = problem.phasesProgress[phaseIndex + 1].phaseId;
      } else {
        // All phases complete, move to reflection
        problem.status = 'reflecting';
        problem.currentPhaseId = null;
      }

      return { ...prev, problemsProgress: updatedProgress };
    });
  }, []);

  const getCurrentPhase = useCallback((): PhaseProgress | null => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem?.currentPhaseId) return null;
    return currentProblem.phasesProgress.find(p => p.phaseId === currentProblem.currentPhaseId) || null;
  }, [getCurrentProblem]);

  const addPhaseNote = useCallback((phaseId: string, note: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const phaseIndex = problem.phasesProgress.findIndex(p => p.phaseId === phaseId);
      if (phaseIndex === -1) return prev;

      problem.phasesProgress[phaseIndex].notesWritten.push(note);

      return { ...prev, problemsProgress: updatedProgress };
    });
  }, []);

  const addPhaseQuestion = useCallback((phaseId: string, question: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const phaseIndex = problem.phasesProgress.findIndex(p => p.phaseId === phaseId);
      if (phaseIndex === -1) return prev;

      problem.phasesProgress[phaseIndex].questionsAsked.push(question);

      return { ...prev, problemsProgress: updatedProgress };
    });
  }, []);

  // ---------- Concept Discovery ----------

  const discoverConcept = useCallback((conceptId: string, phaseId: string, insights: string[] = []) => {
    setSession(prev => {
      // Check if already discovered globally
      if (prev.allDiscoveredConcepts.includes(conceptId)) {
        return prev;
      }

      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const discovery: ConceptDiscovery = {
        conceptId,
        discoveredAt: new Date(),
        discoveredInPhase: phaseId,
        insightsGained: insights,
        timeSpent: 0,
      };

      problem.discoveredConcepts.push(discovery);

      return {
        ...prev,
        problemsProgress: updatedProgress,
        allDiscoveredConcepts: [...prev.allDiscoveredConcepts, conceptId],
        conceptMastery: {
          ...prev.conceptMastery,
          [conceptId]: 20, // Initial mastery level when discovered
        },
      };
    });
  }, []);

  const isConceptDiscovered = useCallback((conceptId: string): boolean => {
    return session.allDiscoveredConcepts.includes(conceptId);
  }, [session.allDiscoveredConcepts]);

  const updateConceptMastery = useCallback((conceptId: string, level: number) => {
    setSession(prev => ({
      ...prev,
      conceptMastery: {
        ...prev.conceptMastery,
        [conceptId]: Math.min(100, Math.max(0, level)),
      },
    }));
  }, []);

  // ---------- Investigation Notes ----------

  const updateInvestigationNotes = useCallback((notes: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      updatedProgress[problemIndex].investigationNotes = notes;

      return { ...prev, problemsProgress: updatedProgress };
    });
  }, []);

  // ---------- Reflection & Completion ----------

  const submitReflection = useCallback((promptId: string, response: string, conceptsReferenced: string[]) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      const problem = updatedProgress[problemIndex];

      const reflectionResponse: ReflectionResponse = {
        promptId,
        response,
        submittedAt: new Date(),
        conceptsReferenced,
      };

      problem.reflectionResponses.push(reflectionResponse);

      // Increase mastery for referenced concepts
      const updatedMastery = { ...prev.conceptMastery };
      conceptsReferenced.forEach(conceptId => {
        if (updatedMastery[conceptId]) {
          updatedMastery[conceptId] = Math.min(100, updatedMastery[conceptId] + 15);
        }
      });

      return {
        ...prev,
        problemsProgress: updatedProgress,
        conceptMastery: updatedMastery,
      };
    });
  }, []);

  const completeProblem = useCallback((solutionProposal?: string) => {
    setSession(prev => {
      const problemIndex = prev.problemsProgress.findIndex(
        p => p.scenarioId === prev.currentProblemId
      );
      if (problemIndex === -1) return prev;

      const updatedProgress = [...prev.problemsProgress];
      updatedProgress[problemIndex] = {
        ...updatedProgress[problemIndex],
        status: 'completed',
        completedAt: new Date(),
        solutionProposal,
      };

      return {
        ...prev,
        problemsProgress: updatedProgress,
        currentProblemId: null,
      };
    });

    router.push('/journey-summary');
  }, [router]);

  // ---------- Session Management ----------

  const startNewSession = useCallback(() => {
    setSession(initialPBLState);
    setLegacySession(initialLegacyState);
    router.push('/');
  }, [router]);

  const updateLearningTime = useCallback((seconds: number) => {
    setSession(prev => ({
      ...prev,
      totalLearningTime: prev.totalLearningTime + seconds,
    }));
  }, []);

  // ---------- Legacy Support ----------

  const submitDiagnostic = useCallback((score: number) => {
    setLegacySession(prev => ({ ...prev, diagnosticScore: score }));
    router.push('/problems');
  }, [router]);

  const completeNode = useCallback((nodeId: string) => {
    setLegacySession(prev => ({
      ...prev,
      completedNodes: [...prev.completedNodes, nodeId],
    }));
  }, []);

  const submitPostTest = useCallback((score: number) => {
    setLegacySession(prev => ({ ...prev, postTestScore: score }));
    router.push('/results');
  }, [router]);

  // ---------- Context Value ----------

  const value: PBLSessionContextType = {
    session,
    legacySession,
    startProblem,
    getCurrentProblem,
    startPhase,
    completePhase,
    getCurrentPhase,
    addPhaseNote,
    addPhaseQuestion,
    discoverConcept,
    isConceptDiscovered,
    updateConceptMastery,
    updateInvestigationNotes,
    submitReflection,
    completeProblem,
    startNewSession,
    updateLearningTime,
    submitDiagnostic,
    completeNode,
    submitPostTest,
  };

  return (
    <PBLSessionContext.Provider value={value}>
      {children}
    </PBLSessionContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useSession() {
  const context = useContext(PBLSessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Alias for backward compatibility
export function usePBLSession() {
  return useSession();
}
