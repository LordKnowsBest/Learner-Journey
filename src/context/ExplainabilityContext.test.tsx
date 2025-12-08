import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  ExplainabilityProvider,
  useExplainability,
  useExplainabilityOptional,
} from './ExplainabilityContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ExplainabilityProvider>{children}</ExplainabilityProvider>
);

describe('ExplainabilityContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useExplainability hook', () => {
    it('should throw error when used outside provider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useExplainability());
      }).toThrow('useExplainability must be used within an ExplainabilityProvider');

      spy.mockRestore();
    });

    it('should return context when used within provider', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      expect(result.current).toHaveProperty('state');
      expect(result.current).toHaveProperty('toggleSidebar');
      expect(result.current).toHaveProperty('addEntry');
      expect(result.current).toHaveProperty('logTutorResponse');
    });

    it('should have correct initial state', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      expect(result.current.state.entries).toEqual([]);
      expect(result.current.state.currentPathExplanation).toBeNull();
      expect(result.current.state.isVisible).toBe(false);
      expect(result.current.state.viewerRole).toBe('student');
    });
  });

  describe('useExplainabilityOptional hook', () => {
    it('should return null when used outside provider', () => {
      const { result } = renderHook(() => useExplainabilityOptional());

      expect(result.current).toBeNull();
    });

    it('should return context when used within provider', () => {
      const { result } = renderHook(() => useExplainabilityOptional(), { wrapper });

      expect(result.current).not.toBeNull();
      expect(result.current?.state).toBeDefined();
    });
  });

  describe('Sidebar visibility', () => {
    it('should toggle sidebar visibility', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      expect(result.current.state.isVisible).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.state.isVisible).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.state.isVisible).toBe(false);
    });

    it('should set sidebar visibility directly', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.setSidebarVisible(true);
      });

      expect(result.current.state.isVisible).toBe(true);

      act(() => {
        result.current.setSidebarVisible(false);
      });

      expect(result.current.state.isVisible).toBe(false);
    });
  });

  describe('Adding entries', () => {
    it('should add entry with generated id and timestamp', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'Test Entry',
          explanation: 'Test explanation',
          reasoning: 'Test reasoning',
          factors: [],
        });
      });

      expect(result.current.state.entries.length).toBe(1);
      expect(result.current.state.entries[0].id).toMatch(/^exp_/);
      expect(result.current.state.entries[0].timestamp).toBeInstanceOf(Date);
      expect(result.current.state.entries[0].title).toBe('Test Entry');
    });

    it('should add entries in reverse chronological order', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'First Entry',
          explanation: '',
          reasoning: '',
          factors: [],
        });
      });

      act(() => {
        result.current.addEntry({
          eventType: 'concept_revealed',
          title: 'Second Entry',
          explanation: '',
          reasoning: '',
          factors: [],
        });
      });

      expect(result.current.state.entries[0].title).toBe('Second Entry');
      expect(result.current.state.entries[1].title).toBe('First Entry');
    });

    it('should limit entries to 100', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        for (let i = 0; i < 110; i++) {
          result.current.addEntry({
            eventType: 'tutor_response',
            title: `Entry ${i}`,
            explanation: '',
            reasoning: '',
            factors: [],
          });
        }
      });

      expect(result.current.state.entries.length).toBe(100);
    });
  });

  describe('logTutorResponse', () => {
    it('should log tutor response with correct format', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.logTutorResponse({
          mode: 'socratic',
          reasoning: 'Using Socratic questioning to encourage discovery',
          pedagogicalIntent: 'Encourage independent thinking',
          factors: [
            { factor: 'Stuck Count', value: '0', impact: 'neutral' },
          ],
          relatedConcepts: ['privacy'],
          confidence: 'high',
        });
      });

      const entry = result.current.state.entries[0];
      expect(entry.eventType).toBe('tutor_response');
      expect(entry.title).toBe('AI Used Guided Questioning Mode');
      expect(entry.reasoning).toBe('Using Socratic questioning to encourage discovery');
      expect(entry.factors[0].factor).toBe('Stuck Count');
      expect(entry.relatedConcepts).toContain('privacy');
      expect(entry.aiDecision?.mode).toBe('socratic');
      expect(entry.aiDecision?.confidence).toBe(0.9); // high = 0.9
    });

    it('should handle all tutor modes', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      const modes: Array<'socratic' | 'hint' | 'explain' | 'challenge'> = [
        'socratic',
        'hint',
        'explain',
        'challenge',
      ];

      const modeLabels = [
        'Guided Questioning',
        'Gentle Hint',
        'Direct Explanation',
        'Challenge Question',
      ];

      modes.forEach((mode, index) => {
        act(() => {
          result.current.logTutorResponse({
            mode,
            reasoning: 'Test',
            pedagogicalIntent: 'Test',
            factors: [],
          });
        });

        expect(result.current.state.entries[0].title).toContain(modeLabels[index]);
      });
    });
  });

  describe('logModeChange', () => {
    it('should log mode change', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.logModeChange({
          fromMode: 'socratic',
          toMode: 'hint',
          reason: 'Student needs more guidance',
          stuckCount: 2,
        });
      });

      const entry = result.current.state.entries[0];
      expect(entry.eventType).toBe('mode_change');
      expect(entry.title).toBe('Tutoring Approach Adapted');
      expect(entry.explanation).toContain('socratic');
      expect(entry.explanation).toContain('hint');
      expect(entry.studentState?.stuckCount).toBe(2);
    });
  });

  describe('logConceptRevealed', () => {
    it('should log concept revelation', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.logConceptRevealed({
          conceptId: 'privacy',
          conceptTitle: 'Privacy & Personal Data',
          phaseId: 'phase_1',
          reason: 'Student demonstrated understanding',
        });
      });

      const entry = result.current.state.entries[0];
      expect(entry.eventType).toBe('concept_revealed');
      expect(entry.title).toBe('Concept Discovered: Privacy & Personal Data');
      expect(entry.relatedConcepts).toContain('privacy');
      expect(entry.relatedPhase).toBe('phase_1');
    });
  });

  describe('logPhaseTransition', () => {
    it('should log phase transition', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.logPhaseTransition({
          fromPhase: 'Understanding',
          toPhase: 'Investigation',
          conceptsDiscovered: 3,
          reason: 'Student completed phase requirements',
        });
      });

      const entry = result.current.state.entries[0];
      expect(entry.eventType).toBe('phase_transition');
      expect(entry.title).toBe('Advanced to New Phase');
      expect(entry.explanation).toContain('Understanding');
      expect(entry.explanation).toContain('Investigation');
      expect(entry.relatedPhase).toBe('Investigation');
    });
  });

  describe('logMasteryUpdate', () => {
    it('should log mastery update', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.logMasteryUpdate({
          conceptId: 'privacy',
          conceptTitle: 'Privacy',
          oldMastery: 20,
          newMastery: 45,
          reason: 'Student demonstrated understanding in reflection',
        });
      });

      const entry = result.current.state.entries[0];
      expect(entry.eventType).toBe('mastery_update');
      expect(entry.title).toBe('Understanding Improved: Privacy');
      expect(entry.explanation).toContain('20%');
      expect(entry.explanation).toContain('45%');
      expect(entry.explanation).toContain('+25%');
      expect(entry.factors[0].value).toBe('+25%');
    });
  });

  describe('updatePathExplanation', () => {
    it('should update learning path explanation', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      const pathExplanation = {
        currentPath: {
          problemId: 'school_ai_tutor',
          phaseId: 'phase_2',
          suggestedConcepts: ['fairness'],
        },
        reasoning: 'Based on student progress',
        adaptations: [
          {
            trigger: 'High understanding',
            change: 'Increased difficulty',
            benefit: 'Maintains engagement',
          },
        ],
        studentProfile: {
          strengths: ['Critical thinking'],
          areasForGrowth: ['Application'],
          learningPace: 'moderate' as const,
          preferredMode: 'socratic' as const,
        },
      };

      act(() => {
        result.current.updatePathExplanation(pathExplanation);
      });

      expect(result.current.state.currentPathExplanation).toEqual(pathExplanation);
    });
  });

  describe('clearEntries', () => {
    it('should clear all entries', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'Entry 1',
          explanation: '',
          reasoning: '',
          factors: [],
        });
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'Entry 2',
          explanation: '',
          reasoning: '',
          factors: [],
        });
      });

      expect(result.current.state.entries.length).toBe(2);

      act(() => {
        result.current.clearEntries();
      });

      expect(result.current.state.entries.length).toBe(0);
    });
  });

  describe('setViewerRole', () => {
    it('should update viewer role', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      expect(result.current.state.viewerRole).toBe('student');

      act(() => {
        result.current.setViewerRole('parent');
      });

      expect(result.current.state.viewerRole).toBe('parent');

      act(() => {
        result.current.setViewerRole('teacher');
      });

      expect(result.current.state.viewerRole).toBe('teacher');

      act(() => {
        result.current.setViewerRole('admin');
      });

      expect(result.current.state.viewerRole).toBe('admin');
    });
  });

  describe('getEntriesByType', () => {
    it('should filter entries by type', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'Tutor 1',
          explanation: '',
          reasoning: '',
          factors: [],
        });
        result.current.addEntry({
          eventType: 'concept_revealed',
          title: 'Concept 1',
          explanation: '',
          reasoning: '',
          factors: [],
        });
        result.current.addEntry({
          eventType: 'tutor_response',
          title: 'Tutor 2',
          explanation: '',
          reasoning: '',
          factors: [],
        });
      });

      const tutorResponses = result.current.getEntriesByType('tutor_response');
      expect(tutorResponses.length).toBe(2);
      expect(tutorResponses.every(e => e.eventType === 'tutor_response')).toBe(true);

      const conceptRevealed = result.current.getEntriesByType('concept_revealed');
      expect(conceptRevealed.length).toBe(1);
    });
  });

  describe('getRecentEntries', () => {
    it('should return recent entries with default limit', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.addEntry({
            eventType: 'tutor_response',
            title: `Entry ${i}`,
            explanation: '',
            reasoning: '',
            factors: [],
          });
        }
      });

      const recentEntries = result.current.getRecentEntries();
      expect(recentEntries.length).toBe(10); // default limit
    });

    it('should return recent entries with custom limit', () => {
      const { result } = renderHook(() => useExplainability(), { wrapper });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addEntry({
            eventType: 'tutor_response',
            title: `Entry ${i}`,
            explanation: '',
            reasoning: '',
            factors: [],
          });
        }
      });

      const recentEntries = result.current.getRecentEntries(5);
      expect(recentEntries.length).toBe(5);
    });
  });

  describe('Provider props', () => {
    it('should accept defaultVisible prop', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <ExplainabilityProvider defaultVisible={true}>
          {children}
        </ExplainabilityProvider>
      );

      const { result } = renderHook(() => useExplainability(), {
        wrapper: customWrapper,
      });

      expect(result.current.state.isVisible).toBe(true);
    });

    it('should accept defaultRole prop', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <ExplainabilityProvider defaultRole="teacher">
          {children}
        </ExplainabilityProvider>
      );

      const { result } = renderHook(() => useExplainability(), {
        wrapper: customWrapper,
      });

      expect(result.current.state.viewerRole).toBe('teacher');
    });
  });
});
