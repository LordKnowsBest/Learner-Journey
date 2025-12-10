/**
 * MasteryEngine - Bayesian Mastery Tracking with Spaced Repetition
 *
 * Implements:
 * - Bayesian Knowledge Tracing (BKT) for mastery estimation
 * - SM-2 algorithm for spaced repetition scheduling
 * - Evidence aggregation with time decay
 * - Multi-source mastery accumulation
 */

import {
  AssessmentDomain,
  AssessmentStakes,
  MasteryEvidence,
  DomainMastery,
  StudentMasteryProfile,
} from '../types';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

// Bayesian Knowledge Tracing parameters
const BKT_PARAMS = {
  // Prior probability of mastery (before any evidence)
  P_L0: 0.3,
  // Probability of learning after an opportunity
  P_T: 0.1,
  // Probability of guessing correctly without mastery
  P_G: 0.25,
  // Probability of slipping (making error despite mastery)
  P_S: 0.1,
};

// Evidence weight multipliers by source
const SOURCE_WEIGHTS: Record<MasteryEvidence['source'], number> = {
  diagnostic: 1.0,
  knowledge_check: 0.8,
  phase_assessment: 1.2,
  reflection: 1.5,       // Higher weight for synthesis tasks
  problem_completion: 2.0, // Highest weight for demonstrating in context
};

// Stakes multipliers
const STAKES_WEIGHTS: Record<AssessmentStakes, number> = {
  [AssessmentStakes.LOW]: 0.7,
  [AssessmentStakes.MEDIUM]: 1.0,
  [AssessmentStakes.HIGH]: 1.5,
};

// Time decay parameters (for spaced repetition)
const DECAY_PARAMS = {
  halfLifeDays: 14,        // Mastery decays to 50% after 14 days
  minRetention: 0.4,       // Never decay below 40% of learned level
  decayStartDays: 3,       // Start decay after 3 days of no practice
};

// SM-2 Algorithm parameters
const SM2_PARAMS = {
  minEaseFactor: 1.3,
  defaultEaseFactor: 2.5,
  easeFactorIncrement: 0.1,
  easeFactorDecrement: 0.2,
  initialInterval: 1,      // Days
  secondInterval: 6,       // Days
};

// ============================================
// MASTERY ENGINE CLASS
// ============================================

export class MasteryEngine {
  /**
   * Initialize a new domain mastery record
   */
  static initializeDomainMastery(domain: AssessmentDomain): DomainMastery {
    return {
      domain,
      masteryLevel: 0,
      confidence: 0,
      evidenceCount: 0,
      correctCount: 0,
      lastAssessedAt: null,
      nextReviewAt: null,
      easeFactor: SM2_PARAMS.defaultEaseFactor,
      interval: SM2_PARAMS.initialInterval,
      masteryHistory: [],
    };
  }

  /**
   * Initialize a complete student mastery profile
   */
  static initializeProfile(studentId: string): StudentMasteryProfile {
    const domainMastery: Record<AssessmentDomain, DomainMastery> = {} as Record<AssessmentDomain, DomainMastery>;

    // Initialize all domains
    Object.values(AssessmentDomain).forEach(domain => {
      domainMastery[domain] = this.initializeDomainMastery(domain);
    });

    return {
      studentId,
      domainMastery,
      overallMastery: 0,
      totalAssessments: 0,
      totalTimeSpent: 0,
      abilityEstimate: 0,
      abilityStdError: 1.0,
      preferredPace: 'moderate',
      strongDomains: [],
      growthDomains: Object.values(AssessmentDomain),
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    };
  }

  /**
   * Update mastery based on new evidence using Bayesian Knowledge Tracing
   */
  static updateMastery(
    currentMastery: DomainMastery,
    evidence: MasteryEvidence
  ): DomainMastery {
    const now = new Date();

    // Apply time decay to current mastery before updating
    const decayedLevel = this.applyTimeDecay(
      currentMastery.masteryLevel,
      currentMastery.lastAssessedAt
    );

    // Calculate evidence weight
    const baseWeight = evidence.weight;
    const sourceWeight = SOURCE_WEIGHTS[evidence.source];
    const stakesWeight = STAKES_WEIGHTS[evidence.stakes];
    const totalWeight = baseWeight * sourceWeight * stakesWeight;

    // Bayesian update
    const priorMastery = decayedLevel / 100; // Convert to probability
    const newMastery = this.bayesianUpdate(priorMastery, evidence.isCorrect);

    // Convert back to 0-100 scale and apply weighted average
    const updatedLevel = Math.round(
      (newMastery * totalWeight + (decayedLevel / 100) * (1 - totalWeight)) * 100
    );

    // Update confidence based on evidence count
    const newEvidenceCount = currentMastery.evidenceCount + 1;
    const newConfidence = Math.min(1, 0.3 + (newEvidenceCount * 0.07)); // Max at ~10 pieces of evidence

    // Update correct count
    const newCorrectCount = currentMastery.correctCount + (evidence.isCorrect ? 1 : 0);

    // Calculate SM-2 spaced repetition parameters
    const { easeFactor, interval, nextReview } = this.calculateSM2(
      currentMastery.easeFactor,
      currentMastery.interval,
      evidence.isCorrect,
      now
    );

    // Build history entry
    const historyEntry = {
      timestamp: now,
      level: updatedLevel,
      trigger: evidence.source,
    };

    return {
      ...currentMastery,
      masteryLevel: Math.max(0, Math.min(100, updatedLevel)),
      confidence: newConfidence,
      evidenceCount: newEvidenceCount,
      correctCount: newCorrectCount,
      lastAssessedAt: now,
      nextReviewAt: nextReview,
      easeFactor,
      interval,
      masteryHistory: [...currentMastery.masteryHistory.slice(-19), historyEntry], // Keep last 20
    };
  }

  /**
   * Bayesian Knowledge Tracing update
   * P(L_n | obs) using Bayes' theorem
   */
  private static bayesianUpdate(priorMastery: number, isCorrect: boolean): number {
    const { P_T, P_G, P_S } = BKT_PARAMS;

    if (isCorrect) {
      // P(L|correct) = P(correct|L) * P(L) / P(correct)
      // P(correct) = P(correct|L)*P(L) + P(correct|~L)*P(~L)
      // P(correct|L) = 1 - P_S, P(correct|~L) = P_G
      const pCorrectGivenL = 1 - P_S;
      const pCorrectGivenNotL = P_G;
      const pCorrect = pCorrectGivenL * priorMastery + pCorrectGivenNotL * (1 - priorMastery);
      const posteriorMastery = (pCorrectGivenL * priorMastery) / pCorrect;

      // Account for learning opportunity
      return posteriorMastery + (1 - posteriorMastery) * P_T;
    } else {
      // P(L|incorrect) = P(incorrect|L) * P(L) / P(incorrect)
      const pIncorrectGivenL = P_S;
      const pIncorrectGivenNotL = 1 - P_G;
      const pIncorrect = pIncorrectGivenL * priorMastery + pIncorrectGivenNotL * (1 - priorMastery);
      const posteriorMastery = (pIncorrectGivenL * priorMastery) / pIncorrect;

      // Still account for learning (but from feedback)
      return posteriorMastery + (1 - posteriorMastery) * (P_T * 0.5);
    }
  }

  /**
   * Apply time decay to mastery level
   */
  static applyTimeDecay(masteryLevel: number, lastAssessedAt: Date | null): number {
    if (!lastAssessedAt || masteryLevel === 0) return masteryLevel;

    const now = new Date();
    const daysSinceAssessment = (now.getTime() - lastAssessedAt.getTime()) / (1000 * 60 * 60 * 24);

    // No decay if within grace period
    if (daysSinceAssessment < DECAY_PARAMS.decayStartDays) {
      return masteryLevel;
    }

    // Exponential decay after grace period
    const effectiveDays = daysSinceAssessment - DECAY_PARAMS.decayStartDays;
    const decayFactor = Math.pow(0.5, effectiveDays / DECAY_PARAMS.halfLifeDays);

    // Apply decay but maintain minimum retention
    const minLevel = masteryLevel * DECAY_PARAMS.minRetention;
    const decayedLevel = minLevel + (masteryLevel - minLevel) * decayFactor;

    return Math.round(decayedLevel);
  }

  /**
   * SM-2 Spaced Repetition Algorithm
   */
  private static calculateSM2(
    currentEaseFactor: number,
    currentInterval: number,
    isCorrect: boolean,
    now: Date
  ): { easeFactor: number; interval: number; nextReview: Date } {
    let easeFactor = currentEaseFactor;
    let interval: number;

    if (isCorrect) {
      // Increase ease factor for correct answers
      easeFactor = Math.min(
        2.5,
        easeFactor + SM2_PARAMS.easeFactorIncrement
      );

      // Calculate next interval
      if (currentInterval === 0) {
        interval = SM2_PARAMS.initialInterval;
      } else if (currentInterval === SM2_PARAMS.initialInterval) {
        interval = SM2_PARAMS.secondInterval;
      } else {
        interval = Math.round(currentInterval * easeFactor);
      }
    } else {
      // Decrease ease factor for incorrect answers
      easeFactor = Math.max(
        SM2_PARAMS.minEaseFactor,
        easeFactor - SM2_PARAMS.easeFactorDecrement
      );

      // Reset interval on incorrect
      interval = SM2_PARAMS.initialInterval;
    }

    // Calculate next review date
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + interval);

    return { easeFactor, interval, nextReview };
  }

  /**
   * Update the full student profile with new evidence
   */
  static updateProfile(
    profile: StudentMasteryProfile,
    evidence: MasteryEvidence
  ): StudentMasteryProfile {
    // Update the specific domain
    const updatedDomainMastery = this.updateMastery(
      profile.domainMastery[evidence.domain],
      evidence
    );

    // Create new domain mastery record
    const newDomainMastery = {
      ...profile.domainMastery,
      [evidence.domain]: updatedDomainMastery,
    };

    // Recalculate overall mastery (weighted average)
    const domains = Object.values(newDomainMastery);
    const totalWeight = domains.reduce((sum, d) => sum + d.confidence, 0);
    const weightedSum = domains.reduce(
      (sum, d) => sum + d.masteryLevel * d.confidence,
      0
    );
    const overallMastery = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    // Identify strong and growth domains
    const sortedDomains = domains
      .filter(d => d.confidence > 0.3) // Only consider domains with enough evidence
      .sort((a, b) => b.masteryLevel - a.masteryLevel);

    const strongDomains = sortedDomains
      .filter(d => d.masteryLevel >= 70)
      .map(d => d.domain);

    const growthDomains = sortedDomains
      .filter(d => d.masteryLevel < 50)
      .map(d => d.domain);

    // Update ability estimate (simple IRT approximation)
    const abilityEstimate = (overallMastery - 50) / 20; // Normalized to roughly -2.5 to +2.5 range
    const abilityStdError = Math.max(0.3, 1 - (profile.totalAssessments * 0.02));

    // Determine preferred pace based on response patterns
    const avgCorrectRate = domains.reduce((sum, d) =>
      sum + (d.evidenceCount > 0 ? d.correctCount / d.evidenceCount : 0), 0
    ) / domains.length;
    const preferredPace: 'quick' | 'moderate' | 'thorough' =
      avgCorrectRate > 0.8 ? 'quick' : avgCorrectRate > 0.6 ? 'moderate' : 'thorough';

    return {
      ...profile,
      domainMastery: newDomainMastery,
      overallMastery,
      totalAssessments: profile.totalAssessments + 1,
      totalTimeSpent: profile.totalTimeSpent + (evidence.responseTimeMs / 1000),
      abilityEstimate,
      abilityStdError,
      preferredPace,
      strongDomains,
      growthDomains,
      lastUpdatedAt: new Date(),
    };
  }

  /**
   * Bulk update profile from diagnostic results
   */
  static updateFromDiagnostic(
    profile: StudentMasteryProfile,
    evidenceList: MasteryEvidence[]
  ): StudentMasteryProfile {
    let updatedProfile = profile;

    for (const evidence of evidenceList) {
      updatedProfile = this.updateProfile(updatedProfile, evidence);
    }

    return updatedProfile;
  }

  /**
   * Get domains that are due for review (spaced repetition)
   */
  static getDueForReview(profile: StudentMasteryProfile): AssessmentDomain[] {
    const now = new Date();

    return Object.values(profile.domainMastery)
      .filter(dm =>
        dm.nextReviewAt &&
        dm.nextReviewAt <= now &&
        dm.evidenceCount > 0
      )
      .sort((a, b) => {
        // Prioritize lower mastery domains
        return a.masteryLevel - b.masteryLevel;
      })
      .map(dm => dm.domain);
  }

  /**
   * Get recommended starting difficulty based on profile
   */
  static getRecommendedDifficulty(profile: StudentMasteryProfile): 'beginner' | 'intermediate' | 'advanced' {
    if (profile.overallMastery < 40) return 'beginner';
    if (profile.overallMastery < 70) return 'intermediate';
    return 'advanced';
  }

  /**
   * Get priority domains for learning path
   */
  static getPriorityDomains(profile: StudentMasteryProfile, count: number = 3): AssessmentDomain[] {
    // Combine growth domains with due-for-review domains
    const dueForReview = this.getDueForReview(profile);
    const growthDomains = profile.growthDomains;

    // Prioritize: due for review > low mastery > never assessed
    const neverAssessed = Object.values(profile.domainMastery)
      .filter(dm => dm.evidenceCount === 0)
      .map(dm => dm.domain);

    const combined = [...new Set([...dueForReview, ...growthDomains, ...neverAssessed])];
    return combined.slice(0, count);
  }

  /**
   * Calculate mastery level for a concept (maps domain to concept)
   */
  static getConceptMastery(
    profile: StudentMasteryProfile,
    conceptId: string,
    conceptToDomainMap: Record<string, AssessmentDomain>
  ): number {
    const domain = conceptToDomainMap[conceptId];
    if (!domain) return 0;

    return profile.domainMastery[domain]?.masteryLevel || 0;
  }

  /**
   * Check if student has achieved mastery threshold for a domain
   */
  static hasMastery(profile: StudentMasteryProfile, domain: AssessmentDomain, threshold: number = 70): boolean {
    const dm = profile.domainMastery[domain];
    return dm.masteryLevel >= threshold && dm.confidence >= 0.5;
  }

  /**
   * Get mastery summary for display
   */
  static getMasterySummary(profile: StudentMasteryProfile): {
    overall: number;
    byDomain: { domain: AssessmentDomain; level: number; status: 'mastered' | 'learning' | 'new' }[];
    strengths: string[];
    growthAreas: string[];
    nextSteps: string[];
  } {
    const byDomain = Object.values(profile.domainMastery).map(dm => ({
      domain: dm.domain,
      level: dm.masteryLevel,
      status: dm.masteryLevel >= 70 ? 'mastered' as const :
              dm.evidenceCount > 0 ? 'learning' as const : 'new' as const,
    }));

    const strengths = profile.strongDomains.map(d =>
      d.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    );

    const growthAreas = profile.growthDomains.slice(0, 3).map(d =>
      d.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    );

    const nextSteps: string[] = [];
    const dueForReview = this.getDueForReview(profile);

    if (dueForReview.length > 0) {
      nextSteps.push(`Review: ${dueForReview[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`);
    }

    if (profile.growthDomains.length > 0 && profile.overallMastery < 80) {
      nextSteps.push(`Focus on: ${profile.growthDomains[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`);
    }

    if (profile.totalAssessments < 10) {
      nextSteps.push('Complete more assessments to refine your learning path');
    }

    return {
      overall: profile.overallMastery,
      byDomain,
      strengths,
      growthAreas,
      nextSteps,
    };
  }
}

// ============================================
// MAPPING: Concepts to Assessment Domains
// ============================================

export const conceptToDomainMap: Record<string, AssessmentDomain> = {
  // Privacy-related concepts
  'privacy': AssessmentDomain.PRIVACY,
  'data_collection': AssessmentDomain.DATA_COLLECTION,
  'consent': AssessmentDomain.CONSENT,

  // Bias & Fairness concepts
  'algorithmic_bias': AssessmentDomain.ALGORITHMIC_BIAS,
  'bias_intro_001': AssessmentDomain.ALGORITHMIC_BIAS,
  'fairness': AssessmentDomain.FAIRNESS,

  // AI Decision & Transparency concepts
  'ai_decisions': AssessmentDomain.AI_DECISIONS,
  'transparency': AssessmentDomain.TRANSPARENCY,
  'human_oversight': AssessmentDomain.HUMAN_OVERSIGHT,

  // Misinformation
  'misinformation': AssessmentDomain.MISINFORMATION,

  // AI Fundamentals
  'ai_intro_001': AssessmentDomain.AI_FUNDAMENTALS,
  'ai_core_hub': AssessmentDomain.AI_FUNDAMENTALS,

  // ML Basics
  'ml_basics_001': AssessmentDomain.ML_BASICS,
  'data_basics_001': AssessmentDomain.ML_BASICS,

  // Additional mappings
  'neural_networks_001': AssessmentDomain.ML_BASICS,
  'computer_vision_001': AssessmentDomain.AI_FUNDAMENTALS,
  'algo_thinking_001': AssessmentDomain.AI_FUNDAMENTALS,
  'careers_001': AssessmentDomain.AI_FUNDAMENTALS,
  'literacy_001': AssessmentDomain.AI_FUNDAMENTALS,
  'system_design_001': AssessmentDomain.AI_FUNDAMENTALS,
};

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const masteryEngine = MasteryEngine;
