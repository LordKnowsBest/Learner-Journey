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
  tokensUsed: z.number().describe('Number of tokens used for LLM interaction'),
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

// ============================================
// HELPER FUNCTIONS
// ============================================

function buildProblemContext(problemId: string, phaseId: string): string {
  const problem = getProblemById(problemId);
  if (!problem) return '';

  const phase = problem.phases.find(p => p.id === phaseId);

  return `
CURRENT PROBLEM: "${problem.title}"
${problem.scenario}

STAKEHOLDERS:
${problem.stakeholders.map(s => `- ${s.name} (${s.role}): ${s.perspective}`).join('\n')}

${phase ? `
CURRENT INVESTIGATION PHASE: "${phase.title}"
${phase.description}

GUIDING PROMPT: ${phase.prompt}

QUESTIONS TO CONSIDER:
${phase.questionsToConsider.map(q => `- ${q}`).join('\n')}
` : ''}
`;
}

function buildConceptContext(discoveredConcepts: string[]): string {
  if (discoveredConcepts.length === 0) return 'The student has not yet discovered any concepts.';

  const discovered = discoveredConcepts
    .map(id => getConceptById(id))
    .filter(c => c !== undefined);

  return `
CONCEPTS DISCOVERED SO FAR:
${discovered.map(c => `- ${c!.title}: ${c!.description}`).join('\n')}
`;
}

function getAvailableConcepts(problemId: string, phaseId: string): string[] {
  const problem = getProblemById(problemId);
  if (!problem) return [];

  const phase = problem.phases.find(p => p.id === phaseId);
  return phase?.revealsConcepts || [];
}

function getModeInstructions(mode: TutorMode | undefined, stuckCount: number): string {
  // Adaptive mode based on stuck count
  const effectiveMode = mode || (stuckCount >= 3 ? 'explain' : stuckCount >= 1 ? 'hint' : 'socratic');

  const instructions: Record<TutorMode, string> = {
    socratic: `
MODE: SOCRATIC QUESTIONING
- DO NOT give direct answers
- Ask thought-provoking questions that guide discovery
- Help the student connect ideas to the problem
- Encourage them to think about stakeholder perspectives
- Use phrases like "What do you think would happen if...", "Have you considered...", "What might [stakeholder] say about..."
`,
    hint: `
MODE: GENTLE HINTS
- The student is slightly stuck, provide gentle guidance
- Give partial information that points in the right direction
- Suggest an angle to consider without revealing the answer
- Reference the problem scenario to keep them grounded
`,
    explain: `
MODE: SUPPORTIVE EXPLANATION
- The student needs more direct help
- Explain concepts clearly but still encourage thinking
- Connect explanations back to the problem at hand
- After explaining, ask a follow-up question to check understanding
`,
    challenge: `
MODE: CHALLENGE & EXTEND
- The student is doing well, push their thinking further
- Play devil's advocate to strengthen their reasoning
- Ask them to consider edge cases or alternative perspectives
- Challenge assumptions in a constructive way
`,
  };

  return instructions[effectiveMode];
}

// ============================================
// SOCRATIC TUTOR FLOW
// ============================================

const socraticTutorFlow = ai.defineFlow(
  {
    name: 'socraticTutorFlow',
    inputSchema: SocraticTutorInputSchema,
    outputSchema: SocraticTutorOutputSchema,
  },
  async (input) => {
    const problemContext = buildProblemContext(input.problemId, input.phaseId);
    const conceptContext = buildConceptContext(input.discoveredConcepts);
    const modeInstructions = getModeInstructions(input.mode, input.stuckCount);
    const availableConcepts = getAvailableConcepts(input.problemId, input.phaseId);

    const conversationContext = input.conversationHistory.length > 0
      ? `\nRECENT CONVERSATION:\n${input.conversationHistory.slice(-6).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`
      : '';

    const systemPrompt = `You are a Socratic facilitator helping 7th-8th grade students learn about AI ethics through problem-based learning.

YOUR ROLE:
- Guide students to discover insights, don't lecture them
- Connect everything back to the current problem scenario
- Help students think critically about stakeholder perspectives
- Celebrate good thinking and gently redirect misconceptions
- Use simple, age-appropriate language (7th-8th grade level)

${modeInstructions}

IMPORTANT RULES:
1. Keep responses under 150 words
2. Always end with a question or prompt for further thinking (except in explain mode after direct help)
3. Reference specific stakeholders or details from the problem
4. If a student's thinking naturally leads to a concept, note it for revelation
5. Never be preachy or moralistic - let students reach conclusions themselves

AVAILABLE CONCEPTS FOR THIS PHASE:
${availableConcepts.map(id => {
  const c = getConceptById(id);
  return c ? `- ${id}: ${c.title}` : '';
}).filter(Boolean).join('\n')}

${problemContext}

${conceptContext}

${conversationContext}

STUDENT MESSAGE: "${input.studentMessage}"

Respond as the Socratic facilitator. If the student's response demonstrates understanding of a concept, indicate it should be revealed.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: systemPrompt,
      output: {
        schema: SocraticTutorOutputSchema,
      },
    });

    // Determine effective mode for response
    const effectiveMode: TutorMode = input.mode || (input.stuckCount >= 3 ? 'explain' : input.stuckCount >= 1 ? 'hint' : 'socratic');

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

// ============================================
// CONCEPT EXPLANATION FLOW
// ============================================

const ConceptExplanationInputSchema = z.object({
  conceptId: z.string(),
  problemContext: z.string().optional(),
  studentQuestion: z.string().optional(),
});

const ConceptExplanationOutputSchema = z.object({
  explanation: z.string(),
  realWorldExample: z.string(),
  connectionToCurrentProblem: z.string(),
  thinkAboutThis: z.string(),
});

export async function explainConcept(input: z.infer<typeof ConceptExplanationInputSchema>) {
  const concept = getConceptById(input.conceptId);
  if (!concept) {
    return {
      explanation: 'Concept not found.',
      realWorldExample: '',
      connectionToCurrentProblem: '',
      thinkAboutThis: '',
    };
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
