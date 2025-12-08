"use server";

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export interface ScoringResult {
    score: number; // 0-100
    passed: boolean;
    feedback: string;
    missingConcepts: string[];
    strengths: string[];
    reasoningDepth: 'shallow' | 'moderate' | 'deep';
}

const EvaluationSchema = z.object({
    score: z.number().min(0).max(100),
    feedback: z.string(),
    missingConcepts: z.array(z.string()),
    strengths: z.array(z.string()),
    reasoningDepth: z.enum(['shallow', 'moderate', 'deep']),
});

/**
 * Evaluates a student's response against the phase requirements.
 * Uses a hybrid approach:
 * 1. Keywords (Basic check)
 * 2. Semantic Analysis (AI check)
 */
export async function evaluateResponse(
    phasePrompt: string,
    studentResponse: string,
    requiredKeywords: string[] = []
): Promise<ScoringResult> {

    // 1. Basic Keyword Check (Fast Fail/Pass Heuristic)
    const normalizedResponse = studentResponse.toLowerCase();
    const matchedKeywords = requiredKeywords.filter(k =>
        normalizedResponse.includes(k.toLowerCase())
    );
    const keywordCoverage = requiredKeywords.length > 0
        ? matchedKeywords.length / requiredKeywords.length
        : 1;

    // 2. AI Semantic Evaluation
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: `You are an expert teacher evaluating a student's answer.
      
      PHASE PROMPT: "${phasePrompt}"
      
      STUDENT RESPONSE: "${studentResponse}"
      
      REQUIRED KEYWORDS DETECTED: ${matchedKeywords.join(', ')} (${Math.round(keywordCoverage * 100)}%)
      
      RUBRIC:
      - Score < 70 requires remediation.
      - Score >= 70 is a pass.
      - "Deep" reasoning requires connecting concepts to the scenario.
      - "Shallow" reasoning is just restating facts.
      
      Evaluate the response for understanding, clarity, and depth.
      Give constructive feedback suitable for a middle schooler.`,
        output: { schema: EvaluationSchema }
    });

    if (!output) {
        throw new Error("Failed to generate evaluation");
    }

    // Hybrid Score Adjustment
    // Penalize if keyword coverage is very low, even if AI is generous
    let finalScore = output.score;
    if (keywordCoverage < 0.5 && finalScore > 60) {
        finalScore -= 10;
    }

    return {
        score: finalScore,
        passed: finalScore >= 70,
        feedback: output.feedback,
        missingConcepts: output.missingConcepts,
        strengths: output.strengths,
        reasoningDepth: output.reasoningDepth,
    };
}
