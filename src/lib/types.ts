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

export type KnowledgeNode = {
  id: string;
  title: string;
  description: string;
  order: number;
  videoUrl: string;
  videoTitle: string;
  videoDuration: number;
  articleUrl: string;
  articleTitle: string;
  quiz: QuizQuestion[];
  prerequisites: string[];
  category: string;
};

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
