"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServiceConfigManager = exports.defaultConfig = void 0;
exports.defaultConfig = {
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
const prompt_templates_1 = require("./prompt-templates");
class AIServiceConfigManager {
    constructor(customConfig) {
        this.config = {
            ...exports.defaultConfig,
            ...customConfig
        };
    }
    getGeminiConfig() {
        return this.config.gemini;
    }
    getEmbeddingConfig() {
        return this.config.embedding;
    }
    getTimeoutConfig() {
        return {
            timeoutMs: this.config.timeoutMs,
            retryAttempts: this.config.retryAttempts,
            retryDelayMs: this.config.retryDelayMs
        };
    }
    getPromptTemplate(templateKey) {
        return prompt_templates_1.promptTemplates[templateKey];
    }
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
    }
    validateConfig() {
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
exports.AIServiceConfigManager = AIServiceConfigManager;
//# sourceMappingURL=ai-service-config.js.map