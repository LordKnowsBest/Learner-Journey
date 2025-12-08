import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SessionProvider, useSession } from '@/context/SessionContext';
import { ReactNode } from 'react';
import { getProblemById, getConceptById } from '@/lib/data';

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

/**
 * Integration tests for the complete PBL session flow
 * Tests the realistic user journey through the application
 */
describe('Session Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Problem Flow', () => {
    it('should handle complete problem-solving journey', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      // Step 1: Start a problem
      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      expect(result.current.session.currentProblemId).toBe('school_ai_tutor');
      expect(mockPush).toHaveBeenCalledWith('/investigate/school_ai_tutor');

      // Verify initial state
      const initialProgress = result.current.getCurrentProblem();
      expect(initialProgress).not.toBeNull();
      expect(initialProgress?.status).toBe('investigating');
      expect(initialProgress?.phasesProgress[0].status).toBe('active');

      // Step 2: Work through phases and discover concepts
      const problem = getProblemById('school_ai_tutor');
      const firstPhase = problem?.phases[0];

      // Discover concepts in first phase
      act(() => {
        result.current.discoverConcept('privacy', firstPhase!.id, [
          'Privacy is important for students',
        ]);
      });

      expect(result.current.isConceptDiscovered('privacy')).toBe(true);
      expect(result.current.session.conceptMastery['privacy']).toBe(20);

      // Add notes and questions
      act(() => {
        result.current.addPhaseNote(firstPhase!.id, 'Students have privacy concerns');
        result.current.addPhaseQuestion(firstPhase!.id, 'Who has access to student data?');
      });

      const phaseProgress = result.current.getCurrentProblem()?.phasesProgress[0];
      expect(phaseProgress?.notesWritten).toContain('Students have privacy concerns');
      expect(phaseProgress?.questionsAsked).toContain('Who has access to student data?');

      // Complete first phase
      act(() => {
        result.current.completePhase(firstPhase!.id);
      });

      // Verify phase progression
      const updatedProgress = result.current.getCurrentProblem();
      expect(updatedProgress?.phasesProgress[0].status).toBe('completed');
      expect(updatedProgress?.phasesProgress[0].completedAt).toBeDefined();

      // Continue through remaining phases
      for (let i = 1; i < problem!.phases.length; i++) {
        const phase = problem!.phases[i];

        // Discover concepts for this phase
        phase.revealsConcepts.forEach(conceptId => {
          if (!result.current.isConceptDiscovered(conceptId)) {
            act(() => {
              result.current.discoverConcept(conceptId, phase.id);
            });
          }
        });

        // Complete the phase
        act(() => {
          result.current.completePhase(phase.id);
        });
      }

      // After all phases, status should be 'reflecting'
      const afterPhasesProgress = result.current.getCurrentProblem();
      expect(afterPhasesProgress?.status).toBe('reflecting');

      // Step 3: Submit reflections
      act(() => {
        result.current.submitReflection(
          'reflect_1',
          'I believe the school should adopt the AI with safeguards...',
          ['privacy', 'data_collection', 'fairness']
        );
      });

      // Verify mastery increased for referenced concepts
      expect(result.current.session.conceptMastery['privacy']).toBeGreaterThan(20);

      // Step 4: Complete the problem
      act(() => {
        result.current.completeProblem('My final solution proposal...');
      });

      // Verify completion
      const finalProgress = result.current.session.problemsProgress[0];
      expect(finalProgress.status).toBe('completed');
      expect(finalProgress.completedAt).toBeDefined();
      expect(finalProgress.solutionProposal).toBe('My final solution proposal...');
      expect(result.current.session.currentProblemId).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/journey-summary');
    });

    it('should track learning time throughout session', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      expect(result.current.session.totalLearningTime).toBe(0);

      // Simulate time passing
      act(() => {
        result.current.updateLearningTime(60); // 1 minute
      });

      expect(result.current.session.totalLearningTime).toBe(60);

      act(() => {
        result.current.updateLearningTime(120); // 2 more minutes
      });

      expect(result.current.session.totalLearningTime).toBe(180);
    });

    it('should maintain state when switching between problems', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      // Start first problem
      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.discoverConcept('privacy', 'phase_1_understand');
      });

      // Start second problem (different one)
      act(() => {
        result.current.startProblem('social_media_algorithm');
      });

      // Both problems should be in progress
      expect(result.current.session.problemsProgress.length).toBe(2);
      expect(result.current.session.currentProblemId).toBe('social_media_algorithm');

      // First problem's progress should be preserved
      const firstProblemProgress = result.current.session.problemsProgress.find(
        p => p.scenarioId === 'school_ai_tutor'
      );
      expect(firstProblemProgress).toBeDefined();
      expect(firstProblemProgress?.discoveredConcepts.length).toBe(1);

      // Global discovered concepts should include privacy
      expect(result.current.session.allDiscoveredConcepts).toContain('privacy');
    });

    it('should handle multiple concept discoveries across phases', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      const problem = getProblemById('school_ai_tutor');
      const conceptsToDiscover = new Set<string>();

      // Collect all concepts from all phases
      problem?.phases.forEach(phase => {
        phase.revealsConcepts.forEach(c => conceptsToDiscover.add(c));
      });

      // Discover all concepts
      conceptsToDiscover.forEach(conceptId => {
        act(() => {
          result.current.discoverConcept(conceptId, 'phase_1');
        });
      });

      // All concepts should be discovered
      expect(result.current.session.allDiscoveredConcepts.length).toBe(
        conceptsToDiscover.size
      );

      // All should have initial mastery
      conceptsToDiscover.forEach(conceptId => {
        expect(result.current.session.conceptMastery[conceptId]).toBe(20);
      });
    });

    it('should update investigation notes persistently', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.startProblem('school_ai_tutor');
      });

      act(() => {
        result.current.updateInvestigationNotes('Initial notes about privacy concerns.');
      });

      expect(result.current.getCurrentProblem()?.investigationNotes).toBe(
        'Initial notes about privacy concerns.'
      );

      act(() => {
        result.current.updateInvestigationNotes(
          'Updated: Initial notes about privacy concerns. Added thoughts on data collection.'
        );
      });

      expect(result.current.getCurrentProblem()?.investigationNotes).toContain(
        'Added thoughts on data collection'
      );
    });
  });

  describe('Legacy Flow Compatibility', () => {
    it('should support legacy diagnostic flow', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.submitDiagnostic(75);
      });

      expect(result.current.legacySession.diagnosticScore).toBe(75);
      expect(mockPush).toHaveBeenCalledWith('/problems');
    });

    it('should support legacy node completion', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.completeNode('ethics_01');
        result.current.completeNode('ethics_02');
      });

      expect(result.current.legacySession.completedNodes).toEqual([
        'ethics_01',
        'ethics_02',
      ]);
    });

    it('should support legacy post-test flow', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      act(() => {
        result.current.submitPostTest(85);
      });

      expect(result.current.legacySession.postTestScore).toBe(85);
      expect(mockPush).toHaveBeenCalledWith('/results');
    });

    it('should reset both legacy and PBL state on new session', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      // Set up both legacy and PBL state
      act(() => {
        result.current.submitDiagnostic(70);
        result.current.startProblem('school_ai_tutor');
        result.current.discoverConcept('privacy', 'phase_1');
      });

      // Verify state exists
      expect(result.current.legacySession.diagnosticScore).toBe(70);
      expect(result.current.session.allDiscoveredConcepts.length).toBe(1);

      // Reset session
      act(() => {
        result.current.startNewSession();
      });

      // Both should be reset
      expect(result.current.legacySession.diagnosticScore).toBeNull();
      expect(result.current.session.allDiscoveredConcepts).toEqual([]);
      expect(result.current.session.problemsProgress).toEqual([]);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Data Integration', () => {
    it('should work with actual problem data', () => {
      const problem = getProblemById('school_ai_tutor');

      expect(problem).toBeDefined();
      expect(problem?.phases.length).toBeGreaterThan(0);
      expect(problem?.reflectionPrompts.length).toBeGreaterThan(0);
    });

    it('should work with actual concept data', () => {
      const concept = getConceptById('privacy');

      expect(concept).toBeDefined();
      expect(concept?.title).toBe('Privacy & Personal Data');
      expect(concept?.keyInsights.length).toBeGreaterThan(0);
    });

    it('should validate problem phases reveal valid concepts', () => {
      const problem = getProblemById('school_ai_tutor');

      problem?.phases.forEach(phase => {
        phase.revealsConcepts.forEach(conceptId => {
          const concept = getConceptById(conceptId);
          expect(concept).toBeDefined();
        });
      });
    });
  });
});
