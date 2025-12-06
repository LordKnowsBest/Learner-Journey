'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  ExplainabilityState,
  ExplainabilityEntry,
  ExplainabilityEventType,
  LearningPathExplanation,
  TutorMode,
} from '@/lib/types';

// Generate unique IDs for entries
const generateId = () => `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface ExplainabilityContextValue {
  state: ExplainabilityState;
  // Toggle visibility
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
  // Add entries
  addEntry: (entry: Omit<ExplainabilityEntry, 'id' | 'timestamp'>) => void;
  // Specific event helpers
  logTutorResponse: (params: {
    mode: TutorMode;
    reasoning: string;
    pedagogicalIntent: string;
    factors: ExplainabilityEntry['factors'];
    relatedConcepts?: string[];
    confidence?: 'high' | 'medium' | 'low';
  }) => void;
  logModeChange: (params: {
    fromMode: TutorMode;
    toMode: TutorMode;
    reason: string;
    stuckCount: number;
  }) => void;
  logConceptRevealed: (params: {
    conceptId: string;
    conceptTitle: string;
    phaseId: string;
    reason: string;
  }) => void;
  logPhaseTransition: (params: {
    fromPhase: string;
    toPhase: string;
    conceptsDiscovered: number;
    reason: string;
  }) => void;
  logMasteryUpdate: (params: {
    conceptId: string;
    conceptTitle: string;
    oldMastery: number;
    newMastery: number;
    reason: string;
  }) => void;
  // Learning path explanation
  updatePathExplanation: (explanation: LearningPathExplanation) => void;
  // Clear entries
  clearEntries: () => void;
  // Set viewer role
  setViewerRole: (role: ExplainabilityState['viewerRole']) => void;
  // Get entries by type
  getEntriesByType: (type: ExplainabilityEventType) => ExplainabilityEntry[];
  // Get recent entries
  getRecentEntries: (count?: number) => ExplainabilityEntry[];
}

const ExplainabilityContext = createContext<ExplainabilityContextValue | null>(null);

const initialState: ExplainabilityState = {
  entries: [],
  currentPathExplanation: null,
  isVisible: false,
  viewerRole: 'student',
};

interface ExplainabilityProviderProps {
  children: ReactNode;
  defaultVisible?: boolean;
  defaultRole?: ExplainabilityState['viewerRole'];
}

export function ExplainabilityProvider({
  children,
  defaultVisible = false,
  defaultRole = 'student',
}: ExplainabilityProviderProps) {
  const [state, setState] = useState<ExplainabilityState>({
    ...initialState,
    isVisible: defaultVisible,
    viewerRole: defaultRole,
  });

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setSidebarVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, isVisible: visible }));
  }, []);

  const addEntry = useCallback((entry: Omit<ExplainabilityEntry, 'id' | 'timestamp'>) => {
    const newEntry: ExplainabilityEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date(),
    };
    setState(prev => ({
      ...prev,
      entries: [newEntry, ...prev.entries].slice(0, 100), // Keep last 100 entries
    }));
  }, []);

  const logTutorResponse = useCallback((params: {
    mode: TutorMode;
    reasoning: string;
    pedagogicalIntent: string;
    factors: ExplainabilityEntry['factors'];
    relatedConcepts?: string[];
    confidence?: 'high' | 'medium' | 'low';
  }) => {
    const modeDescriptions: Record<TutorMode, string> = {
      socratic: 'Guided Questioning',
      hint: 'Gentle Hint',
      explain: 'Direct Explanation',
      challenge: 'Challenge Question',
    };

    addEntry({
      eventType: 'tutor_response',
      title: `AI Used ${modeDescriptions[params.mode]} Mode`,
      explanation: params.pedagogicalIntent,
      reasoning: params.reasoning,
      factors: params.factors,
      relatedConcepts: params.relatedConcepts,
      aiDecision: {
        mode: params.mode,
        confidence: params.confidence === 'high' ? 0.9 :
                    params.confidence === 'medium' ? 0.7 : 0.5,
      },
    });
  }, [addEntry]);

  const logModeChange = useCallback((params: {
    fromMode: TutorMode;
    toMode: TutorMode;
    reason: string;
    stuckCount: number;
  }) => {
    addEntry({
      eventType: 'mode_change',
      title: `Tutoring Approach Adapted`,
      explanation: `Changed from ${params.fromMode} to ${params.toMode} mode to better support the student.`,
      reasoning: params.reason,
      factors: [
        {
          factor: 'Help Requests',
          value: `${params.stuckCount} times`,
          impact: params.stuckCount > 2 ? 'negative' : 'neutral',
        },
      ],
      studentState: {
        stuckCount: params.stuckCount,
      },
      aiDecision: {
        mode: params.toMode,
        alternativesConsidered: [params.fromMode],
      },
    });
  }, [addEntry]);

  const logConceptRevealed = useCallback((params: {
    conceptId: string;
    conceptTitle: string;
    phaseId: string;
    reason: string;
  }) => {
    addEntry({
      eventType: 'concept_revealed',
      title: `Concept Discovered: ${params.conceptTitle}`,
      explanation: `The student demonstrated understanding of "${params.conceptTitle}" and this concept was added to their learning progress.`,
      reasoning: params.reason,
      factors: [
        {
          factor: 'Student Understanding',
          value: 'Demonstrated through discussion',
          impact: 'positive',
        },
      ],
      relatedConcepts: [params.conceptId],
      relatedPhase: params.phaseId,
    });
  }, [addEntry]);

  const logPhaseTransition = useCallback((params: {
    fromPhase: string;
    toPhase: string;
    conceptsDiscovered: number;
    reason: string;
  }) => {
    addEntry({
      eventType: 'phase_transition',
      title: `Advanced to New Phase`,
      explanation: `The student completed the "${params.fromPhase}" phase and is now ready for "${params.toPhase}".`,
      reasoning: params.reason,
      factors: [
        {
          factor: 'Phase Completion',
          value: params.fromPhase,
          impact: 'positive',
        },
        {
          factor: 'Concepts Discovered',
          value: `${params.conceptsDiscovered} concepts`,
          impact: params.conceptsDiscovered > 0 ? 'positive' : 'neutral',
        },
      ],
      relatedPhase: params.toPhase,
    });
  }, [addEntry]);

  const logMasteryUpdate = useCallback((params: {
    conceptId: string;
    conceptTitle: string;
    oldMastery: number;
    newMastery: number;
    reason: string;
  }) => {
    const improvement = params.newMastery - params.oldMastery;
    addEntry({
      eventType: 'mastery_update',
      title: `Understanding Improved: ${params.conceptTitle}`,
      explanation: `Student's mastery of "${params.conceptTitle}" increased from ${params.oldMastery}% to ${params.newMastery}% (+${improvement}%).`,
      reasoning: params.reason,
      factors: [
        {
          factor: 'Mastery Change',
          value: `+${improvement}%`,
          impact: 'positive',
        },
      ],
      relatedConcepts: [params.conceptId],
      studentState: {
        currentMastery: { [params.conceptId]: params.newMastery },
      },
    });
  }, [addEntry]);

  const updatePathExplanation = useCallback((explanation: LearningPathExplanation) => {
    setState(prev => ({ ...prev, currentPathExplanation: explanation }));
  }, []);

  const clearEntries = useCallback(() => {
    setState(prev => ({ ...prev, entries: [] }));
  }, []);

  const setViewerRole = useCallback((role: ExplainabilityState['viewerRole']) => {
    setState(prev => ({ ...prev, viewerRole: role }));
  }, []);

  const getEntriesByType = useCallback((type: ExplainabilityEventType) => {
    return state.entries.filter(e => e.eventType === type);
  }, [state.entries]);

  const getRecentEntries = useCallback((count: number = 10) => {
    return state.entries.slice(0, count);
  }, [state.entries]);

  const value: ExplainabilityContextValue = {
    state,
    toggleSidebar,
    setSidebarVisible,
    addEntry,
    logTutorResponse,
    logModeChange,
    logConceptRevealed,
    logPhaseTransition,
    logMasteryUpdate,
    updatePathExplanation,
    clearEntries,
    setViewerRole,
    getEntriesByType,
    getRecentEntries,
  };

  return (
    <ExplainabilityContext.Provider value={value}>
      {children}
    </ExplainabilityContext.Provider>
  );
}

export function useExplainability() {
  const context = useContext(ExplainabilityContext);
  if (!context) {
    throw new Error('useExplainability must be used within an ExplainabilityProvider');
  }
  return context;
}

// Optional hook for components that don't require explainability
export function useExplainabilityOptional() {
  return useContext(ExplainabilityContext);
}
