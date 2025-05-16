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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
class VertexAiService {
    async generateText(prompt) {
        return `モックAI応答: ${prompt.substring(0, 50)}...`;
    }
}
class PromptTemplatesService {
    enhancePromptWithContext(prompt, context) {
        return `${prompt} [コンテキスト: ${JSON.stringify(context).substring(0, 50)}...]`;
    }
    generateMeetingPurposePrompt(clientInfo, exhibitionInfo, keywords) {
        return `商談目的生成: ${JSON.stringify({ clientInfo, exhibitionInfo, keywords }).substring(0, 50)}...`;
    }
    generateReasonLetterPrompt(patientInfo, injuryDetails, treatmentDetails, relevantReceipts) {
        return `理由書生成: ${JSON.stringify({ patientInfo, injuryDetails, treatmentDetails }).substring(0, 50)}...`;
    }
    generateChatPrompt(history, message) {
        return `チャット: ${message}`;
    }
}
class ReceiptService {
    async findRelevantReceipts(query) {
        return [];
    }
}
class InteractionRepository {
    async saveInteraction(data) {
        console.log('モック保存:', JSON.stringify(data).substring(0, 100));
    }
    async getInteractionsBySessionId(sessionId) {
        return [];
    }
}
let AiService = AiService_1 = class AiService {
    constructor() {
        this.logger = new common_1.Logger(AiService_1.name);
        this.vertexAiService = new VertexAiService();
        this.promptTemplatesService = new PromptTemplatesService();
        this.receiptService = new ReceiptService();
        this.interactionRepository = new InteractionRepository();
    }
    async generateSuggestion(prompt, context) {
        this.logger.log('AIによる提案生成を開始します');
        const mockSuggestion = "これはモックAIによる提案です。実際のAIサービスが連携されると、リクエストに基づいた提案が生成されます。";
        try {
            await this.interactionRepository.saveInteraction({
                sessionId: 'suggestion',
                request: JSON.stringify({ prompt, context }),
                prompt: prompt,
                response: mockSuggestion,
                type: 'suggestion_generation',
            });
            return mockSuggestion;
        }
        catch (error) {
            this.logger.error(`AI提案生成中にエラーが発生しました: ${error.message}`);
            throw new Error('AI提案の生成に失敗しました');
        }
    }
    async generateMeetingPurpose(clientInfo, exhibitionInfo, keywords) {
        this.logger.log('商談目的文の生成支援を開始します');
        try {
            let mockSuggestions = [
                "貴社の製品・サービスと弊社の技術を組み合わせた新たなビジネスモデルの可能性について協議するため",
                "業界動向の情報交換と今後の協業可能性を探るため",
                "貴社の課題に対する弊社のソリューション提案と導入検討のため",
            ];
            if (exhibitionInfo && exhibitionInfo.name) {
                mockSuggestions.push(`${exhibitionInfo.name}で展示される貴社の新製品・サービスについての詳細な説明を受け、導入検討のため`);
                mockSuggestions.push(`${exhibitionInfo.name}を機に、両社の強みを活かした業務提携の可能性について協議するため`);
            }
            if (keywords && keywords.length > 0) {
                const keywordText = keywords.join('、');
                mockSuggestions.push(`${keywordText}に関する両社の知見を共有し、市場開拓の可能性を検討するため`);
            }
            if (clientInfo && clientInfo.industry) {
                switch (clientInfo.industry) {
                    case 'IT・通信':
                        mockSuggestions.push("最新IT技術を活用した業務効率化ソリューションの導入検討のため");
                        mockSuggestions.push("デジタルトランスフォーメーション推進に向けた戦略的パートナーシップの可能性を協議するため");
                        break;
                    case '製造':
                        mockSuggestions.push("製造工程の自動化・効率化に関するソリューション提案と導入検討のため");
                        mockSuggestions.push("サプライチェーン最適化に向けた協業可能性の協議のため");
                        break;
                    case '金融・保険':
                        mockSuggestions.push("フィンテック技術を活用した新サービス開発の協業可能性を協議するため");
                        mockSuggestions.push("セキュリティ強化とコンプライアンス対応に関するソリューション提案のため");
                        break;
                    default:
                        mockSuggestions.push(`${clientInfo.industry}業界における課題解決に向けた弊社ソリューションの提案と導入検討のため`);
                }
            }
            await this.interactionRepository.saveInteraction({
                sessionId: 'meeting_purpose',
                request: JSON.stringify({ clientInfo, exhibitionInfo, keywords }),
                prompt: JSON.stringify({ clientInfo, exhibitionInfo, keywords }),
                response: JSON.stringify(mockSuggestions),
                type: 'meeting_purpose_generation',
            });
            this.logger.log(`商談目的文の候補 ${mockSuggestions.length} 件を生成しました`);
            return mockSuggestions;
        }
        catch (error) {
            this.logger.error(`商談目的文生成中にエラーが発生しました: ${error.message}`);
            throw new Error('商談目的文の生成に失敗しました');
        }
    }
    extractSuggestionsFromResponse(response) {
        const lines = response.split('\n').filter(line => line.trim().length > 0);
        const cleanedSuggestions = lines.map(line => {
            return line.replace(/^[・\-\*\d]+[\.\):]?\s*/, '').trim();
        });
        return [...new Set(cleanedSuggestions)];
    }
    async generateReasonLetter(generateReasonLetterDto) {
        this.logger.log('理由書生成処理を開始します（モック）');
        const mockResponse = "これはモックの理由書です。実際のAIサービスが連携されると、患者情報や傷病詳細に基づいた理由書が生成されます。";
        await this.interactionRepository.saveInteraction({
            sessionId: generateReasonLetterDto.sessionId,
            request: JSON.stringify(generateReasonLetterDto),
            prompt: "モック理由書プロンプト",
            response: mockResponse,
            type: 'reason_letter_generation',
        });
        return mockResponse;
    }
    async handleChatMessage(sessionId, message) {
        this.logger.log(`チャットメッセージ処理を開始します（モック）`);
        const mockResponse = `これはモックのチャット応答です。メッセージ「${message.substring(0, 50)}...」に対する回答です。`;
        await this.interactionRepository.saveInteraction({
            sessionId,
            request: message,
            prompt: message,
            response: mockResponse,
            type: 'chat_message',
        });
        return mockResponse;
    }
    async getChatHistory(sessionId) {
        this.logger.log(`チャット履歴取得を開始します（モック）`);
        return [
            {
                sessionId,
                request: "モックリクエスト1",
                response: "モック応答1",
                createdAt: new Date().toISOString()
            },
            {
                sessionId,
                request: "モックリクエスト2",
                response: "モック応答2",
                createdAt: new Date().toISOString()
            }
        ];
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map