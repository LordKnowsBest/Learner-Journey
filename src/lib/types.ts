export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type KnowledgeNode = {
  id: string;
  title:string;
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
  difficulty: "beginner" | "intermediate";
  type: "diagnostic" | "post-test";
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
