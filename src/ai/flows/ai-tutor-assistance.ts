'use server';
/**
 * @fileOverview Socratic AI Facilitator for Problem-Based Learning
 *
 * This AI acts as a guide, not an instructor. It uses Socratic questioning
 * to help students discover insights and connect concepts to real problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { conceptResources, getProblemById, getConceptById } from '@/lib/data';
import type { TutorMode } from '@/lib/types';

// ============================================
// INPUT/OUTPUT SCHEMAS
// ============================================

const SocraticTutorInputSchema = z.object({
  problemId: z.string().describe('The current problem scenario ID'),
  phaseId: z.string().describe('The current investigation phase ID'),
  studentMessage: z.string().describe('The student\'s message or question'),
  discoveredConcepts: z.array(z.string()).describe('Concepts the student has discovered'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'tutor']),
    content: z.string(),
  })).describe('Previous conversation messages'),
  stuckCount: z.number().describe('How many times the student has asked for help without progress'),
  mode: z.enum(['socratic', 'hint', 'explain', 'challenge']).optional(),
});

export type SocraticTutorInput = z.infer<typeof SocraticTutorInputSchema>;

const SocraticTutorOutputSchema = z.object({
  response: z.string().describe('The tutor\'s response'),
  suggestedConcepts: z.array(z.string()).describe('Concepts relevant to explore'),
  followUpQuestions: z.array(z.string()).describe('Questions to deepen thinking'),
  mode: z.enum(['socratic', 'hint', 'explain', 'challenge']).describe('The response mode used'),
  shouldRevealConcept: z.boolean().describe('Whether a concept should be revealed'),
  conceptToReveal: z.string().optional().describe('The concept ID to reveal if applicable'),
});

export type SocraticTutorOutput = z.infer<typeof SocraticTutorOutputSchema>;

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export async function askSocraticTutor(input: SocraticTutorInput): Promise<SocraticTutorOutput> {
  return socraticTutorFlow(input);
}

// Legacy support
const AskTutorInputSchema = z.object({
  nodeId: z.string().describe('The ID of the knowledge graph node.'),
  question: z.string().describe('The student question.'),
});

const AskTutorOutputSchema = z.object({
  answer: z.string().describe('The AI tutor answer.'),
});

export type AskTutorInput = z.infer<typeof AskTutorInputSchema>;
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  // Convert legacy input to Socratic format
  const socraticInput: SocraticTutorInput = {
    problemId: '',
    phaseId: '',
    studentMessage: input.question,
    discoveredConcepts: [],
    conversationHistory: [],
    stuckCount: 0,
    mode: 'explain', // Legacy mode defaults to explain
  };

  const result = await socraticTutorFlow(socraticInput);

  return {
    answer: result.response,
    tokensUsed: 0,
  };
}

const knowledgeGraphNodeTool = ai.defineTool(
  {
    name: 'socraticTutorFlow',
    inputSchema: SocraticTutorInputSchema,
    outputSchema: SocraticTutorOutputSchema,
  },
  async (input) => {
    // This is a placeholder - in a real app, this would fetch from a database.
    if (input.nodeId === 'ethics_01') {
      return {
        id: 'ethics_01',
        title: 'Privacy Basics',
        description: 'Understanding personal data and why privacy matters',
      };
    } else if (input.nodeId === 'ethics_02') {
      return {
        id: 'ethics_02',
        title: 'Data Collection',
        description: 'How do apps and AI systems collect your information?',
      };
    } else if (input.nodeId === 'ethics_03') {
      return {
        id: 'ethics_03',
        title: 'Algorithmic Bias',
        description: 'Discover how AI can sometimes make unfair decisions.',
      };
    } else if (input.nodeId === 'ethics_04') {
        return {
          id: 'ethics_04',
          title: 'AI Decision Making',
          description: 'Understand how AI models make predictions and decisions.',
        };
    } else if (input.nodeId === 'ethics_05') {
        return {
          id: 'ethics_05',
          title: 'Fairness in AI',
          description: 'Exploring what it means for AI to be fair to everyone.',
        };
    } else if (input.nodeId === 'ethics_06') {
      return {
        id: 'ethics_06',
        title: 'AI & Misinformation',
        description: 'Learn how AI can create and spread false information.',
      };
    } else if (input.nodeId === 'ethics_07') {
      return {
        id: 'ethics_07',
        title: 'Human-in-the-Loop',
        description: 'Why human oversight is crucial for AI systems.',
      };
    }
    return {
      response: output?.response || "That's an interesting thought. Can you tell me more about what made you think of that?",
      suggestedConcepts: output?.suggestedConcepts || [],
      followUpQuestions: output?.followUpQuestions || [],
      mode: effectiveMode,
      shouldRevealConcept: output?.shouldRevealConcept || false,
      conceptToReveal: output?.conceptToReveal,
    };
  }
);


const askTutorFlow = ai.defineFlow(
  {
    name: 'askTutorFlow',
    inputSchema: AskTutorInputSchema,
    outputSchema: AskTutorOutputSchema,
  },
  async (input) => {
    
    const { output } = await ai.generate({
        prompt: `Student question: ${input.question}`,
        system: `You are an AI literacy tutor for 7th-8th grade students.

Your role is to help students understand concepts related to AI Ethics.
When a student asks a question, you must decide if it is related to the current topic. To get information on the current topic, you MUST use the getKnowledgeGraphNode tool.

Rules:
1. Use simple 7th-grade language.
2. Give real-world examples relevant to a middle schooler (social media, school, video games).
3. Keep answers concise, ideally under 100 words.
4. Stay on the topic of AI Ethics.
5. If the question is off-topic, gently redirect the student back to the current topic of study. Do not answer off-topic questions.`,
        tools: [knowledgeGraphNodeTool],
        model: 'googleai/gemini-2.5-flash',
        output: { schema: AskTutorOutputSchema }
    });
    
    return output!;
  }

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are explaining the AI ethics concept "${concept.title}" to a 7th-8th grader.

CONCEPT: ${concept.title}
DESCRIPTION: ${concept.description}
KEY INSIGHTS: ${concept.keyInsights.join('; ')}

${input.problemContext ? `CURRENT PROBLEM CONTEXT: ${input.problemContext}` : ''}
${input.studentQuestion ? `STUDENT'S QUESTION: ${input.studentQuestion}` : ''}

Provide:
1. A clear, simple explanation (2-3 sentences, 7th grade reading level)
2. A relatable real-world example (social media, school, games)
3. How this connects to their current problem investigation
4. A thought-provoking question to consider

Keep the total response under 200 words.`,
    output: {
      schema: ConceptExplanationOutputSchema,
    },
  });

  return output || {
    explanation: concept.description,
    realWorldExample: 'Think about how this applies to apps you use every day.',
    connectionToCurrentProblem: 'Consider how this concept relates to the problem you\'re investigating.',
    thinkAboutThis: concept.guidingQuestions[0] || 'What do you think about this?',
  };
}

// ============================================
// REFLECTION FEEDBACK FLOW
// ============================================

const ReflectionFeedbackInputSchema = z.object({
  problemId: z.string(),
  reflectionPromptId: z.string(),
  studentResponse: z.string(),
  conceptsDiscovered: z.array(z.string()),
});

const ReflectionFeedbackOutputSchema = z.object({
  overallFeedback: z.string(),
  strengths: z.array(z.string()),
  areasToImprove: z.array(z.string()),
  conceptsWellApplied: z.array(z.string()),
  conceptsMissed: z.array(z.string()),
  followUpQuestion: z.string(),
  score: z.number().min(0).max(100),
});

export async function evaluateReflection(input: z.infer<typeof ReflectionFeedbackInputSchema>) {
  const problem = getProblemById(input.problemId);
  if (!problem) {
    return {
      overallFeedback: 'Unable to evaluate response.',
      strengths: [],
      areasToImprove: [],
      conceptsWellApplied: [],
      conceptsMissed: [],
      followUpQuestion: '',
      score: 0,
    };
  }

  const reflectionPrompt = problem.reflectionPrompts.find(r => r.id === input.reflectionPromptId);
  if (!reflectionPrompt) {
    return {
      overallFeedback: 'Reflection prompt not found.',
      strengths: [],
      areasToImprove: [],
      conceptsWellApplied: [],
      conceptsMissed: [],
      followUpQuestion: '',
      score: 0,
    };
  }

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are evaluating a 7th-8th grader's reflection on an AI ethics problem.

PROBLEM: ${problem.title}
${problem.scenario}

REFLECTION QUESTION: ${reflectionPrompt.question}

RUBRIC:
${reflectionPrompt.rubricCriteria.map(c => `- ${c.criterion} (${c.weight}%): ${c.description}`).join('\n')}

CONCEPTS THEY SHOULD DEMONSTRATE:
${reflectionPrompt.assessesConcepts.map(id => {
  const c = getConceptById(id);
  return c ? `- ${c.title}: ${c.description}` : '';
}).filter(Boolean).join('\n')}

CONCEPTS THEY DISCOVERED DURING INVESTIGATION:
${input.conceptsDiscovered.join(', ')}

STUDENT'S RESPONSE:
"${input.studentResponse}"

Evaluate this response. Be encouraging but honest. Give specific, actionable feedback.
Remember this is a middle schooler - celebrate effort and good thinking.`,
    output: {
      schema: ReflectionFeedbackOutputSchema,
    },
  });

  return output || {
    overallFeedback: 'Thank you for your thoughtful response!',
    strengths: ['You engaged with the problem'],
    areasToImprove: ['Consider connecting more concepts'],
    conceptsWellApplied: [],
    conceptsMissed: [],
    followUpQuestion: 'What else might you consider?',
    score: 70,
  };
}
