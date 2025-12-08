/**
 * AI Tutor with LLM Router Integration
 * Uses the intelligent router to select the best provider for each task
 */
'use server';

import { getLLMRouter } from '@/lib/llm-router';
import { z } from 'zod';
import { getProblemById, getConceptById } from '@/lib/data';
import type { TutorMode } from '@/lib/types';

// Input/Output schemas remain the same
const SocraticTutorInputSchema = z.object({
  problemId: z.string(),
  phaseId: z.string(),
  studentMessage: z.string(),
  discoveredConcepts: z.array(z.string()),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'tutor']),
    content: z.string(),
  })),
  stuckCount: z.number(),
  mode: z.enum(['socratic', 'hint', 'explain', 'challenge']).optional(),
});

export type SocraticTutorInput = z.infer<typeof SocraticTutorInputSchema>;

const SocraticTutorOutputSchema = z.object({
  response: z.string(),
  suggestedConcepts: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  mode: z.enum(['socratic', 'hint', 'explain', 'challenge']),
  shouldRevealConcept: z.boolean(),
  conceptToReveal: z.string().optional(),
  explainability: z.object({
    reasoning: z.string(),
    pedagogicalIntent: z.string(),
    adaptationFactors: z.array(z.object({
      factor: z.string(),
      observation: z.string(),
      influence: z.string(),
    })),
    alternativeApproaches: z.array(z.string()),
    confidenceLevel: z.enum(['high', 'medium', 'low']),
  }).optional(),
  // Add provider info
  provider: z.string().optional(),
  latencyMs: z.number().optional(),
});

export type SocraticTutorOutput = z.infer<typeof SocraticTutorOutputSchema>;

/**
 * Main Socratic Tutor function using LLM Router
 */
export async function askSocraticTutor(input: SocraticTutorInput): Promise<SocraticTutorOutput> {
  const problem = getProblemById(input.problemId);

  // Determine the effective mode
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

  const stuckStatus = input.stuckCount >= 3 ? 'significantly stuck' :
    input.stuckCount >= 2 ? 'somewhat stuck' :
      input.stuckCount >= 1 ? 'slightly stuck' : 'progressing well';

  const modeReason = input.mode ? `Teacher requested ${input.mode} mode` :
    input.stuckCount >= 3 ? `Student appears stuck (${input.stuckCount} help requests), switching to explain mode` :
      input.stuckCount >= 2 ? `Student needs more guidance (${input.stuckCount} help requests), using hint mode` :
        'Default Socratic questioning to encourage discovery';

  const systemPrompt = `You are a Socratic tutor helping a 7th-8th grade student investigate an AI ethics problem.

PROBLEM: ${problem?.title || 'General AI Ethics'}
${problem?.scenario || ''}

CURRENT PHASE: ${input.phaseId}
DISCOVERED CONCEPTS: ${input.discoveredConcepts.join(', ') || 'None yet'}
STUDENT STATUS: ${stuckStatus} (${input.stuckCount} help requests)

MODE: ${effectiveMode}
MODE REASON: ${modeReason}
INSTRUCTION: ${modeInstructions[effectiveMode]}

Respond appropriately for a middle schooler. Keep responses under 150 words.

You must respond in valid JSON format with this exact structure:
{
  "response": "your tutor response here",
  "suggestedConcepts": ["concept1", "concept2"],
  "followUpQuestions": ["question1", "question2"],
  "mode": "${effectiveMode}",
  "shouldRevealConcept": false,
  "conceptToReveal": null,
  "explainability": {
    "reasoning": "why you chose this approach",
    "pedagogicalIntent": "what learning goal this supports",
    "adaptationFactors": [{"factor": "name", "observation": "what you noticed", "influence": "how it affected your response"}],
    "alternativeApproaches": ["other approach 1", "other approach 2"],
    "confidenceLevel": "medium"
  }
}`;

  const userPrompt = `CONVERSATION SO FAR:
${conversationContext}

STUDENT'S MESSAGE: ${input.studentMessage}`;

  try {
    // Use LLM Router for intelligent provider selection
    const router = getLLMRouter();
    const llmResponse = await router.generate({
      systemPrompt,
      prompt: userPrompt,
      taskType: effectiveMode === 'explain' ? 'explanation' : 'socratic-questioning',
      maxTokens: 500,
      temperature: 0.7,
    });

    // Try to parse JSON from response
    let parsedResponse: any;
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = llmResponse.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                       llmResponse.text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : llmResponse.text;
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      // Fallback: treat entire response as the tutor message
      parsedResponse = {
        response: llmResponse.text,
        suggestedConcepts: [],
        followUpQuestions: [],
        mode: effectiveMode,
        shouldRevealConcept: false,
      };
    }

    // Build default explainability
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

    return {
      response: parsedResponse.response || llmResponse.text,
      suggestedConcepts: parsedResponse.suggestedConcepts || [],
      followUpQuestions: parsedResponse.followUpQuestions || [],
      mode: effectiveMode,
      shouldRevealConcept: parsedResponse.shouldRevealConcept || false,
      conceptToReveal: parsedResponse.conceptToReveal,
      explainability: parsedResponse.explainability || defaultExplainability,
      provider: llmResponse.provider,
      latencyMs: llmResponse.latencyMs,
    };
  } catch (error) {
    console.error('LLM Router error:', error);

    // Fallback response
    return {
      response: "I'm having trouble connecting right now. Could you rephrase your question? You can also check the Settings page to configure your AI providers.",
      suggestedConcepts: [],
      followUpQuestions: [],
      mode: effectiveMode,
      shouldRevealConcept: false,
      explainability: {
        reasoning: 'Error occurred during generation',
        pedagogicalIntent: 'Maintain conversation flow despite technical issues',
        adaptationFactors: [],
        alternativeApproaches: [],
        confidenceLevel: 'low',
      },
    };
  }
}
