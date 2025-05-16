"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexAiService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_config_1 = require("../../config/ai-service-config");
class MockVertexAI {
    constructor(config) {
        this.config = config;
    }
    getGenerativeModel(params) {
        console.log(`MockVertexAI: Initializing generative model ${params.model}`);
        return new MockGenerativeModel(params.model);
    }
    getEmbeddingModel(params) {
        console.log(`MockVertexAI: Initializing embedding model ${params.model}`);
        return new MockEmbeddingModel(params.model);
    }
}
class MockGenerativeModel {
    constructor(modelName) {
        this.modelName = modelName;
    }
    async generateContent(prompt) {
        console.log(`MockGenerativeModel: Generating content with ${this.modelName} for prompt: "${prompt.substring(0, 50)}..."`);
        return {
            response: {
                text: () => `Generated content based on prompt: "${prompt}"`
            }
        };
    }
}
class MockEmbeddingModel {
    constructor(modelName) {
        this.modelName = modelName;
    }
    async embedContent(params) {
        const textToEmbed = params.content.parts[0].text;
        console.log(`MockEmbeddingModel: Generating embedding with ${this.modelName} for text: "${textToEmbed.substring(0, 50)}..."`);
        return {
            values: Array(768).fill(Math.random())
        };
    }
}
let VertexAiService = class VertexAiService {
    constructor(configService) {
        this.configService = configService;
        const vertexAiConfig = this.configService.getVertexAiConfig();
        this.vertexAI = new MockVertexAI(vertexAiConfig);
        this.generativeModel = this.vertexAI.getGenerativeModel({ model: vertexAiConfig.generativeModel });
        this.embeddingModel = this.vertexAI.getEmbeddingModel({ model: vertexAiConfig.embeddingModel });
    }
    async generateContent(prompt) {
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const result = await this.generativeModel.generateContent(prompt);
                if (!result || !result.response || typeof result.response.text !== 'function') {
                    throw new Error('Invalid API response structure');
                }
                return result.response.text();
            }
            catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed to generate content: ${error.message}`);
                if (attempt >= maxRetries) {
                    throw new Error(`Failed to generate content after ${maxRetries} attempts: ${error.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
        throw new Error('Unexpected error during content generation after retries');
    }
    async getEmbeddings(text) {
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const result = await this.embeddingModel.embedContent({
                    content: {
                        role: 'user',
                        parts: [{ text: text }]
                    }
                });
                if (!result || !Array.isArray(result.values)) {
                    throw new Error('Invalid API response structure for embeddings');
                }
                return result.values;
            }
            catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed to get embeddings: ${error.message}`);
                if (attempt >= maxRetries) {
                    throw new Error(`Failed to get embeddings after ${maxRetries} attempts: ${error.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
        throw new Error('Unexpected error during embedding generation after retries');
    }
};
exports.VertexAiService = VertexAiService;
exports.VertexAiService = VertexAiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_service_config_1.AiServiceConfigService !== "undefined" && ai_service_config_1.AiServiceConfigService) === "function" ? _a : Object])
], VertexAiService);
//# sourceMappingURL=vertex-ai.service.js.map