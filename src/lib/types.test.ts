import { describe, it, expect } from 'vitest';
import type {
  ConceptResource,
  ConceptLink,
  ProblemScenario,
  InvestigationPhase,
  ReflectionPrompt,
  ConceptDiscovery,
  PhaseProgress,
  ReflectionResponse,
  ProblemProgress,
  PBLSessionState,
  TutorMode,
  TutorMessage,
  TutorContext,
  KnowledgeNode,
  AssessmentQuestion,
  QuizQuestion,
  Message,
  SessionState,
} from './types';

/**
 * Type-level tests to ensure type definitions are correct
 * These tests verify that our types match expected shapes
 */
describe('Type Definitions', () => {
  describe('ConceptResource', () => {
    it('should accept valid ConceptResource object', () => {
      const concept: ConceptResource = {
        id: 'test',
        title: 'Test Concept',
        description: 'A test concept',
        videoUrl: 'https://example.com/video',
        videoTitle: 'Test Video',
        videoDuration: 180,
        articleUrl: 'https://example.com/article',
        articleTitle: 'Test Article',
        keyInsights: ['Insight 1', 'Insight 2'],
        relatedConcepts: ['related1', 'related2'],
        guidingQuestions: ['Question 1?'],
        category: 'Test Category',
      };

      expect(concept.id).toBe('test');
      expect(concept.keyInsights.length).toBe(2);
    });
  });

  describe('ConceptLink', () => {
    it('should accept valid ConceptLink object', () => {
      const link: ConceptLink = {
        fromConcept: 'concept1',
        toConcept: 'concept2',
        relationship: 'builds_on',
        description: 'Concept 1 builds on Concept 2',
      };

      expect(link.relationship).toBe('builds_on');
    });

    it('should accept all relationship types', () => {
      const relationships: ConceptLink['relationship'][] = [
        'builds_on',
        'contrasts_with',
        'applies_to',
        'example_of',
      ];

      relationships.forEach(rel => {
        const link: ConceptLink = {
          fromConcept: 'a',
          toConcept: 'b',
          relationship: rel,
          description: 'test',
        };
        expect(link.relationship).toBe(rel);
      });
    });
  });

  describe('InvestigationPhase', () => {
    it('should accept valid InvestigationPhase object', () => {
      const phase: InvestigationPhase = {
        id: 'phase_1',
        title: 'Phase 1',
        description: 'First phase',
        prompt: 'What do you think?',
        revealsConcepts: ['concept1'],
        questionsToConsider: ['Question 1'],
        hints: ['Hint 1'],
      };

      expect(phase.id).toBe('phase_1');
      expect(phase.revealsConcepts.length).toBe(1);
    });
  });

  describe('ReflectionPrompt', () => {
    it('should accept valid ReflectionPrompt object', () => {
      const prompt: ReflectionPrompt = {
        id: 'reflect_1',
        question: 'What did you learn?',
        rubricCriteria: [
          {
            criterion: 'Understanding',
            description: 'Shows understanding',
            weight: 50,
          },
          {
            criterion: 'Application',
            description: 'Applies concepts',
            weight: 50,
          },
        ],
        assessesConcepts: ['concept1', 'concept2'],
      };

      expect(prompt.rubricCriteria.length).toBe(2);
      const totalWeight = prompt.rubricCriteria.reduce((sum, c) => sum + c.weight, 0);
      expect(totalWeight).toBe(100);
    });
  });

  describe('ProblemScenario', () => {
    it('should accept valid ProblemScenario object', () => {
      const problem: ProblemScenario = {
        id: 'problem_1',
        title: 'Test Problem',
        hook: 'An interesting hook',
        scenario: 'The full scenario description',
        stakeholders: [
          {
            name: 'Person A',
            role: 'Student',
            perspective: 'Concerned about privacy',
          },
        ],
        phases: [
          {
            id: 'phase_1',
            title: 'Phase 1',
            description: 'First phase',
            prompt: 'What do you think?',
            revealsConcepts: ['concept1'],
            questionsToConsider: ['Question 1'],
            hints: ['Hint 1'],
          },
        ],
        coreConcepts: ['concept1'],
        reflectionPrompts: [
          {
            id: 'reflect_1',
            question: 'What did you learn?',
            rubricCriteria: [
              {
                criterion: 'Understanding',
                description: 'Shows understanding',
                weight: 100,
              },
            ],
            assessesConcepts: ['concept1'],
          },
        ],
        difficulty: 'beginner',
        estimatedTime: 25,
        tags: ['test', 'example'],
      };

      expect(problem.difficulty).toBe('beginner');
      expect(['beginner', 'intermediate', 'advanced']).toContain(problem.difficulty);
    });
  });

  describe('PhaseProgress', () => {
    it('should accept all valid status values', () => {
      const statuses: PhaseProgress['status'][] = ['locked', 'active', 'completed'];

      statuses.forEach(status => {
        const progress: PhaseProgress = {
          phaseId: 'phase_1',
          status,
          notesWritten: [],
          questionsAsked: [],
        };
        expect(progress.status).toBe(status);
      });
    });

    it('should accept optional date fields', () => {
      const progress: PhaseProgress = {
        phaseId: 'phase_1',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        notesWritten: ['note'],
        questionsAsked: ['question?'],
      };

      expect(progress.startedAt).toBeInstanceOf(Date);
      expect(progress.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('ProblemProgress', () => {
    it('should accept all valid status values', () => {
      const statuses: ProblemProgress['status'][] = [
        'not_started',
        'investigating',
        'reflecting',
        'completed',
      ];

      statuses.forEach(status => {
        const progress: ProblemProgress = {
          scenarioId: 'problem_1',
          status,
          currentPhaseId: null,
          phasesProgress: [],
          discoveredConcepts: [],
          reflectionResponses: [],
          investigationNotes: '',
        };
        expect(progress.status).toBe(status);
      });
    });
  });

  describe('PBLSessionState', () => {
    it('should accept valid PBLSessionState object', () => {
      const state: PBLSessionState = {
        currentProblemId: null,
        problemsProgress: [],
        allDiscoveredConcepts: [],
        conceptMastery: {},
        totalLearningTime: 0,
        sessionStartedAt: null,
      };

      expect(state.totalLearningTime).toBe(0);
    });

    it('should accept state with data', () => {
      const state: PBLSessionState = {
        currentProblemId: 'problem_1',
        problemsProgress: [
          {
            scenarioId: 'problem_1',
            status: 'investigating',
            startedAt: new Date(),
            currentPhaseId: 'phase_1',
            phasesProgress: [],
            discoveredConcepts: [],
            reflectionResponses: [],
            investigationNotes: 'notes',
          },
        ],
        allDiscoveredConcepts: ['concept1'],
        conceptMastery: { concept1: 50 },
        totalLearningTime: 300,
        sessionStartedAt: new Date(),
      };

      expect(state.conceptMastery['concept1']).toBe(50);
    });
  });

  describe('TutorMode', () => {
    it('should accept all valid tutor modes', () => {
      const modes: TutorMode[] = ['socratic', 'hint', 'explain', 'challenge'];

      modes.forEach(mode => {
        expect(['socratic', 'hint', 'explain', 'challenge']).toContain(mode);
      });
    });
  });

  describe('TutorMessage', () => {
    it('should accept valid TutorMessage object', () => {
      const message: TutorMessage = {
        role: 'tutor',
        content: 'Hello, how can I help?',
        mode: 'socratic',
        timestamp: new Date(),
        relatedConcepts: ['concept1'],
      };

      expect(message.role).toBe('tutor');
      expect(['user', 'tutor']).toContain(message.role);
    });
  });

  describe('TutorContext', () => {
    it('should accept valid TutorContext object', () => {
      const context: TutorContext = {
        currentProblem: null,
        currentPhase: null,
        discoveredConcepts: [],
        conversationHistory: [],
        studentStuckCount: 0,
      };

      expect(context.studentStuckCount).toBe(0);
    });
  });

  describe('ConceptDiscovery', () => {
    it('should accept valid ConceptDiscovery object', () => {
      const discovery: ConceptDiscovery = {
        conceptId: 'concept1',
        discoveredAt: new Date(),
        discoveredInPhase: 'phase_1',
        insightsGained: ['Insight 1'],
        timeSpent: 120,
      };

      expect(discovery.timeSpent).toBe(120);
    });
  });

  describe('ReflectionResponse', () => {
    it('should accept valid ReflectionResponse object', () => {
      const response: ReflectionResponse = {
        promptId: 'reflect_1',
        response: 'My reflection',
        submittedAt: new Date(),
        conceptsReferenced: ['concept1'],
      };

      expect(response.promptId).toBe('reflect_1');
    });
  });

  describe('Legacy Types', () => {
    describe('QuizQuestion', () => {
      it('should accept valid QuizQuestion object', () => {
        const question: QuizQuestion = {
          question: 'What is privacy?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          explanation: 'A is correct because...',
        };

        expect(question.options.length).toBe(4);
      });
    });

    describe('KnowledgeNode', () => {
      it('should accept valid KnowledgeNode object', () => {
        const node: KnowledgeNode = {
          id: 'node_1',
          title: 'Node 1',
          description: 'A node',
          order: 1,
          videoUrl: 'https://example.com/video',
          videoTitle: 'Video Title',
          videoDuration: 180,
          articleUrl: 'https://example.com/article',
          articleTitle: 'Article Title',
          quiz: [],
          prerequisites: [],
          category: 'Category 1',
        };

        expect(node.order).toBe(1);
      });
    });

    describe('AssessmentQuestion', () => {
      it('should accept valid AssessmentQuestion object', () => {
        const question: AssessmentQuestion = {
          id: 'q1',
          question: 'What is AI?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          nodeId: 'node_1',
          difficulty: 'beginner',
          type: 'diagnostic',
        };

        expect(['beginner', 'intermediate']).toContain(question.difficulty);
        expect(['diagnostic', 'post-test']).toContain(question.type);
      });
    });

    describe('Message', () => {
      it('should accept valid Message object', () => {
        const message: Message = {
          role: 'user',
          text: 'Hello',
        };

        expect(['user', 'assistant']).toContain(message.role);
      });
    });

    describe('SessionState', () => {
      it('should accept valid SessionState object', () => {
        const state: SessionState = {
          diagnosticScore: 85,
          postTestScore: 90,
          completedNodes: ['node_1', 'node_2'],
        };

        expect(state.completedNodes.length).toBe(2);
      });

      it('should accept null scores', () => {
        const state: SessionState = {
          diagnosticScore: null,
          postTestScore: null,
          completedNodes: [],
        };

        expect(state.diagnosticScore).toBeNull();
        expect(state.postTestScore).toBeNull();
      });
    });
  });
});
