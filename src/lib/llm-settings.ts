/**
 * LLM Settings Storage Service
 * Manages API keys and provider configuration in localStorage (MVP)
 * Can be upgraded to database storage later
 */

import type { LLMSettings, LLMConfig, LLMProvider, TaskType } from './llm-types';
import { DEFAULT_LLM_SETTINGS, PROVIDER_CAPABILITIES } from './llm-types';

const STORAGE_KEY = 'llm-settings-v1';

export class LLMSettingsService {
  private settings: LLMSettings;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.settings = this.loadSettings();
  }

  /**
   * Load settings from localStorage or return defaults
   */
  private loadSettings(): LLMSettings {
    if (!this.isClient) {
      return DEFAULT_LLM_SETTINGS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load LLM settings:', error);
    }

    return DEFAULT_LLM_SETTINGS;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    if (!this.isClient) return;

    try {
      this.settings.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save LLM settings:', error);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): LLMSettings {
    return { ...this.settings };
  }

  /**
   * Get configuration for a specific provider
   */
  getProviderConfig(provider: LLMProvider): LLMConfig | null {
    return this.settings.providers[provider];
  }

  /**
   * Set configuration for a provider
   */
  setProviderConfig(provider: LLMProvider, config: Partial<LLMConfig>): void {
    const capabilities = PROVIDER_CAPABILITIES[provider];

    this.settings.providers[provider] = {
      provider,
      apiKey: config.apiKey || '',
      modelName: config.modelName || capabilities.defaultModel,
      enabled: config.enabled ?? false,
      maxTokens: config.maxTokens || 1000,
      temperature: config.temperature ?? 0.7,
      priority: config.priority ?? 1,
    };

    this.saveSettings();
  }

  /**
   * Remove a provider configuration
   */
  removeProviderConfig(provider: LLMProvider): void {
    this.settings.providers[provider] = null;
    this.saveSettings();
  }

  /**
   * Get the best provider for a given task type
   */
  getProviderForTask(taskType: TaskType): LLMProvider {
    // First, try the configured routing
    const routedProvider = this.settings.routing[taskType];
    const routedConfig = this.settings.providers[routedProvider];

    if (routedConfig?.enabled && routedConfig.apiKey) {
      return routedProvider;
    }

    // Find the best enabled provider for this task
    const capabilities = PROVIDER_CAPABILITIES;
    const enabledProviders = Object.entries(this.settings.providers)
      .filter(([_, config]) => config?.enabled && config.apiKey)
      .map(([provider]) => provider as LLMProvider)
      .sort((a, b) => {
        const aConfig = this.settings.providers[a]!;
        const bConfig = this.settings.providers[b]!;
        return aConfig.priority - bConfig.priority;
      });

    // Find provider that lists this task as a strength
    for (const provider of enabledProviders) {
      if (capabilities[provider].strengths.includes(taskType)) {
        return provider;
      }
    }

    // Return first enabled provider
    if (enabledProviders.length > 0) {
      return enabledProviders[0];
    }

    // Fallback
    return this.settings.fallbackProvider;
  }

  /**
   * Update routing configuration
   */
  setRouting(taskType: TaskType, provider: LLMProvider): void {
    this.settings.routing[taskType] = provider;
    this.saveSettings();
  }

  /**
   * Set fallback provider
   */
  setFallbackProvider(provider: LLMProvider): void {
    this.settings.fallbackProvider = provider;
    this.saveSettings();
  }

  /**
   * Get list of enabled providers
   */
  getEnabledProviders(): LLMProvider[] {
    return Object.entries(this.settings.providers)
      .filter(([_, config]) => config?.enabled && config.apiKey)
      .map(([provider]) => provider as LLMProvider);
  }

  /**
   * Check if any provider is configured
   */
  hasAnyProvider(): boolean {
    return this.getEnabledProviders().length > 0;
  }

  /**
   * Export settings (for backup/sharing)
   */
  exportSettings(): string {
    // Remove API keys for security
    const sanitized = {
      ...this.settings,
      providers: Object.fromEntries(
        Object.entries(this.settings.providers).map(([key, config]) => [
          key,
          config ? { ...config, apiKey: '***' } : null,
        ])
      ),
    };
    return JSON.stringify(sanitized, null, 2);
  }

  /**
   * Import settings (without API keys)
   */
  importSettings(jsonString: string): void {
    try {
      const imported = JSON.parse(jsonString) as LLMSettings;

      // Merge with existing settings, keeping API keys
      Object.entries(imported.providers).forEach(([provider, config]) => {
        if (config) {
          const existing = this.settings.providers[provider as LLMProvider];
          this.settings.providers[provider as LLMProvider] = {
            ...config,
            apiKey: existing?.apiKey || '', // Preserve existing API key
          };
        }
      });

      this.settings.routing = imported.routing;
      this.settings.fallbackProvider = imported.fallbackProvider;

      this.saveSettings();
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('Invalid settings format');
    }
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    this.settings = DEFAULT_LLM_SETTINGS;
    if (this.isClient) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

// Singleton instance
let instance: LLMSettingsService | null = null;

export function getLLMSettingsService(): LLMSettingsService {
  if (!instance) {
    instance = new LLMSettingsService();
  }
  return instance;
}
