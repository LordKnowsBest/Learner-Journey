// ============================================
// PBL (Problem-Based Learning) Type Definitions
// ============================================

// ---------- Core Concept Types ----------

export type ConceptResource = {
  id: string;
  title: string;
  description: string;
  // Learning resources
  videoUrl: string;
  videoTitle: string;
  videoDuration: number;
  articleUrl: string;
  articleTitle: string;
  // Key insights students should discover
  keyInsights: string[];
  // Related concepts for dynamic linking
  relatedConcepts: string[];
  // Guiding questions to prompt exploration
  guidingQuestions: string[];
  category: string;
  xpValue: number;
};

// ---------- Problem Scenario Types ----------

export type InvestigationPhase = {
  id: string;
  title: string;
  description: string;
  // Prompt that guides this phase of investigation
  prompt: string;
  // Concepts that become relevant in this phase
  revealsConcepts: string[];
  // Questions to consider during this phase
  questionsToConsider: string[];
  // Hints if student is stuck
  hints: string[];
};

export type ReflectionPrompt = {
  id: string;
  question: string;
  // Rubric criteria for evaluating response
  rubricCriteria: {
    criterion: string;
    description: string;
    weight: number;
  }[];
  // Concepts this reflection should demonstrate understanding of
  assessesConcepts: string[];
};

export type ProblemScenario = {
  id: string;
  title: string;
  // Brief hook to capture interest
  hook: string;
  // Full scenario description (the ill-structured problem)
  scenario: string;
  // Stakeholders involved in the problem
  stakeholders: {
    name: string;
    role: string;
    perspective: string;
  }[];
  // Investigation phases guide the learning journey
  phases: InvestigationPhase[];
  // Core concepts this problem explores
  coreConcepts: string[];
  // Final reflection prompts for solution proposal
  reflectionPrompts: ReflectionPrompt[];
  // Difficulty level
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // Estimated time in minutes
  estimatedTime: number;
  // Tags for categorization
  tags: string[];
};

// ---------- Graph Architecture Types ----------

export enum NodeCategory {
  AI_FUNDAMENTALS = "ai_fundamentals",
  MACHINE_LEARNING_DATA = "machine_learning_data",
  ETHICS_BIAS_SOCIETY = "ethics_bias_society",
  AI_CAREERS_INDUSTRY = "ai_careers_industry",
  AI_LITERACY_SKILLS = "ai_literacy_skills",
  AI_SYSTEM_DESIGN = "ai_system_design"
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  CHALLENGE = "challenge"
}

export type KnowledgeNode = {
  nodeId: string;
  title: string;
  description: string;
  category: NodeCategory;
  difficulty: DifficultyLevel;
  gradeLevel: number[];
  prerequisites: string[]; // Node IDs
  relatedNodes: string[];
  ethicsConnections: string[];
  estimatedMinutes: number;
  masteryThreshold: number; // 0-100
  // Mapping to PBL Content
  relatedScenarioId?: string;
  relatedPhaseId?: string;
};

export enum EdgeRelationship {
  REQUIRES_UNDERSTANDING_OF = "requires_understanding_of",
  IS_A_TYPE_OF = "is_a_type_of",
  IS_RELATED_TO = "is_related_to",
  HAS_ETHICAL_IMPLICATIONS = "has_ethical_implications",
  IS_USED_IN = "is_used_in",
  BUILDS_UPON = "builds_upon"
}

export type KnowledgeEdge = {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: EdgeRelationship;
  weight: number;
  isRequired: boolean;
};

export type LearningPath = {
  pathId: string;
  studentId: string;
  nodeSequence: string[]; // Ordered Node IDs
  currentPosition: number;
  completedNodes: string[];
  skippedNodes: string[];
  injectedRemedialNodes: string[];
  pathEfficiency: number;
  createdAt: Date;
  lastModified: Date;
};

// ---------- Session & Progress Types ----------

export type ConceptDiscovery = {
  conceptId: string;
  discoveredAt: Date;
  discoveredInPhase: string;
  insightsGained: string[];
  timeSpent: number; // seconds
};

export type PhaseProgress = {
  phaseId: string;
  status: 'locked' | 'active' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  notesWritten: string[];
  questionsAsked: string[];
};

export type ReflectionResponse = {
  promptId: string;
  response: string;
  submittedAt: Date;
  conceptsReferenced: string[];
};

export type ProblemProgress = {
  scenarioId: string;
  status: 'not_started' | 'investigating' | 'reflecting' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  currentPhaseId: string | null;
  phasesProgress: PhaseProgress[];
  discoveredConcepts: ConceptDiscovery[];
  reflectionResponses: ReflectionResponse[];
  // Student's evolving understanding/notes
  investigationNotes: string;
  // Final solution proposal
  solutionProposal?: string;
};

export type PBLSessionState = {
  // Current problem being worked on
  currentProblemId: string | null;
  // All problems and their progress
  problemsProgress: ProblemProgress[];
  // All concepts discovered across problems
  allDiscoveredConcepts: string[];
  // Concept mastery levels (0-100)
  conceptMastery: Record<string, number>;
  // Total learning time in seconds
  totalLearningTime: number;
  // Session start time
  sessionStartedAt: Date | null;
  // Graph-Based Path
  currentPath: LearningPath | null;
  nextRecommendedNode: KnowledgeNode | null;
};

// ---------- AI Tutor Types ----------

export type TutorMode = 'socratic' | 'hint' | 'explain' | 'challenge';

export type TutorMessage = {
  role: 'user' | 'tutor';
  content: string;
  mode?: TutorMode;
  timestamp: Date;
  relatedConcepts?: string[];
};

export type TutorContext = {
  currentProblem: ProblemScenario | null;
  currentPhase: InvestigationPhase | null;
  discoveredConcepts: string[];
  conversationHistory: TutorMessage[];
  studentStuckCount: number; // Track if student needs more help
};

// ---------- Dynamic Concept Linking ----------

export type ConceptLink = {
  fromConcept: string;
  toConcept: string;
  relationship: 'builds_on' | 'contrasts_with' | 'applies_to' | 'example_of';
  description: string;
};

export type ConceptMap = {
  concepts: ConceptResource[];
  links: ConceptLink[];
};

// ---------- Legacy Types (for backward compatibility) ----------

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// [Removed Legacy KnowledgeNode definition to avoid conflict with new Graph Architecture]

export type AssessmentQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  nodeId: string;
  difficulty: 'beginner' | 'intermediate';
  type: 'diagnostic' | 'post-test';
  atype?: string; // typo in original data
};

export type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export type SessionState = {
  diagnosticScore: number | null;
  postTestScore: number | null;
  completedNodes: string[];
};

// ---------- Explainability Types (Stakeholder Trust) ----------

export type ExplainabilityEventType =
  | 'tutor_response'
  | 'mode_change'
  | 'concept_revealed'
  | 'phase_transition'
  | 'mastery_update'
  | 'path_adaptation'
  | 'hint_triggered'
  | 'reflection_feedback';

export type ExplainabilityEntry = {
  id: string;
  timestamp: Date;
  eventType: ExplainabilityEventType;
  title: string;
  explanation: string;
  reasoning: string;
  // What factors influenced this decision
  factors: {
    factor: string;
    value: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  // Related data
  relatedConcepts?: string[];
  relatedPhase?: string;
  studentState?: {
    stuckCount?: number;
    discoveredConceptsCount?: number;
    currentMastery?: Record<string, number>;
    timeInPhase?: number;
  };
  // AI-specific info
  aiDecision?: {
    mode?: TutorMode;
    confidence?: number;
    alternativesConsidered?: string[];
  };
};

export type LearningPathExplanation = {
  currentPath: {
    problemId: string;
    phaseId: string;
    suggestedConcepts: string[];
  };
  reasoning: string;
  adaptations: {
    trigger: string;
    change: string;
    benefit: string;
  }[];
  studentProfile: {
    strengths: string[];
    areasForGrowth: string[];
    learningPace: 'fast' | 'moderate' | 'careful';
    preferredMode: TutorMode;
  };
};

export type ExplainabilityState = {
  entries: ExplainabilityEntry[];
  currentPathExplanation: LearningPathExplanation | null;
  isVisible: boolean;
  // Stakeholder access levels
  viewerRole: 'student' | 'parent' | 'teacher' | 'admin';
};
