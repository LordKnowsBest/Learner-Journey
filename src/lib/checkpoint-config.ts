/**
 * Checkpoint Configuration for High-Stakes Assessments
 *
 * Checkpoints are high-stakes assessments that occur at key milestones
 * in the learning journey. They validate understanding before advancing
 * to more complex content.
 */

import { AssessmentDomain, AssessmentStakes, CheckpointConfig } from './types';

// ============================================
// CHECKPOINT DEFINITIONS
// ============================================

export const LEARNING_CHECKPOINTS: CheckpointConfig[] = [
  // Checkpoint 1: AI Fundamentals Foundation
  {
    checkpointId: 'checkpoint_ai_foundations',
    name: 'AI Foundations Checkpoint',
    description:
      'Validate your understanding of core AI concepts before exploring advanced topics.',
    triggerCondition: {
      type: 'concepts_mastered',
      threshold: 3, // After mastering 3 core concepts
    },
    targetDomains: [
      AssessmentDomain.AI_FUNDAMENTALS,
      AssessmentDomain.ML_BASICS,
    ],
    questionCount: 8,
    timeLimit: 600, // 10 minutes
    passingScore: 70,
    onPass: {
      unlockContent: ['bias_intro_001', 'algo_thinking_001'],
      awardBadge: 'ai_foundations_master',
      xpReward: 150,
    },
    onFail: {
      remedialContent: ['ai_intro_001', 'data_basics_001'],
      retryDelay: 30, // 30 minutes before retry
      maxRetries: 3,
    },
  },

  // Checkpoint 2: Ethics & Bias Understanding
  {
    checkpointId: 'checkpoint_ethics_bias',
    name: 'Ethics & Bias Checkpoint',
    description:
      'Demonstrate your understanding of how bias affects AI systems and why it matters.',
    triggerCondition: {
      type: 'problems_completed',
      threshold: 1, // After completing first problem
    },
    targetDomains: [
      AssessmentDomain.ALGORITHMIC_BIAS,
      AssessmentDomain.FAIRNESS,
      AssessmentDomain.TRANSPARENCY,
    ],
    questionCount: 10,
    timeLimit: 900, // 15 minutes
    passingScore: 75,
    onPass: {
      unlockContent: ['neural_networks_001'],
      awardBadge: 'ethics_champion',
      xpReward: 200,
    },
    onFail: {
      remedialContent: ['bias_intro_001'],
      retryDelay: 60, // 1 hour before retry
      maxRetries: 2,
    },
  },

  // Checkpoint 3: Privacy & Data Ethics
  {
    checkpointId: 'checkpoint_privacy_data',
    name: 'Privacy & Data Ethics Checkpoint',
    description:
      'Show your understanding of data privacy principles and ethical data collection.',
    triggerCondition: {
      type: 'concepts_mastered',
      threshold: 5,
    },
    targetDomains: [
      AssessmentDomain.PRIVACY,
      AssessmentDomain.DATA_COLLECTION,
      AssessmentDomain.CONSENT,
    ],
    questionCount: 8,
    timeLimit: 600,
    passingScore: 75,
    onPass: {
      awardBadge: 'privacy_protector',
      xpReward: 175,
    },
    onFail: {
      retryDelay: 45,
      maxRetries: 3,
    },
  },

  // Checkpoint 4: AI Decision Making & Oversight
  {
    checkpointId: 'checkpoint_ai_decisions',
    name: 'AI Decisions & Human Oversight Checkpoint',
    description:
      'Evaluate your grasp of when and how humans should oversee AI decision-making.',
    triggerCondition: {
      type: 'problems_completed',
      threshold: 2, // After completing 2 problems
    },
    targetDomains: [
      AssessmentDomain.AI_DECISIONS,
      AssessmentDomain.HUMAN_OVERSIGHT,
    ],
    questionCount: 10,
    timeLimit: 720, // 12 minutes
    passingScore: 80,
    onPass: {
      awardBadge: 'oversight_expert',
      xpReward: 225,
    },
    onFail: {
      retryDelay: 60,
      maxRetries: 2,
    },
  },

  // Final Checkpoint: Comprehensive Assessment
  {
    checkpointId: 'checkpoint_final',
    name: 'Comprehensive AI Ethics Assessment',
    description:
      'A comprehensive assessment covering all major AI ethics concepts you have learned.',
    triggerCondition: {
      type: 'problems_completed',
      threshold: 3, // After completing all problems
    },
    targetDomains: [
      AssessmentDomain.AI_FUNDAMENTALS,
      AssessmentDomain.ML_BASICS,
      AssessmentDomain.ALGORITHMIC_BIAS,
      AssessmentDomain.FAIRNESS,
      AssessmentDomain.PRIVACY,
      AssessmentDomain.TRANSPARENCY,
      AssessmentDomain.AI_DECISIONS,
      AssessmentDomain.HUMAN_OVERSIGHT,
    ],
    questionCount: 15,
    timeLimit: 1200, // 20 minutes
    passingScore: 80,
    onPass: {
      awardBadge: 'ai_ethics_scholar',
      xpReward: 500,
    },
    onFail: {
      retryDelay: 120, // 2 hours before retry
      maxRetries: 2,
    },
  },
];

// ============================================
// CHECKPOINT HELPERS
// ============================================

/**
 * Get all checkpoints that should be triggered based on current progress
 */
export function getTriggeredCheckpoints(
  completedCheckpoints: string[],
  masteredConceptCount: number,
  completedProblemCount: number,
  timeSpentMinutes: number
): CheckpointConfig[] {
  return LEARNING_CHECKPOINTS.filter((checkpoint) => {
    // Skip already completed checkpoints
    if (completedCheckpoints.includes(checkpoint.checkpointId)) {
      return false;
    }

    // Check trigger condition
    switch (checkpoint.triggerCondition.type) {
      case 'concepts_mastered':
        return masteredConceptCount >= checkpoint.triggerCondition.threshold;
      case 'problems_completed':
        return completedProblemCount >= checkpoint.triggerCondition.threshold;
      case 'time_spent':
        return timeSpentMinutes >= checkpoint.triggerCondition.threshold;
      case 'manual':
        return false; // Manual checkpoints are explicitly triggered
      default:
        return false;
    }
  });
}

/**
 * Get the next pending checkpoint (not yet available based on progress)
 */
export function getNextPendingCheckpoint(
  completedCheckpoints: string[],
  masteredConceptCount: number,
  completedProblemCount: number
): CheckpointConfig | null {
  const pendingCheckpoints = LEARNING_CHECKPOINTS.filter(
    (checkpoint) => !completedCheckpoints.includes(checkpoint.checkpointId)
  );

  if (pendingCheckpoints.length === 0) return null;

  // Find the first checkpoint that hasn't been triggered yet
  for (const checkpoint of pendingCheckpoints) {
    const isTriggered =
      (checkpoint.triggerCondition.type === 'concepts_mastered' &&
        masteredConceptCount >= checkpoint.triggerCondition.threshold) ||
      (checkpoint.triggerCondition.type === 'problems_completed' &&
        completedProblemCount >= checkpoint.triggerCondition.threshold);

    if (!isTriggered) {
      return checkpoint;
    }
  }

  return pendingCheckpoints[0];
}

/**
 * Calculate progress towards next checkpoint
 */
export function getCheckpointProgress(
  checkpoint: CheckpointConfig,
  masteredConceptCount: number,
  completedProblemCount: number,
  timeSpentMinutes: number
): { current: number; required: number; percentage: number } {
  let current = 0;
  const required = checkpoint.triggerCondition.threshold;

  switch (checkpoint.triggerCondition.type) {
    case 'concepts_mastered':
      current = masteredConceptCount;
      break;
    case 'problems_completed':
      current = completedProblemCount;
      break;
    case 'time_spent':
      current = timeSpentMinutes;
      break;
    default:
      current = 0;
  }

  return {
    current: Math.min(current, required),
    required,
    percentage: Math.min(Math.round((current / required) * 100), 100),
  };
}

/**
 * Get checkpoint by ID
 */
export function getCheckpointById(
  checkpointId: string
): CheckpointConfig | null {
  return (
    LEARNING_CHECKPOINTS.find((c) => c.checkpointId === checkpointId) || null
  );
}
