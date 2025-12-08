/**
 * LLM Router - Intelligent routing to multiple LLM providers
 * Automatically selects the best provider based on task type and availability
 */

import { getLLMSettingsService } from './llm-settings';
import type { TaskType, LLMProvider } from './llm-types';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMRequest {
  prompt: string;
  systemPrompt?: string;
  taskType: TaskType;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  tokensUsed?: number;
  latencyMs: number;
}

export class LLMRouter {
  private settingsService = getLLMSettingsService();

  /**
   * Generate a response using the best available provider for the task
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();

    // Get the best provider for this task
    const provider = this.settingsService.getProviderForTask(request.taskType);
    const config = this.settingsService.getProviderConfig(provider);

    if (!config || !config.enabled || !config.apiKey) {
      throw new Error(
        `No provider configured for task type: ${request.taskType}. Please configure API keys in Settings.`
      );
    }

    let response: LLMResponse;

    try {
      switch (provider) {
        case 'gemini':
          response = await this.callGemini(request, config);
          break;
        case 'groq':
          response = await this.callGroq(request, config);
          break;
        case 'openai':
          response = await this.callOpenAI(request, config);
          break;
        case 'anthropic':
          response = await this.callAnthropic(request, config);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      response.latencyMs = Date.now() - startTime;
      return response;
    } catch (error) {
      // Try fallback provider if available
      const fallback = this.settingsService.getSettings().fallbackProvider;
      if (fallback !== provider) {
        const fallbackConfig = this.settingsService.getProviderConfig(fallback);
        if (fallbackConfig?.enabled && fallbackConfig.apiKey) {
          console.warn(`Provider ${provider} failed, trying fallback ${fallback}`);
          return this.callWithProvider(request, fallback, fallbackConfig, startTime);
        }
      }

      throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Call specific provider (for fallback logic)
   */
  private async callWithProvider(
    request: LLMRequest,
    provider: LLMProvider,
    config: any,
    startTime: number
  ): Promise<LLMResponse> {
    let response: LLMResponse;

    switch (provider) {
      case 'gemini':
        response = await this.callGemini(request, config);
        break;
      case 'groq':
        response = await this.callGroq(request, config);
        break;
      case 'openai':
        response = await this.callOpenAI(request, config);
        break;
      case 'anthropic':
        response = await this.callAnthropic(request, config);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    response.latencyMs = Date.now() - startTime;
    return response;
  }

  /**
   * Call Google Gemini API
   */
  private async callGemini(request: LLMRequest, config: any): Promise<LLMResponse> {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.modelName });

    const fullPrompt = request.systemPrompt
      ? `${request.systemPrompt}\n\n${request.prompt}`
      : request.prompt;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature ?? config.temperature ?? 0.7,
      },
    });

    return {
      text: result.response.text(),
      provider: 'gemini',
      model: config.modelName,
      tokensUsed: result.response.usageMetadata?.totalTokenCount,
      latencyMs: 0, // Will be set by caller
    };
  }

  /**
   * Call Groq API (ultra-fast inference)
   */
  private async callGroq(request: LLMRequest, config: any): Promise<LLMResponse> {
    const groq = new Groq({ apiKey: config.apiKey });

    const messages: any[] = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push({ role: 'user', content: request.prompt });

    const completion = await groq.chat.completions.create({
      model: config.modelName,
      messages,
      max_tokens: request.maxTokens || config.maxTokens || 1000,
      temperature: request.temperature ?? config.temperature ?? 0.7,
    });

    return {
      text: completion.choices[0]?.message?.content || '',
      provider: 'groq',
      model: config.modelName,
      tokensUsed: completion.usage?.total_tokens,
      latencyMs: 0,
    };
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(request: LLMRequest, config: any): Promise<LLMResponse> {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: config.apiKey });

      const messages: any[] = [];
      if (request.systemPrompt) {
        messages.push({ role: 'system', content: request.systemPrompt });
      }
      messages.push({ role: 'user', content: request.prompt });

      const completion = await openai.chat.completions.create({
        model: config.modelName,
        messages,
        max_tokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature ?? config.temperature ?? 0.7,
      });

      return {
        text: completion.choices[0]?.message?.content || '',
        provider: 'openai',
        model: config.modelName,
        tokensUsed: completion.usage?.total_tokens,
        latencyMs: 0,
      };
    } catch (error) {
      throw new Error(
        `OpenAI provider not available. Install with: npm install openai`
      );
    }
  }

  /**
   * Call Anthropic Claude API
   */
  private async callAnthropic(request: LLMRequest, config: any): Promise<LLMResponse> {
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey: config.apiKey });

      const message = await anthropic.messages.create({
        model: config.modelName,
        max_tokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature ?? config.temperature ?? 0.7,
        system: request.systemPrompt,
        messages: [{ role: 'user', content: request.prompt }],
      });

      const textContent = message.content.find((block) => block.type === 'text');

      return {
        text: textContent && 'text' in textContent ? textContent.text : '',
        provider: 'anthropic',
        model: config.modelName,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        latencyMs: 0,
      };
    } catch (error) {
      throw new Error(
        `Anthropic provider not available. Install with: npm install @anthropic-ai/sdk`
      );
    }
  }
}

// Singleton instance
let routerInstance: LLMRouter | null = null;

export function getLLMRouter(): LLMRouter {
  if (!routerInstance) {
    routerInstance = new LLMRouter();
  }
  return routerInstance;
}
