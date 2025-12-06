import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SessionProvider, useSession, usePBLSession } from './SessionContext';
import { ReactNode } from 'react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);

describe('SessionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSession hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSession());
      }).toThrow('useSession must be used within a SessionProvider');

      spy.mockRestore();
    });

    it('should return session context when used within provider', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      expect(result.current).toHaveProperty('session');
      expect(result.current).toHaveProperty('legacySession');
      expect(result.current).toHaveProperty('startProblem');
      expect(result.current).toHaveProperty('getCurrentProblem');
    });

    it('should have initial state values', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      expect(result.current.session.currentProblemId).toBeNull();
      expect(result.current.session.problemsProgress).toEqual([]);
      expect(result.current.session.allDiscoveredConcepts).toEqual([]);
      expect(result.current.session.conceptMastery).toEqual({});
      expect(result.current.session.totalLearningTime).toBe(0);
      expect(result.current.session.sessionStartedAt).toBeNull();
    });
  });

  describe('usePBLSession alias', () => {
    it('should be an alias for useSession', () => {
      const { result: result1 } = renderHook(() => useSession(), { wrapper });
      const { result: result2 } = renderHook(() => usePBLSession(), { wrapper });

      expect(Object.keys(result1.current)).toEqual(
        Object.keys(result2.current)
      );
    });
  });

  describe('Problem Management', () => {
    it('should start a problem and navigate', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      expect(result.current.session.currentProblemId).toBe('school_ai_tutor');
      expect(mockPush).toHaveBeenCalledWith('/investigate/school_ai_tutor');
    });

    it('should initialize problem progress with phases', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const progress = result.current.session.problemsProgress[0];
      expect(progress).toBeDefined();
      expect(progress.scenarioId).toBe('school_ai_tutor');
      expect(progress.status).toBe('investigating');
      expect(progress.phasesProgress.length).toBeGreaterThan(0);
      expect(progress.phasesProgress[0].status).toBe('active');
    });

    it('should not create duplicate progress for same problem', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      expect(result.current.session.problemsProgress.length).toBe(1);
    });

    it('should return null for getCurrentProblem when no problem started', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      expect(result.current.getCurrentProblem()).toBeNull();
    });

    it('should return current problem progress', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const currentProblem = result.current.getCurrentProblem();
      expect(currentProblem).not.toBeNull();
      expect(currentProblem?.scenarioId).toBe('school_ai_tutor');
    });

    it('should not start problem with invalid ID', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('invalid_problem_id');
      });

      expect(result.current.session.currentProblemId).toBeNull();
      expect(result.current.session.problemsProgress).toEqual([]);
    });
  });

  describe('Phase Management', () => {
    it('should start a phase', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const phaseId = 'phase_1_understand';
      act(() => {
        result.current.startPhase(phaseId);
      });

      const progress = result.current.getCurrentProblem();
      const phase = progress?.phasesProgress.find(p => p.phaseId === phaseId);
      expect(phase?.status).toBe('active');
      expect(phase?.startedAt).toBeDefined();
    });

    it('should complete a phase and unlock next', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const firstPhaseId = 'phase_1_understand';
      act(() => {
        result.current.completePhase(firstPhaseId);
      });

      const progress = result.current.getCurrentProblem();
      const firstPhase = progress?.phasesProgress.find(
        p => p.phaseId === firstPhaseId
      );
      expect(firstPhase?.status).toBe('completed');
      expect(firstPhase?.completedAt).toBeDefined();

      // Check next phase is unlocked
      if (progress && progress.phasesProgress.length > 1) {
        expect(progress.phasesProgress[1].status).toBe('active');
      }
    });

    it('should return null for getCurrentPhase when no phase active', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      expect(result.current.getCurrentPhase()).toBeNull();
    });

    it('should return current phase', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const currentPhase = result.current.getCurrentPhase();
      expect(currentPhase).not.toBeNull();
      expect(currentPhase?.status).toBe('active');
    });

    it('should add phase note', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const phaseId = 'phase_1_understand';
      act(() => {
        result.current.addPhaseNote(phaseId, 'Test note');
      });

      const progress = result.current.getCurrentProblem();
      const phase = progress?.phasesProgress.find(p => p.phaseId === phaseId);
      expect(phase?.notesWritten).toContain('Test note');
    });

    it('should add phase question', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const phaseId = 'phase_1_understand';
      act(() => {
        result.current.addPhaseQuestion(phaseId, 'Test question?');
      });

      const progress = result.current.getCurrentProblem();
      const phase = progress?.phasesProgress.find(p => p.phaseId === phaseId);
      expect(phase?.questionsAsked).toContain('Test question?');
    });
  });

  describe('Concept Discovery', () => {
    it('should discover a concept', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand', [
          'Insight 1',
        ]);
      });

      expect(result.current.session.allDiscoveredConcepts).toContain('privacy');
      expect(result.current.session.conceptMastery['privacy']).toBe(20);
    });

    it('should not duplicate discovered concepts', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      const privacyCount = result.current.session.allDiscoveredConcepts.filter(
        c => c === 'privacy'
      ).length;
      expect(privacyCount).toBe(1);
    });

    it('should check if concept is discovered', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      expect(result.current.isConceptDiscovered('privacy')).toBe(false);

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      expect(result.current.isConceptDiscovered('privacy')).toBe(true);
    });

    it('should update concept mastery', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      act(() => {
        result.current.updateConceptMastery('privacy', 50);
      });

      expect(result.current.session.conceptMastery['privacy']).toBe(50);
    });

    it('should clamp mastery between 0 and 100', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.updateConceptMastery('test', 150);
      });
      expect(result.current.session.conceptMastery['test']).toBe(100);

      act(() => {
        result.current.updateConceptMastery('test', -50);
      });
      expect(result.current.session.conceptMastery['test']).toBe(0);
    });
  });

  describe('Investigation Notes', () => {
    it('should update investigation notes', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.updateInvestigationNotes('My investigation notes');
      });

      const progress = result.current.getCurrentProblem();
      expect(progress?.investigationNotes).toBe('My investigation notes');
    });
  });

  describe('Reflection & Completion', () => {
    it('should submit reflection', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      act(() => {
        result.current.submitReflection('reflect_1', 'My reflection response', [
          'privacy',
        ]);
      });

      const progress = result.current.getCurrentProblem();
      expect(progress?.reflectionResponses.length).toBe(1);
      expect(progress?.reflectionResponses[0].response).toBe(
        'My reflection response'
      );
    });

    it('should increase mastery for referenced concepts in reflection', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      const initialMastery = result.current.session.conceptMastery['privacy'];

      act(() => {
        result.current.submitReflection('reflect_1', 'Response', ['privacy']);
      });

      expect(result.current.session.conceptMastery['privacy']).toBe(
        initialMastery + 15
      );
    });

    it('should complete problem and navigate to summary', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.completeProblem('My solution proposal');
      });

      const progress = result.current.session.problemsProgress[0];
      expect(progress.status).toBe('completed');
      expect(progress.completedAt).toBeDefined();
      expect(progress.solutionProposal).toBe('My solution proposal');
      expect(result.current.session.currentProblemId).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/journey-summary');
    });
  });

  describe('Session Management', () => {
    it('should start new session and reset state', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      act(() => {
        result.current.startNewSession();
      });

      expect(result.current.session.currentProblemId).toBeNull();
      expect(result.current.session.problemsProgress).toEqual([]);
      expect(result.current.session.allDiscoveredConcepts).toEqual([]);
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should update learning time', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.updateLearningTime(60);
      });

      expect(result.current.session.totalLearningTime).toBe(60);

      act(() => {
        result.current.updateLearningTime(30);
      });

      expect(result.current.session.totalLearningTime).toBe(90);
    });
  });

  describe('Legacy Support', () => {
    it('should submit diagnostic score', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.submitDiagnostic(85);
      });

      expect(result.current.legacySession.diagnosticScore).toBe(85);
      expect(mockPush).toHaveBeenCalledWith('/problems');
    });

    it('should complete node', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.completeNode('ethics_01');
      });

      expect(result.current.legacySession.completedNodes).toContain('ethics_01');
    });

    it('should submit post test score', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.submitPostTest(90);
      });

      expect(result.current.legacySession.postTestScore).toBe(90);
      expect(mockPush).toHaveBeenCalledWith('/results');
    });
  });
});
