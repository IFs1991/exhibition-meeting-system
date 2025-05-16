import { AiServiceConfigService } from '../../config/ai-service-config';
export declare class VertexAiService {
    private readonly configService;
    private vertexAI;
    private generativeModel;
    private embeddingModel;
    constructor(configService: AiServiceConfigService);
    generateContent(prompt: string): Promise<string>;
    getEmbeddings(text: string): Promise<number[]>;
}
