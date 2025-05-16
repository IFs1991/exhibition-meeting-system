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
export declare const defaultConfig: AIServiceConfig;
import { promptTemplates } from './prompt-templates';
export declare class AIServiceConfigManager {
    private config;
    constructor(customConfig?: Partial<AIServiceConfig>);
    getGeminiConfig(): GeminiConfig;
    getEmbeddingConfig(): EmbeddingConfig;
    getTimeoutConfig(): {
        timeoutMs: number;
        retryAttempts: number;
        retryDelayMs: number;
    };
    getPromptTemplate(templateKey: keyof typeof promptTemplates): string;
    updateConfig(newConfig: Partial<AIServiceConfig>): void;
    validateConfig(): boolean;
}
