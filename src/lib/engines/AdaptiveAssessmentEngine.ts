/**
 * AdaptiveAssessmentEngine - Computerized Adaptive Testing (CAT)
 *
 * Implements:
 * - Item Response Theory (IRT) for adaptive question selection
 * - Maximum Information criterion for item selection
 * - Dynamic stopping rules
 * - Multi-domain coverage constraints
 */

import {
  AdaptiveQuestion,
  AssessmentDomain,
  AssessmentStakes,
  AssessmentSession,
  AssessmentResponse,
  AssessmentResults,
  MasteryEvidence,
  StudentMasteryProfile,
  BloomLevel,
} from '../types';

import {
  allAssessmentQuestions,
  getQuestionById,
  domainMetadata,
} from '../assessment-questions';

import { MasteryEngine, conceptToDomainMap } from './MasteryEngine';

// ============================================
// IRT PARAMETERS & CONFIGURATION
// ============================================

// 3-Parameter Logistic IRT Model parameters
const IRT_CONFIG = {
  // Discrimination parameter bounds
  minDiscrimination: 0.5,
  maxDiscrimination: 2.0,
  // Guessing parameter (for multiple choice)
  defaultGuessing: 0.25,
  // Initial ability estimate
  initialAbility: 0,
  initialStdError: 1.0,
};

// Adaptive test configuration
const CAT_CONFIG = {
  // Minimum and maximum questions
  minQuestions: 10,               // Increased for more comprehensive assessment
  maxQuestions: 20,               // Allow more questions for thorough coverage
  // Stopping criteria
  stdErrorThreshold: 0.25,        // More stringent - require more confidence
  maxConsecutiveCorrect: 5,       // Ceiling rule - need 5 in a row to stop early
  maxConsecutiveIncorrect: 5,     // Floor rule - need 5 in a row to stop early
  // Domain coverage
  minQuestionsPerDomain: 2,       // Ensure better domain coverage
  maxQuestionsPerDomain: 4,       // Allow more questions per domain
  // Difficulty matching
  targetInfoThreshold: 0.9,       // Select items with info > this fraction of max
};

// ============================================
// ADAPTIVE ASSESSMENT ENGINE CLASS
// ============================================

export class AdaptiveAssessmentEngine {
  private questionPool: AdaptiveQuestion[];
  private usedQuestionIds: Set<string>;
  private domainCounts: Map<AssessmentDomain, number>;

  constructor(questionPool: AdaptiveQuestion[] = allAssessmentQuestions) {
    this.questionPool = questionPool;
    this.usedQuestionIds = new Set();
    this.domainCounts = new Map();

    // Initialize domain counts
    Object.values(AssessmentDomain).forEach(domain => {
      this.domainCounts.set(domain, 0);
    });
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  /**
   * Create a new assessment session
   */
  createSession(
    sessionType: AssessmentSession['sessionType'],
    targetDomains: AssessmentDomain[] = Object.values(AssessmentDomain),
    stakes: AssessmentStakes = AssessmentStakes.LOW
  ): AssessmentSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      sessionId,
      sessionType,
      stakes,
      status: 'not_started',
      startedAt: null,
      completedAt: null,
      questionSequence: [],
      responses: [],
      currentQuestionIndex: 0,
      targetDomains,
      adaptiveState: {
        currentAbilityEstimate: IRT_CONFIG.initialAbility,
        standardError: IRT_CONFIG.initialStdError,
        questionsRemaining: this.getMaxQuestions(sessionType),
        stoppingCriteriaMet: false,
      },
    };
  }

  /**
   * Get maximum questions based on session type
   */
  private getMaxQuestions(sessionType: AssessmentSession['sessionType']): number {
    switch (sessionType) {
      case 'diagnostic':
        return CAT_CONFIG.maxQuestions;
      case 'knowledge_check':
        return 3;
      case 'phase_assessment':
        return 5;
      case 'checkpoint':
        return 10;
      case 'summative':
        return CAT_CONFIG.maxQuestions;
      default:
        return CAT_CONFIG.maxQuestions;
    }
  }

  /**
   * Start an assessment session
   */
  startSession(session: AssessmentSession): AssessmentSession {
    // Reset engine state
    this.usedQuestionIds.clear();
    this.domainCounts.forEach((_, key) => this.domainCounts.set(key, 0));

    return {
      ...session,
      status: 'in_progress',
      startedAt: new Date(),
    };
  }

  // ============================================
  // ITEM SELECTION (IRT-Based)
  // ============================================

  /**
   * Select the next best question using Maximum Information criterion
   */
  selectNextQuestion(session: AssessmentSession): AdaptiveQuestion | null {
    const { currentAbilityEstimate } = session.adaptiveState;
    const { targetDomains } = session;

    // Filter available questions
    const availableQuestions = this.questionPool.filter(q => {
      // Not already used
      if (this.usedQuestionIds.has(q.id)) return false;

      // In target domains
      if (!targetDomains.includes(q.domain)) return false;

      // Respect max per domain (except for knowledge checks)
      if (session.sessionType !== 'knowledge_check') {
        const domainCount = this.domainCounts.get(q.domain) || 0;
        if (domainCount >= CAT_CONFIG.maxQuestionsPerDomain) return false;
      }

      return true;
    });

    if (availableQuestions.length === 0) return null;

    // Check if we need domain coverage
    const underrepresentedDomains = this.getUnderrepresentedDomains(
      targetDomains,
      session.responses.length
    );

    // Score each question
    const scoredQuestions = availableQuestions.map(q => ({
      question: q,
      score: this.scoreQuestion(q, currentAbilityEstimate, underrepresentedDomains),
    }));

    // Sort by score (descending)
    scoredQuestions.sort((a, b) => b.score - a.score);

    // Add some randomization among top candidates to prevent predictability
    const topCandidates = scoredQuestions.slice(0, 3);
    const selectedIndex = Math.floor(Math.random() * topCandidates.length);
    const selected = topCandidates[selectedIndex].question;

    // Mark as used
    this.usedQuestionIds.add(selected.id);
    this.domainCounts.set(
      selected.domain,
      (this.domainCounts.get(selected.domain) || 0) + 1
    );

    return selected;
  }

  /**
   * Score a question based on information and coverage
   */
  private scoreQuestion(
    question: AdaptiveQuestion,
    ability: number,
    underrepresentedDomains: AssessmentDomain[]
  ): number {
    // Calculate IRT information
    const info = this.calculateInformation(question, ability);

    // Domain coverage bonus
    const domainBonus = underrepresentedDomains.includes(question.domain) ? 0.3 : 0;

    // Bloom level progression bonus (prefer building up)
    const bloomOrder = [
      BloomLevel.REMEMBER,
      BloomLevel.UNDERSTAND,
      BloomLevel.APPLY,
      BloomLevel.ANALYZE,
      BloomLevel.EVALUATE,
      BloomLevel.CREATE,
    ];
    const bloomIndex = bloomOrder.indexOf(question.bloomLevel);
    const responseCount = this.usedQuestionIds.size;
    const expectedBloom = Math.floor(responseCount / 3); // Progress every 3 questions
    const bloomDiff = Math.abs(bloomIndex - expectedBloom);
    const bloomPenalty = bloomDiff * 0.1;

    return info + domainBonus - bloomPenalty;
  }

  /**
   * Calculate Fisher Information for a question at given ability
   * Using 3PL IRT model
   */
  private calculateInformation(question: AdaptiveQuestion, ability: number): number {
    const a = question.discrimination; // Discrimination
    const b = (question.difficulty - 50) / 20; // Convert to IRT scale (-2.5 to +2.5)
    const c = IRT_CONFIG.defaultGuessing; // Guessing

    // P(theta) = c + (1-c) / (1 + exp(-a(theta - b)))
    const expTerm = Math.exp(-a * (ability - b));
    const pStar = 1 / (1 + expTerm);
    const p = c + (1 - c) * pStar;

    // Information = a^2 * (P* - c)^2 / ((1-c)^2 * P * Q) where Q = 1 - P
    const q = 1 - p;
    const numerator = Math.pow(a, 2) * Math.pow(pStar - c, 2);
    const denominator = Math.pow(1 - c, 2) * p * q;

    return denominator > 0.001 ? numerator / denominator : 0;
  }

  /**
   * Get domains that need more coverage
   */
  private getUnderrepresentedDomains(
    targetDomains: AssessmentDomain[],
    responseCount: number
  ): AssessmentDomain[] {
    const minRequired = Math.min(
      CAT_CONFIG.minQuestionsPerDomain,
      Math.floor(responseCount / targetDomains.length) + 1
    );

    return targetDomains.filter(domain => {
      const count = this.domainCounts.get(domain) || 0;
      return count < minRequired;
    });
  }

  // ============================================
  // RESPONSE PROCESSING
  // ============================================

  /**
   * Process a response and update ability estimate
   */
  processResponse(
    session: AssessmentSession,
    questionId: string,
    selectedOptionIds: string[],
    responseTimeMs: number,
    confidenceLevel?: number
  ): { session: AssessmentSession; evidence: MasteryEvidence } {
    const question = getQuestionById(questionId);
    if (!question) throw new Error(`Question not found: ${questionId}`);

    // Determine correctness
    const correctOptionIds = question.options
      .filter(o => o.isCorrect)
      .map(o => o.id);
    const isCorrect = this.checkCorrectness(selectedOptionIds, correctOptionIds, question);

    // Create response record
    const response: AssessmentResponse = {
      questionId,
      selectedOptionIds,
      isCorrect,
      responseTimeMs,
      confidenceLevel,
      hintsUsed: 0,
      timestamp: new Date(),
    };

    // Update adaptive state
    const newAbility = this.updateAbilityEstimate(
      session.adaptiveState.currentAbilityEstimate,
      session.adaptiveState.standardError,
      question,
      isCorrect
    );

    // Check stopping criteria
    const stoppingCriteriaMet = this.checkStoppingCriteria(
      session,
      newAbility.stdError,
      response
    );

    // Create mastery evidence
    const evidence: MasteryEvidence = {
      id: `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      source: this.sessionTypeToSource(session.sessionType),
      questionId,
      domain: question.domain,
      isCorrect,
      responseTimeMs,
      confidenceLevel,
      stakes: session.stakes,
      weight: this.calculateEvidenceWeight(question, isCorrect, responseTimeMs),
    };

    // Update session
    const updatedSession: AssessmentSession = {
      ...session,
      questionSequence: [...session.questionSequence, questionId],
      responses: [...session.responses, response],
      currentQuestionIndex: session.currentQuestionIndex + 1,
      adaptiveState: {
        ...session.adaptiveState,
        currentAbilityEstimate: newAbility.ability,
        standardError: newAbility.stdError,
        questionsRemaining: session.adaptiveState.questionsRemaining - 1,
        stoppingCriteriaMet,
      },
    };

    return { session: updatedSession, evidence };
  }

  /**
   * Check if answer is correct
   */
  private checkCorrectness(
    selectedIds: string[],
    correctIds: string[],
    question: AdaptiveQuestion
  ): boolean {
    if (question.questionType === 'multiple_select') {
      // All correct options must be selected, and no incorrect ones
      return (
        selectedIds.length === correctIds.length &&
        selectedIds.every(id => correctIds.includes(id))
      );
    } else {
      // Single selection
      return selectedIds.length === 1 && correctIds.includes(selectedIds[0]);
    }
  }

  /**
   * Map session type to evidence source
   */
  private sessionTypeToSource(
    sessionType: AssessmentSession['sessionType']
  ): MasteryEvidence['source'] {
    switch (sessionType) {
      case 'diagnostic':
        return 'diagnostic';
      case 'knowledge_check':
        return 'knowledge_check';
      case 'phase_assessment':
        return 'phase_assessment';
      case 'checkpoint':
      case 'summative':
        return 'phase_assessment';
      default:
        return 'knowledge_check';
    }
  }

  /**
   * Calculate evidence weight based on question characteristics
   */
  private calculateEvidenceWeight(
    question: AdaptiveQuestion,
    isCorrect: boolean,
    responseTimeMs: number
  ): number {
    let weight = 1.0;

    // Difficulty bonus (harder questions provide more evidence)
    weight += (question.difficulty / 100) * 0.3;

    // Bloom level bonus
    const bloomWeights: Record<BloomLevel, number> = {
      [BloomLevel.REMEMBER]: 0,
      [BloomLevel.UNDERSTAND]: 0.1,
      [BloomLevel.APPLY]: 0.2,
      [BloomLevel.ANALYZE]: 0.3,
      [BloomLevel.EVALUATE]: 0.4,
      [BloomLevel.CREATE]: 0.5,
    };
    weight += bloomWeights[question.bloomLevel];

    // Response time factor (very fast might indicate guessing)
    const expectedTime = question.timeEstimateSeconds * 1000;
    if (isCorrect && responseTimeMs < expectedTime * 0.3) {
      weight *= 0.8; // Slight penalty for potentially lucky guess
    }

    return Math.min(2.0, Math.max(0.5, weight));
  }

  /**
   * Update ability estimate using Bayesian/EAP method
   */
  private updateAbilityEstimate(
    currentAbility: number,
    currentStdError: number,
    question: AdaptiveQuestion,
    isCorrect: boolean
  ): { ability: number; stdError: number } {
    const a = question.discrimination;
    const b = (question.difficulty - 50) / 20;

    // Calculate P(correct | ability)
    const expTerm = Math.exp(-a * (currentAbility - b));
    const p = 1 / (1 + expTerm);

    // Information at current ability
    const info = a * a * p * (1 - p);

    // Update ability using weighted adjustment
    const adjustment = (isCorrect ? 1 : 0) - p;
    const newAbility = currentAbility + (adjustment * 0.3) / Math.sqrt(1 + info);

    // Update standard error
    const newStdError = currentStdError * 0.9; // Decay with more responses

    return {
      ability: Math.max(-3, Math.min(3, newAbility)),
      stdError: Math.max(0.1, newStdError),
    };
  }

  /**
   * Check if stopping criteria are met
   */
  private checkStoppingCriteria(
    session: AssessmentSession,
    newStdError: number,
    latestResponse: AssessmentResponse
  ): boolean {
    const responses = [...session.responses, latestResponse];
    const questionCount = responses.length;

    // Minimum questions not met
    if (questionCount < CAT_CONFIG.minQuestions) return false;

    // Maximum questions reached
    if (questionCount >= this.getMaxQuestions(session.sessionType)) return true;

    // Standard error threshold met
    if (newStdError <= CAT_CONFIG.stdErrorThreshold) return true;

    // Ceiling/Floor rules
    const recentResponses = responses.slice(-CAT_CONFIG.maxConsecutiveCorrect);
    const allCorrect = recentResponses.every(r => r.isCorrect);
    const allIncorrect = recentResponses.every(r => !r.isCorrect);

    if (allCorrect && recentResponses.length >= CAT_CONFIG.maxConsecutiveCorrect) return true;
    if (allIncorrect && recentResponses.length >= CAT_CONFIG.maxConsecutiveIncorrect) return true;

    return false;
  }

  // ============================================
  // RESULTS CALCULATION
  // ============================================

  /**
   * Complete session and calculate results
   */
  completeSession(
    session: AssessmentSession,
    profile: StudentMasteryProfile
  ): { session: AssessmentSession; results: AssessmentResults } {
    const now = new Date();

    // Calculate domain scores
    const domainScores = this.calculateDomainScores(session);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(session, domainScores);

    // Identify strengths and growth areas
    const { strengths, growthAreas } = this.identifyStrengthsAndGrowth(domainScores);

    // Identify misconceptions
    const misconceptions = this.identifyMisconceptions(session);

    // Generate recommendations
    const recommendedPath = this.generateRecommendations(
      overallScore,
      domainScores,
      strengths,
      growthAreas,
      profile
    );

    const results: AssessmentResults = {
      sessionId: session.sessionId,
      overallScore,
      domainScores,
      strengths,
      growthAreas,
      misconceptions,
      recommendedPath,
      completedAt: now,
      totalTimeMs: session.responses.reduce((sum, r) => sum + r.responseTimeMs, 0),
      questionCount: session.responses.length,
    };

    const completedSession: AssessmentSession = {
      ...session,
      status: 'completed',
      completedAt: now,
      results,
    };

    return { session: completedSession, results };
  }

  /**
   * Calculate scores per domain
   */
  private calculateDomainScores(session: AssessmentSession): Record<AssessmentDomain, number> {
    const scores: Record<AssessmentDomain, number> = {} as Record<AssessmentDomain, number>;

    // Initialize all domains
    Object.values(AssessmentDomain).forEach(domain => {
      scores[domain] = 0;
    });

    // Group responses by domain
    const domainResponses = new Map<AssessmentDomain, AssessmentResponse[]>();

    session.responses.forEach(response => {
      const question = getQuestionById(response.questionId);
      if (!question) return;

      const existing = domainResponses.get(question.domain) || [];
      domainResponses.set(question.domain, [...existing, response]);
    });

    // Calculate scores
    domainResponses.forEach((responses, domain) => {
      const correctCount = responses.filter(r => r.isCorrect).length;
      const totalCount = responses.length;
      scores[domain] = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    });

    return scores;
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(
    session: AssessmentSession,
    domainScores: Record<AssessmentDomain, number>
  ): number {
    const correctCount = session.responses.filter(r => r.isCorrect).length;
    const totalCount = session.responses.length;

    if (totalCount === 0) return 0;

    // Base score from correct answers
    const baseScore = (correctCount / totalCount) * 100;

    // Adjust based on difficulty of questions answered correctly
    const difficultyBonus = session.responses
      .filter(r => r.isCorrect)
      .reduce((sum, r) => {
        const q = getQuestionById(r.questionId);
        return sum + (q ? (q.difficulty - 50) / 100 : 0);
      }, 0);

    return Math.round(Math.min(100, Math.max(0, baseScore + difficultyBonus)));
  }

  /**
   * Identify strengths and growth areas
   */
  private identifyStrengthsAndGrowth(
    domainScores: Record<AssessmentDomain, number>
  ): { strengths: AssessmentDomain[]; growthAreas: AssessmentDomain[] } {
    const entries = Object.entries(domainScores)
      .filter(([_, score]) => score > 0 || this.domainCounts.get(_ as AssessmentDomain)! > 0)
      .sort(([, a], [, b]) => b - a);

    const strengths = entries
      .filter(([_, score]) => score >= 70)
      .map(([domain]) => domain as AssessmentDomain);

    const growthAreas = entries
      .filter(([_, score]) => score < 60)
      .map(([domain]) => domain as AssessmentDomain);

    return { strengths, growthAreas };
  }

  /**
   * Identify misconceptions from wrong answers
   */
  private identifyMisconceptions(session: AssessmentSession): string[] {
    const misconceptions: string[] = [];

    session.responses.forEach(response => {
      if (response.isCorrect) return;

      const question = getQuestionById(response.questionId);
      if (!question) return;

      // Find selected wrong options with misconceptions
      response.selectedOptionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
        if (option?.misconception && !misconceptions.includes(option.misconception)) {
          misconceptions.push(option.misconception);
        }
      });
    });

    return misconceptions;
  }

  /**
   * Generate learning path recommendations
   */
  private generateRecommendations(
    overallScore: number,
    domainScores: Record<AssessmentDomain, number>,
    strengths: AssessmentDomain[],
    growthAreas: AssessmentDomain[],
    profile: StudentMasteryProfile
  ): AssessmentResults['recommendedPath'] {
    // Determine starting difficulty
    let startingDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (overallScore >= 70) startingDifficulty = 'advanced';
    else if (overallScore >= 50) startingDifficulty = 'intermediate';

    // Priority domains (growth areas first, then those not assessed)
    const assessedDomains = Object.entries(domainScores)
      .filter(([_, score]) => score > 0)
      .map(([domain]) => domain as AssessmentDomain);

    const unassessedDomains = Object.values(AssessmentDomain)
      .filter(d => !assessedDomains.includes(d));

    const priorityDomains = [
      ...growthAreas,
      ...unassessedDomains,
    ].slice(0, 5);

    // Suggested problems based on difficulty and domains
    const suggestedProblems: string[] = [];
    if (startingDifficulty === 'beginner') {
      suggestedProblems.push('school_ai_tutor');
    } else if (startingDifficulty === 'intermediate') {
      suggestedProblems.push('social_media_algorithm');
    } else {
      suggestedProblems.push('hiring_ai');
    }

    // Concepts to skip (already mastered)
    const skipConcepts: string[] = [];
    strengths.forEach(domain => {
      // Map domain back to concepts
      Object.entries(conceptToDomainMap).forEach(([concept, d]) => {
        if (d === domain) skipConcepts.push(concept);
      });
    });

    return {
      startingDifficulty,
      priorityDomains,
      suggestedProblems,
      skipConcepts,
    };
  }

  // ============================================
  // KNOWLEDGE CHECK MODE
  // ============================================

  /**
   * Create a focused knowledge check for a specific domain
   */
  createKnowledgeCheck(
    domain: AssessmentDomain,
    questionCount: number = 3
  ): AssessmentSession {
    const session = this.createSession(
      'knowledge_check',
      [domain],
      AssessmentStakes.LOW
    );

    return {
      ...session,
      adaptiveState: {
        ...session.adaptiveState,
        questionsRemaining: questionCount,
      },
    };
  }

  /**
   * Create a phase completion assessment
   */
  createPhaseAssessment(
    domains: AssessmentDomain[],
    questionCount: number = 5
  ): AssessmentSession {
    const session = this.createSession(
      'phase_assessment',
      domains,
      AssessmentStakes.MEDIUM
    );

    return {
      ...session,
      adaptiveState: {
        ...session.adaptiveState,
        questionsRemaining: questionCount,
      },
    };
  }

  /**
   * Create a high-stakes checkpoint assessment
   */
  createCheckpointAssessment(
    domains: AssessmentDomain[]
  ): AssessmentSession {
    return this.createSession(
      'checkpoint',
      domains,
      AssessmentStakes.HIGH
    );
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const adaptiveAssessmentEngine = new AdaptiveAssessmentEngine();
