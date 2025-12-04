'use server';
/**
 * @fileOverview AI-powered tutoring support for AI ethics concepts.
 *
 * - askTutor - A function that handles the interaction with the AI tutor.
 * - AskTutorInput - The input type for the askTutor function.
 * - AskTutorOutput - The return type for the askTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskTutorInputSchema = z.object({
  nodeId: z.string().describe('The ID of the knowledge graph node.'),
  question: z.string().describe('The student question.'),
});
export type AskTutorInput = z.infer<typeof AskTutorInputSchema>;

const AskTutorOutputSchema = z.object({
  answer: z.string().describe('The AI tutor answer.'),
  tokensUsed: z.number().describe('Number of tokens used for LLM interaction'),
});
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  return askTutorFlow(input);
}

const askTutorPrompt = ai.definePrompt({
  name: 'askTutorPrompt',
  input: {schema: AskTutorInputSchema},
  output: {schema: AskTutorOutputSchema},
  prompt: `You are an AI literacy tutor for 7th-8th grade students.

Current topic: {{node.title}}
Description: {{node.description}}

Rules:
1. Use simple 7th-grade language
2. Give real-world examples (social media, school, games)
3. Keep answers under 100 words
4. Stay on topic (AI Ethics only)
5. If off-topic, redirect gently

Student question: {{question}}`,
});

const knowledgeGraphNodeTool = ai.defineTool({
  name: 'getKnowledgeGraphNode',
  description: 'Retrieves a knowledge graph node by its ID.',
  inputSchema: z.object({
    nodeId: z.string().describe('The ID of the knowledge graph node to retrieve.'),
  }),
  outputSchema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  async execute(input) {
    // TODO: Implement the actual data retrieval logic here.
    // This is a placeholder - replace with actual database/service call.
    // For the sake of this example, we'll return mock data.
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
      id: 'unknown',
      title: 'Unknown Topic',
      description: 'No information available for this topic.',
    };
  },
});

const askTutorFlow = ai.defineFlow(
  {
    name: 'askTutorFlow',
    inputSchema: AskTutorInputSchema,
    outputSchema: AskTutorOutputSchema,
  },
  async input => {
    const node = await knowledgeGraphNodeTool.execute({nodeId: input.nodeId});
    const promptInput = {...input, node};

    const {output, tokens} = await askTutorPrompt(promptInput);
    return {
      answer: output!.answer,
      tokensUsed: tokens
    };
  }
);
