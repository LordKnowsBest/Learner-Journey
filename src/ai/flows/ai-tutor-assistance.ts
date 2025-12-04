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
});
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  return askTutorFlow(input);
}

const knowledgeGraphNodeTool = ai.defineTool(
  {
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
      id: 'unknown',
      title: 'Unknown Topic',
      description: 'No information available for this topic.',
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
