import { describe, it, expect } from 'vitest';
import {
  conceptResources,
  conceptLinks,
  problemScenarios,
  getConceptById,
  getProblemById,
  getRelatedConcepts,
  getConceptLinks,
  getPhaseById,
  knowledgeGraphNodes,
  assessmentQuestions,
} from './data';

describe('Data Module', () => {
  describe('conceptResources', () => {
    it('should have the expected number of concepts', () => {
      expect(conceptResources.length).toBe(9);
    });

    it('should have valid structure for each concept', () => {
      conceptResources.forEach(concept => {
        expect(concept).toHaveProperty('id');
        expect(concept).toHaveProperty('title');
        expect(concept).toHaveProperty('description');
        expect(concept).toHaveProperty('videoUrl');
        expect(concept).toHaveProperty('videoTitle');
        expect(concept).toHaveProperty('videoDuration');
        expect(concept).toHaveProperty('articleUrl');
        expect(concept).toHaveProperty('articleTitle');
        expect(concept).toHaveProperty('keyInsights');
        expect(concept).toHaveProperty('relatedConcepts');
        expect(concept).toHaveProperty('guidingQuestions');
        expect(concept).toHaveProperty('category');
      });
    });

    it('should have unique IDs for all concepts', () => {
      const ids = conceptResources.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid related concepts that exist', () => {
      const allIds = conceptResources.map(c => c.id);
      conceptResources.forEach(concept => {
        concept.relatedConcepts.forEach(relatedId => {
          expect(allIds).toContain(relatedId);
        });
      });
    });

    it('should have at least one key insight per concept', () => {
      conceptResources.forEach(concept => {
        expect(concept.keyInsights.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one guiding question per concept', () => {
      conceptResources.forEach(concept => {
        expect(concept.guidingQuestions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('conceptLinks', () => {
    it('should have valid structure for each link', () => {
      conceptLinks.forEach(link => {
        expect(link).toHaveProperty('fromConcept');
        expect(link).toHaveProperty('toConcept');
        expect(link).toHaveProperty('relationship');
        expect(link).toHaveProperty('description');
      });
    });

    it('should only have valid relationship types', () => {
      const validRelationships = [
        'builds_on',
        'contrasts_with',
        'applies_to',
        'example_of',
      ];
      conceptLinks.forEach(link => {
        expect(validRelationships).toContain(link.relationship);
      });
    });

    it('should reference existing concepts', () => {
      const allIds = conceptResources.map(c => c.id);
      conceptLinks.forEach(link => {
        expect(allIds).toContain(link.fromConcept);
        expect(allIds).toContain(link.toConcept);
      });
    });
  });

  describe('problemScenarios', () => {
    it('should have at least one problem scenario', () => {
      expect(problemScenarios.length).toBeGreaterThan(0);
    });

    it('should have valid structure for each problem', () => {
      problemScenarios.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('title');
        expect(problem).toHaveProperty('hook');
        expect(problem).toHaveProperty('scenario');
        expect(problem).toHaveProperty('stakeholders');
        expect(problem).toHaveProperty('phases');
        expect(problem).toHaveProperty('coreConcepts');
        expect(problem).toHaveProperty('reflectionPrompts');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('estimatedTime');
        expect(problem).toHaveProperty('tags');
      });
    });

    it('should have unique IDs for all problems', () => {
      const ids = problemScenarios.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid difficulty levels', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      problemScenarios.forEach(problem => {
        expect(validDifficulties).toContain(problem.difficulty);
      });
    });

    it('should have at least one phase per problem', () => {
      problemScenarios.forEach(problem => {
        expect(problem.phases.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one stakeholder per problem', () => {
      problemScenarios.forEach(problem => {
        expect(problem.stakeholders.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one reflection prompt per problem', () => {
      problemScenarios.forEach(problem => {
        expect(problem.reflectionPrompts.length).toBeGreaterThan(0);
      });
    });

    it('should reference existing concepts in coreConcepts', () => {
      const allConceptIds = conceptResources.map(c => c.id);
      problemScenarios.forEach(problem => {
        problem.coreConcepts.forEach(conceptId => {
          expect(allConceptIds).toContain(conceptId);
        });
      });
    });

    it('should have valid phase structure', () => {
      problemScenarios.forEach(problem => {
        problem.phases.forEach(phase => {
          expect(phase).toHaveProperty('id');
          expect(phase).toHaveProperty('title');
          expect(phase).toHaveProperty('description');
          expect(phase).toHaveProperty('prompt');
          expect(phase).toHaveProperty('revealsConcepts');
          expect(phase).toHaveProperty('questionsToConsider');
          expect(phase).toHaveProperty('hints');
        });
      });
    });

    it('should have unique phase IDs within each problem', () => {
      problemScenarios.forEach(problem => {
        const phaseIds = problem.phases.map(p => p.id);
        const uniquePhaseIds = new Set(phaseIds);
        expect(uniquePhaseIds.size).toBe(phaseIds.length);
      });
    });

    it('should have valid reflection prompt structure', () => {
      problemScenarios.forEach(problem => {
        problem.reflectionPrompts.forEach(prompt => {
          expect(prompt).toHaveProperty('id');
          expect(prompt).toHaveProperty('question');
          expect(prompt).toHaveProperty('rubricCriteria');
          expect(prompt).toHaveProperty('assessesConcepts');
          expect(prompt.rubricCriteria.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have rubric criteria weights summing to 100', () => {
      problemScenarios.forEach(problem => {
        problem.reflectionPrompts.forEach(prompt => {
          const totalWeight = prompt.rubricCriteria.reduce(
            (sum, c) => sum + c.weight,
            0
          );
          expect(totalWeight).toBe(100);
        });
      });
    });
  });

  describe('getConceptById', () => {
    it('should return concept for valid ID', () => {
      const concept = getConceptById('privacy');
      expect(concept).toBeDefined();
      expect(concept?.id).toBe('privacy');
      expect(concept?.title).toBe('Privacy & Personal Data');
    });

    it('should return undefined for invalid ID', () => {
      const concept = getConceptById('invalid_id');
      expect(concept).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const concept = getConceptById('');
      expect(concept).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const concept = getConceptById('PRIVACY');
      expect(concept).toBeUndefined();
    });
  });

  describe('getProblemById', () => {
    it('should return problem for valid ID', () => {
      const problem = getProblemById('school_ai_tutor');
      expect(problem).toBeDefined();
      expect(problem?.id).toBe('school_ai_tutor');
      expect(problem?.title).toBe('The AI Tutoring System');
    });

    it('should return undefined for invalid ID', () => {
      const problem = getProblemById('invalid_id');
      expect(problem).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const problem = getProblemById('');
      expect(problem).toBeUndefined();
    });
  });

  describe('getRelatedConcepts', () => {
    it('should return related concepts for valid concept ID', () => {
      const related = getRelatedConcepts('privacy');
      expect(related.length).toBeGreaterThan(0);
      expect(related.every(c => c.id !== 'privacy')).toBe(true);
    });

    it('should return empty array for invalid concept ID', () => {
      const related = getRelatedConcepts('invalid_id');
      expect(related).toEqual([]);
    });

    it('should return ConceptResource objects', () => {
      const related = getRelatedConcepts('privacy');
      related.forEach(concept => {
        expect(concept).toHaveProperty('id');
        expect(concept).toHaveProperty('title');
        expect(concept).toHaveProperty('description');
      });
    });
  });

  describe('getConceptLinks', () => {
    it('should return links for concept as source', () => {
      const links = getConceptLinks('privacy');
      expect(links.length).toBeGreaterThan(0);
      expect(links.some(l => l.fromConcept === 'privacy')).toBe(true);
    });

    it('should return links for concept as target', () => {
      const links = getConceptLinks('data_collection');
      const targetLinks = links.filter(l => l.toConcept === 'data_collection');
      expect(targetLinks.length).toBeGreaterThan(0);
    });

    it('should return empty array for concept with no links', () => {
      const links = getConceptLinks('invalid_id');
      expect(links).toEqual([]);
    });
  });

  describe('getPhaseById', () => {
    it('should return phase for valid problem and phase ID', () => {
      const phase = getPhaseById('school_ai_tutor', 'phase_1_understand');
      expect(phase).toBeDefined();
      expect(phase?.id).toBe('phase_1_understand');
      expect(phase?.title).toBe('Understanding the Problem');
    });

    it('should return undefined for invalid problem ID', () => {
      const phase = getPhaseById('invalid_problem', 'phase_1_understand');
      expect(phase).toBeUndefined();
    });

    it('should return undefined for invalid phase ID', () => {
      const phase = getPhaseById('school_ai_tutor', 'invalid_phase');
      expect(phase).toBeUndefined();
    });

    it('should return undefined when both IDs are invalid', () => {
      const phase = getPhaseById('invalid_problem', 'invalid_phase');
      expect(phase).toBeUndefined();
    });
  });

  describe('Legacy data structures', () => {
    it('should have knowledgeGraphNodes defined', () => {
      expect(knowledgeGraphNodes).toBeDefined();
      expect(Array.isArray(knowledgeGraphNodes)).toBe(true);
    });

    it('should have assessmentQuestions defined', () => {
      expect(assessmentQuestions).toBeDefined();
      expect(Array.isArray(assessmentQuestions)).toBe(true);
    });

    it('should have valid knowledgeGraphNode structure', () => {
      knowledgeGraphNodes.forEach(node => {
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('title');
        expect(node).toHaveProperty('description');
        expect(node).toHaveProperty('order');
        expect(node).toHaveProperty('quiz');
      });
    });

    it('should have valid assessmentQuestion structure', () => {
      assessmentQuestions.forEach(q => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('correctAnswer');
        expect(q).toHaveProperty('difficulty');
        expect(q).toHaveProperty('type');
      });
    });
  });
});
