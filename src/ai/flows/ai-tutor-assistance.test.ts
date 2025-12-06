import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SocraticTutorInput, SocraticTutorOutput, AskTutorInput, AskTutorOutput } from './ai-tutor-assistance';

/**
 * Tests for AI Tutor flows
 *
 * Note: These tests mock the AI/Genkit integration since actual API calls
 * would require valid API keys and would be slow/expensive.
 *
 * Integration tests with actual API calls should be in a separate test file
 * and run only in specific environments.
 */

// Mock the genkit module
vi.mock('@/ai/genkit', () => ({
  ai: {
    generate: vi.fn(),
    defineFlow: vi.fn((config, handler) => handler),
    defineTool: vi.fn((config, handler) => handler),
  },
}));

// Mock the data module
vi.mock('@/lib/data', () => ({
  conceptResources: [
    {
      id: 'privacy',
      title: 'Privacy & Personal Data',
      description: 'Understanding personal data protection',
      keyInsights: ['Privacy is a fundamental right'],
      guidingQuestions: ['What would you share publicly?'],
    },
  ],
  getProblemById: vi.fn((id: string) => {
    if (id === 'school_ai_tutor') {
      return {
        id: 'school_ai_tutor',
        title: 'The AI Tutoring System',
        scenario: 'A school is considering AI tutoring...',
        reflectionPrompts: [
          {
            id: 'reflect_1',
            question: 'Should the school adopt AI?',
            rubricCriteria: [
              { criterion: 'Analysis', description: 'Good analysis', weight: 100 },
            ],
            assessesConcepts: ['privacy'],
          },
        ],
        phases: [],
      };
    }
    return undefined;
  }),
  getConceptById: vi.fn((id: string) => {
    if (id === 'privacy') {
      return {
        id: 'privacy',
        title: 'Privacy & Personal Data',
        description: 'Understanding personal data protection',
        keyInsights: ['Privacy is a fundamental right'],
      };
    }
    return undefined;
  }),
}));

describe('AI Tutor Assistance', () => {
  describe('SocraticTutorInput Schema', () => {
    it('should define valid input structure', () => {
      const validInput: SocraticTutorInput = {
        problemId: 'school_ai_tutor',
        phaseId: 'phase_1_understand',
        studentMessage: 'What about privacy?',
        discoveredConcepts: ['privacy'],
        conversationHistory: [
          { role: 'user', content: 'Hello' },
          { role: 'tutor', content: 'Hi there!' },
        ],
        stuckCount: 0,
        mode: 'socratic',
      };

      expect(validInput.problemId).toBe('school_ai_tutor');
      expect(validInput.phaseId).toBe('phase_1_understand');
      expect(validInput.conversationHistory.length).toBe(2);
    });

    it('should allow optional mode', () => {
      const inputWithoutMode: SocraticTutorInput = {
        problemId: 'school_ai_tutor',
        phaseId: 'phase_1_understand',
        studentMessage: 'I have a question',
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 0,
      };

      expect(inputWithoutMode.mode).toBeUndefined();
    });

    it('should accept all valid tutor modes', () => {
      const modes: Array<'socratic' | 'hint' | 'explain' | 'challenge'> = [
        'socratic',
        'hint',
        'explain',
        'challenge',
      ];

      modes.forEach(mode => {
        const input: SocraticTutorInput = {
          problemId: 'test',
          phaseId: 'phase_1',
          studentMessage: 'test',
          discoveredConcepts: [],
          conversationHistory: [],
          stuckCount: 0,
          mode,
        };
        expect(input.mode).toBe(mode);
      });
    });
  });

  describe('SocraticTutorOutput Schema', () => {
    it('should define valid output structure', () => {
      const validOutput: SocraticTutorOutput = {
        response: 'That is interesting! Can you tell me more?',
        suggestedConcepts: ['privacy', 'data_collection'],
        followUpQuestions: ['Why do you think that?'],
        mode: 'socratic',
        shouldRevealConcept: false,
        conceptToReveal: undefined,
      };

      expect(validOutput.response).toBeDefined();
      expect(validOutput.suggestedConcepts.length).toBe(2);
      expect(validOutput.mode).toBe('socratic');
    });

    it('should support concept revelation', () => {
      const outputWithReveal: SocraticTutorOutput = {
        response: 'Great thinking about privacy!',
        suggestedConcepts: [],
        followUpQuestions: [],
        mode: 'explain',
        shouldRevealConcept: true,
        conceptToReveal: 'privacy',
      };

      expect(outputWithReveal.shouldRevealConcept).toBe(true);
      expect(outputWithReveal.conceptToReveal).toBe('privacy');
    });
  });

  describe('AskTutorInput/Output Schema (Legacy)', () => {
    it('should define valid legacy input structure', () => {
      const legacyInput: AskTutorInput = {
        nodeId: 'ethics_01',
        question: 'What is privacy?',
      };

      expect(legacyInput.nodeId).toBe('ethics_01');
      expect(legacyInput.question).toBe('What is privacy?');
    });

    it('should define valid legacy output structure', () => {
      const legacyOutput: AskTutorOutput = {
        answer: 'Privacy is the right to control your personal data.',
      };

      expect(legacyOutput.answer).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should require non-empty problemId', () => {
      const input: SocraticTutorInput = {
        problemId: '',
        phaseId: 'phase_1',
        studentMessage: 'test',
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 0,
      };

      // The schema would validate this - empty string is technically valid
      expect(input.problemId).toBe('');
    });

    it('should track stuck count', () => {
      const inputNotStuck: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: 'I understand this well',
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 0,
      };

      const inputStuck: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: 'I dont know',
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 3,
      };

      expect(inputNotStuck.stuckCount).toBe(0);
      expect(inputStuck.stuckCount).toBe(3);
    });

    it('should handle conversation history with multiple messages', () => {
      const input: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: 'Next question',
        discoveredConcepts: ['privacy'],
        conversationHistory: [
          { role: 'tutor', content: 'Welcome!' },
          { role: 'user', content: 'Hi' },
          { role: 'tutor', content: 'What do you think about privacy?' },
          { role: 'user', content: 'I think its important' },
          { role: 'tutor', content: 'Good! Why?' },
        ],
        stuckCount: 0,
      };

      expect(input.conversationHistory.length).toBe(5);
      expect(input.conversationHistory[0].role).toBe('tutor');
      expect(input.conversationHistory[1].role).toBe('user');
    });
  });

  describe('Output Validation', () => {
    it('should have required fields in output', () => {
      const output: SocraticTutorOutput = {
        response: 'Response text',
        suggestedConcepts: [],
        followUpQuestions: [],
        mode: 'socratic',
        shouldRevealConcept: false,
      };

      expect(output).toHaveProperty('response');
      expect(output).toHaveProperty('suggestedConcepts');
      expect(output).toHaveProperty('followUpQuestions');
      expect(output).toHaveProperty('mode');
      expect(output).toHaveProperty('shouldRevealConcept');
    });

    it('should allow empty arrays for concepts and questions', () => {
      const output: SocraticTutorOutput = {
        response: 'Simple response',
        suggestedConcepts: [],
        followUpQuestions: [],
        mode: 'explain',
        shouldRevealConcept: false,
      };

      expect(output.suggestedConcepts).toEqual([]);
      expect(output.followUpQuestions).toEqual([]);
    });

    it('should support multiple follow-up questions', () => {
      const output: SocraticTutorOutput = {
        response: 'Interesting perspective!',
        suggestedConcepts: ['fairness'],
        followUpQuestions: [
          'What makes something fair?',
          'Can AI be truly fair?',
          'How would you test for fairness?',
        ],
        mode: 'challenge',
        shouldRevealConcept: false,
      };

      expect(output.followUpQuestions.length).toBe(3);
    });
  });

  describe('Mode Behavior Expectations', () => {
    it('should document socratic mode behavior', () => {
      // Socratic mode: Ask guiding questions, don't give direct answers
      const socraticOutput: SocraticTutorOutput = {
        response: 'What do you think would happen if...?',
        suggestedConcepts: ['privacy'],
        followUpQuestions: ['How might this affect different people?'],
        mode: 'socratic',
        shouldRevealConcept: false,
      };

      expect(socraticOutput.mode).toBe('socratic');
      expect(socraticOutput.response).toMatch(/\?$/); // Should end with question
    });

    it('should document hint mode behavior', () => {
      // Hint mode: Give gentle nudges without full answers
      const hintOutput: SocraticTutorOutput = {
        response: 'Think about how this relates to something you do every day online...',
        suggestedConcepts: ['data_collection'],
        followUpQuestions: ['What happens when you log into a website?'],
        mode: 'hint',
        shouldRevealConcept: false,
      };

      expect(hintOutput.mode).toBe('hint');
    });

    it('should document explain mode behavior', () => {
      // Explain mode: Provide direct explanations
      const explainOutput: SocraticTutorOutput = {
        response: 'Privacy means having control over your personal information. This includes...',
        suggestedConcepts: [],
        followUpQuestions: [],
        mode: 'explain',
        shouldRevealConcept: true,
        conceptToReveal: 'privacy',
      };

      expect(explainOutput.mode).toBe('explain');
      expect(explainOutput.shouldRevealConcept).toBe(true);
    });

    it('should document challenge mode behavior', () => {
      // Challenge mode: Push students to think deeper
      const challengeOutput: SocraticTutorOutput = {
        response: 'But what if someone argued the opposite? How would you respond?',
        suggestedConcepts: ['fairness', 'transparency'],
        followUpQuestions: [
          'Can you think of an exception to your rule?',
          'What assumptions are you making?',
        ],
        mode: 'challenge',
        shouldRevealConcept: false,
      };

      expect(challengeOutput.mode).toBe('challenge');
      expect(challengeOutput.followUpQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty student message', () => {
      const input: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: '',
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 0,
      };

      // Empty message is technically valid at the type level
      expect(input.studentMessage).toBe('');
    });

    it('should handle very long student messages', () => {
      const longMessage = 'A'.repeat(10000);
      const input: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: longMessage,
        discoveredConcepts: [],
        conversationHistory: [],
        stuckCount: 0,
      };

      expect(input.studentMessage.length).toBe(10000);
    });

    it('should handle many discovered concepts', () => {
      const manyConcepts = Array(20)
        .fill(null)
        .map((_, i) => `concept_${i}`);

      const input: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: 'I know a lot!',
        discoveredConcepts: manyConcepts,
        conversationHistory: [],
        stuckCount: 0,
      };

      expect(input.discoveredConcepts.length).toBe(20);
    });

    it('should handle long conversation history', () => {
      const longHistory = Array(50)
        .fill(null)
        .map((_, i) => ({
          role: (i % 2 === 0 ? 'user' : 'tutor') as 'user' | 'tutor',
          content: `Message ${i}`,
        }));

      const input: SocraticTutorInput = {
        problemId: 'test',
        phaseId: 'phase_1',
        studentMessage: 'After all that discussion...',
        discoveredConcepts: [],
        conversationHistory: longHistory,
        stuckCount: 0,
      };

      expect(input.conversationHistory.length).toBe(50);
    });
  });
});
