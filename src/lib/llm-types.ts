/**
 * LLM Router System - Type Definitions
 * Supports multiple LLM providers with automatic routing based on task type
 */

export type LLMProvider = 'gemini' | 'groq' | 'openai' | 'anthropic';

export type TaskType =
  | 'socratic-questioning'  // Deep reasoning, Socratic method
  | 'fast-inference'        // Quick responses, Groq excels here
  | 'explanation'           // Detailed explanations
  | 'reflection-feedback'   // Student reflection evaluation
  | 'concept-generation';   // Generate learning content

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  modelName: string;
  enabled: boolean;
  maxTokens?: number;
  temperature?: number;
  priority: number; // Lower = higher priority
}

export interface LLMProviderCapabilities {
  provider: LLMProvider;
  strengths: TaskType[];
  displayName: string;
  defaultModel: string;
  requiresApiKey: boolean;
  costPerMillion: number; // Rough cost estimate
  avgLatency: 'fast' | 'medium' | 'slow';
}

export interface LLMSettings {
  providers: Record<LLMProvider, LLMConfig | null>;
  routing: Record<TaskType, LLMProvider>;
  fallbackProvider: LLMProvider;
  lastUpdated: string;
}

export const PROVIDER_CAPABILITIES: Record<LLMProvider, LLMProviderCapabilities> = {
  gemini: {
    provider: 'gemini',
    strengths: ['socratic-questioning', 'explanation', 'concept-generation'],
    displayName: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    requiresApiKey: true,
    costPerMillion: 0.075, // $0.075 per 1M tokens
    avgLatency: 'medium',
  },
  groq: {
    provider: 'groq',
    strengths: ['fast-inference', 'socratic-questioning'],
    displayName: 'Groq (Fast Inference)',
    defaultModel: 'llama-3.3-70b-versatile',
    requiresApiKey: true,
    costPerMillion: 0.59, // $0.59 per 1M tokens
    avgLatency: 'fast',
  },
  openai: {
    provider: 'openai',
    strengths: ['explanation', 'reflection-feedback', 'concept-generation'],
    displayName: 'OpenAI GPT',
    defaultModel: 'gpt-4o-mini',
    requiresApiKey: true,
    costPerMillion: 0.15, // $0.15 per 1M tokens (gpt-4o-mini)
    avgLatency: 'medium',
  },
  anthropic: {
    provider: 'anthropic',
    strengths: ['socratic-questioning', 'reflection-feedback', 'explanation'],
    displayName: 'Anthropic Claude',
    defaultModel: 'claude-3-5-haiku-20241022',
    requiresApiKey: true,
    costPerMillion: 1.0, // $1.00 per 1M tokens (Haiku)
    avgLatency: 'fast',
  },
};

export const DEFAULT_LLM_SETTINGS: LLMSettings = {
  providers: {
    gemini: null,
    groq: null,
    openai: null,
    anthropic: null,
  },
  routing: {
    'socratic-questioning': 'gemini',
    'fast-inference': 'groq',
    'explanation': 'gemini',
    'reflection-feedback': 'gemini',
    'concept-generation': 'gemini',
  },
  fallbackProvider: 'gemini',
  lastUpdated: new Date().toISOString(),
};
