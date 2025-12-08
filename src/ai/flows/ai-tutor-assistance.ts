'use server';
/**
 * @fileOverview Socratic AI Facilitator for Problem-Based Learning
 *
 * This AI acts as a guide, not an instructor. It uses Socratic questioning
 * to help students discover insights and connect concepts to real problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getProblemById, getConceptById } from '@/lib/data';
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
  // Explainability fields for stakeholder trust
  explainability: z.object({
    reasoning: z.string().describe('Why the AI chose this response approach'),
    pedagogicalIntent: z.string().describe('The learning goal this response supports'),
    adaptationFactors: z.array(z.object({
      factor: z.string(),
      observation: z.string(),
      influence: z.string(),
    })).describe('What student signals influenced this response'),
    alternativeApproaches: z.array(z.string()).describe('Other approaches considered'),
    confidenceLevel: z.enum(['high', 'medium', 'low']).describe('AI confidence in this approach'),
  }).optional(),
});

export type SocraticTutorOutput = z.infer<typeof SocraticTutorOutputSchema>;

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
    const problem = getProblemById(input.problemId);

    // Determine the effective mode based on stuck count
    let effectiveMode: TutorMode = input.mode || 'socratic';
    if (input.stuckCount >= 3) {
      effectiveMode = 'explain';
    } else if (input.stuckCount >= 2) {
      effectiveMode = 'hint';
    }

    const modeInstructions = {
      socratic: 'Ask guiding questions to help the student discover insights on their own. Do NOT give direct answers.',
      hint: 'Provide gentle hints that point the student in the right direction without giving away the answer.',
      explain: 'Provide a clear, simple explanation since the student seems stuck. Use examples they can relate to.',
      challenge: 'Push the student to think more deeply by presenting counterarguments or edge cases.',
    };

    const conversationContext = input.conversationHistory
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');

    // Build context for explainability
    const stuckStatus = input.stuckCount >= 3 ? 'significantly stuck' :
      input.stuckCount >= 2 ? 'somewhat stuck' :
        input.stuckCount >= 1 ? 'slightly stuck' : 'progressing well';

    const modeReason = input.mode ? `Teacher requested ${input.mode} mode` :
      input.stuckCount >= 3 ? `Student appears stuck (${input.stuckCount} help requests), switching to explain mode` :
        input.stuckCount >= 2 ? `Student needs more guidance (${input.stuckCount} help requests), using hint mode` :
          'Default Socratic questioning to encourage discovery';

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a Socratic tutor helping a 7th-8th grade student investigate an AI ethics problem.

PROBLEM: ${problem?.title || 'General AI Ethics'}
${problem?.scenario || ''}

CURRENT PHASE: ${input.phaseId}
DISCOVERED CONCEPTS: ${input.discoveredConcepts.join(', ') || 'None yet'}
STUDENT STATUS: ${stuckStatus} (${input.stuckCount} help requests)

CONVERSATION SO FAR:
${conversationContext}

STUDENT'S MESSAGE: ${input.studentMessage}

MODE: ${effectiveMode}
MODE REASON: ${modeReason}
INSTRUCTION: ${modeInstructions[effectiveMode]}

Respond appropriately for a middle schooler. Keep responses under 150 words.
If the student demonstrates understanding of a concept, suggest revealing it.

IMPORTANT: Also provide explainability information for parents/teachers:
- reasoning: Why you chose this response approach
- pedagogicalIntent: What learning goal this supports
- adaptationFactors: What about the student's message/state influenced you
- alternativeApproaches: Other approaches you considered
- confidenceLevel: How confident you are this is the right approach`,
      output: {
        schema: SocraticTutorOutputSchema,
      },
    });

    // Provide default explainability if AI didn't return it
    const defaultExplainability = {
      reasoning: modeReason,
      pedagogicalIntent: effectiveMode === 'socratic'
        ? 'Encourage independent discovery through guided questioning'
        : effectiveMode === 'hint'
          ? 'Provide scaffolding while maintaining student agency'
          : effectiveMode === 'explain'
            ? 'Build foundational understanding before resuming discovery'
            : 'Deepen critical thinking through challenging questions',
      adaptationFactors: [
        {
          factor: 'Help Request Count',
          observation: `Student has requested help ${input.stuckCount} times`,
          influence: input.stuckCount >= 2 ? 'Increased scaffolding' : 'Maintained Socratic approach',
        },
        {
          factor: 'Concept Progress',
          observation: `${input.discoveredConcepts.length} concepts discovered`,
          influence: input.discoveredConcepts.length > 0 ? 'Building on prior knowledge' : 'Starting from foundations',
        },
      ],
      alternativeApproaches: effectiveMode === 'socratic'
        ? ['Direct explanation', 'Providing a hint']
        : ['Pure Socratic questioning', 'Challenge mode'],
      confidenceLevel: 'medium' as const,
    };

    return output ? {
      ...output,
      explainability: output.explainability || defaultExplainability,
    } : {
      response: "That's an interesting thought. Can you tell me more about what made you think of that?",
      suggestedConcepts: [],
      followUpQuestions: [],
      mode: effectiveMode,
      shouldRevealConcept: false,
      conceptToReveal: undefined,
      explainability: defaultExplainability,
    };
  }
);

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export async function askSocraticTutor(input: SocraticTutorInput): Promise<SocraticTutorOutput> {
  return socraticTutorFlow(input);
}

// ============================================
// LEGACY SUPPORT
// ============================================

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
    mode: 'explain',
  };

  const result = await socraticTutorFlow(socraticInput);

  return {
    answer: result.response,
    answer: result.response,
  };
}

const ConceptNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const knowledgeGraphNodeTool = ai.defineTool(
  {
    name: 'getKnowledgeGraphNode',
    inputSchema: z.object({ nodeId: z.string().describe('The ID of the concept node to retrieve') }),
    outputSchema: ConceptNodeSchema,
  },
  async (input) => {
    const concept = getConceptById(input.nodeId);
    if (concept) {
      return {
        id: concept.id,
        title: concept.title,
        description: concept.description,
      };
    }
    return {
      id: 'unknown',
      title: 'Unknown Concept',
      description: 'Concept not found.'
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
);

const ConceptExplanationOutputSchema = z.object({
  explanation: z.string(),
  realWorldExample: z.string(),
  connectionToCurrentProblem: z.string(),
  thinkAboutThis: z.string(),
});

async function explainConcept(concept: any, input: { problemContext?: string, studentQuestion?: string }) {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are explaining the AI ethics concept "${concept.title}" to a 7th-8th grader.

CONCEPT: ${concept.title}
DESCRIPTION: ${concept.description}
KEY INSIGHTS: ${concept.keyInsights?.join('; ') || ''}

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
    thinkAboutThis: concept.guidingQuestions?.[0] || 'What do you think about this?',
  };
}
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
