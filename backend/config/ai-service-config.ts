export interface GeminiConfig {
  apiEndpoint: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stopSequences: string[];
}

export interface EmbeddingConfig {
  modelName: string;
  dimensions: number;
  batchSize: number;
}

export interface AIServiceConfig {
  gemini: GeminiConfig;
  embedding: EmbeddingConfig;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

export const defaultConfig: AIServiceConfig = {
  gemini: {
    apiEndpoint: process.env.GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com',
    modelName: 'gemini-pro',
    maxTokens: 1024,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
    stopSequences: ['###']
  },
  embedding: {
    modelName: 'textembedding-gecko',
    dimensions: 768,
    batchSize: 5
  },
  timeoutMs: 30000,
  retryAttempts: 3,
  retryDelayMs: 1000
};

import { promptTemplates } from './prompt-templates';

export class AIServiceConfigManager {
  private config: AIServiceConfig;

  constructor(customConfig?: Partial<AIServiceConfig>) {
    this.config = {
      ...defaultConfig,
      ...customConfig
    };
  }

  public getGeminiConfig(): GeminiConfig {
    return this.config.gemini;
  }

  public getEmbeddingConfig(): EmbeddingConfig {
    return this.config.embedding;
  }

  public getTimeoutConfig(): { timeoutMs: number; retryAttempts: number; retryDelayMs: number } {
    return {
      timeoutMs: this.config.timeoutMs,
      retryAttempts: this.config.retryAttempts,
      retryDelayMs: this.config.retryDelayMs
    };
  }

  public getPromptTemplate(templateKey: keyof typeof promptTemplates): string {
    return promptTemplates[templateKey];
  }

  public updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }

  public validateConfig(): boolean {
    const { gemini, embedding, timeoutMs, retryAttempts, retryDelayMs } = this.config;

    if (!gemini.apiEndpoint || !gemini.modelName) {
      throw new Error('Invalid Gemini configuration');
    }

    if (!embedding.modelName || embedding.dimensions <= 0) {
      throw new Error('Invalid embedding configuration');
    }

    if (timeoutMs <= 0 || retryAttempts < 0 || retryDelayMs < 0) {
      throw new Error('Invalid timeout or retry configuration');
    }

    return true;
  }
}