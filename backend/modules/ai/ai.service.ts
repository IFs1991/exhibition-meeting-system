import { Injectable, Logger } from '@nestjs/common';

// モック実装のための簡易クラス定義
class VertexAiService {
  async generateText(prompt: string): Promise<string> {
    return `モックAI応答: ${prompt.substring(0, 50)}...`;
  }
}

class PromptTemplatesService {
  enhancePromptWithContext(prompt: string, context: any): string {
    return `${prompt} [コンテキスト: ${JSON.stringify(context).substring(0, 50)}...]`;
  }

  generateMeetingPurposePrompt(clientInfo?: any, exhibitionInfo?: any, keywords?: string[]): string {
    return `商談目的生成: ${JSON.stringify({ clientInfo, exhibitionInfo, keywords }).substring(0, 50)}...`;
  }

  generateReasonLetterPrompt(patientInfo: any, injuryDetails: any, treatmentDetails: any, relevantReceipts: any[]): string {
    return `理由書生成: ${JSON.stringify({ patientInfo, injuryDetails, treatmentDetails }).substring(0, 50)}...`;
  }

  generateChatPrompt(history: any[], message: string): string {
    return `チャット: ${message}`;
  }
}

class ReceiptService {
  async findRelevantReceipts(query: any): Promise<any[]> {
    return [];
  }
}

class InteractionRepository {
  async saveInteraction(data: any): Promise<void> {
    console.log('モック保存:', JSON.stringify(data).substring(0, 100));
  }

  async getInteractionsBySessionId(sessionId: string): Promise<any[]> {
    return [];
  }
}

// モック用のDTO
interface GenerateReasonLetterDto {
  patientInfo: any;
  injuryDetails: any;
  treatmentDetails: any;
  sessionId: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly vertexAiService: VertexAiService;
  private readonly promptTemplatesService: PromptTemplatesService;
  private readonly receiptService: ReceiptService;
  private readonly interactionRepository: InteractionRepository;

  constructor() {
    // モックサービスのインスタンス化
    this.vertexAiService = new VertexAiService();
    this.promptTemplatesService = new PromptTemplatesService();
    this.receiptService = new ReceiptService();
    this.interactionRepository = new InteractionRepository();
  }

  /**
   * AIによる提案生成
   * @param prompt - 生成プロンプト
   * @param context - 追加コンテキスト情報（オプション）
   * @returns 生成されたテキスト
   */
  async generateSuggestion(prompt: string, context?: any): Promise<string> {
    this.logger.log('AIによる提案生成を開始します');

    // モック実装
    const mockSuggestion = "これはモックAIによる提案です。実際のAIサービスが連携されると、リクエストに基づいた提案が生成されます。";

    try {
      // 対話履歴保存
      await this.interactionRepository.saveInteraction({
        sessionId: 'suggestion',
        request: JSON.stringify({ prompt, context }),
        prompt: prompt,
        response: mockSuggestion,
        type: 'suggestion_generation',
      });

      return mockSuggestion;
    } catch (error) {
      this.logger.error(`AI提案生成中にエラーが発生しました: ${error.message}`);
      throw new Error('AI提案の生成に失敗しました');
    }
  }

  /**
   * 商談目的文の生成支援
   * @param clientInfo - クライアント情報
   * @param exhibitionInfo - 展示会情報
   * @param keywords - キーワード配列
   * @returns 生成された商談目的文の候補配列
   */
  async generateMeetingPurpose(
    clientInfo?: any,
    exhibitionInfo?: any,
    keywords?: string[]
  ): Promise<string[]> {
    this.logger.log('商談目的文の生成支援を開始します');

    try {
      // AIサービスとの連携がまだ準備できていないため、モックデータを返す
      // 後でVertexAIなどの実際のAIサービスと連携するコードに置き換える

      // 展示会情報に基づいたモック応答を生成
      let mockSuggestions: string[] = [
        "貴社の製品・サービスと弊社の技術を組み合わせた新たなビジネスモデルの可能性について協議するため",
        "業界動向の情報交換と今後の協業可能性を探るため",
        "貴社の課題に対する弊社のソリューション提案と導入検討のため",
      ];

      // 展示会情報が提供されている場合は展示会名を含める
      if (exhibitionInfo && exhibitionInfo.name) {
        mockSuggestions.push(`${exhibitionInfo.name}で展示される貴社の新製品・サービスについての詳細な説明を受け、導入検討のため`);
        mockSuggestions.push(`${exhibitionInfo.name}を機に、両社の強みを活かした業務提携の可能性について協議するため`);
      }

      // キーワードが提供されている場合はそれを含める
      if (keywords && keywords.length > 0) {
        const keywordText = keywords.join('、');
        mockSuggestions.push(`${keywordText}に関する両社の知見を共有し、市場開拓の可能性を検討するため`);
      }

      // クライアント情報が提供されている場合は業種に合わせた提案を追加
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

      // 対話履歴保存（実際のAI応答がないため、モックデータのJSONを保存）
      await this.interactionRepository.saveInteraction({
        sessionId: 'meeting_purpose',
        request: JSON.stringify({ clientInfo, exhibitionInfo, keywords }),
        prompt: JSON.stringify({ clientInfo, exhibitionInfo, keywords }),
        response: JSON.stringify(mockSuggestions),
        type: 'meeting_purpose_generation',
      });

      this.logger.log(`商談目的文の候補 ${mockSuggestions.length} 件を生成しました`);
      return mockSuggestions;
    } catch (error) {
      this.logger.error(`商談目的文生成中にエラーが発生しました: ${error.message}`);
      throw new Error('商談目的文の生成に失敗しました');
    }
  }

  /**
   * AI応答から提案候補を抽出
   * @param response - AIからの応答テキスト
   * @returns 抽出された提案候補の配列
   */
  private extractSuggestionsFromResponse(response: string): string[] {
    // 簡易的な実装: 行ごとに分割し、空行を除外
    const lines = response.split('\n').filter(line => line.trim().length > 0);

    // 箇条書きなどの記号を除去
    const cleanedSuggestions = lines.map(line => {
      return line.replace(/^[・\-\*\d]+[\.\):]?\s*/, '').trim();
    });

    // 重複を除去
    return [...new Set(cleanedSuggestions)];
  }

  /**
   * 理由書を生成する（モック実装）
   */
  async generateReasonLetter(generateReasonLetterDto: GenerateReasonLetterDto): Promise<string> {
    this.logger.log('理由書生成処理を開始します（モック）');

    // モック応答
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

  /**
   * チャットメッセージを処理し、AIからの応答を取得する（モック実装）
   */
  async handleChatMessage(sessionId: string, message: string): Promise<string> {
    this.logger.log(`チャットメッセージ処理を開始します（モック）`);

    // モック応答
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

  /**
   * 特定のセッションのチャット履歴を取得する（モック実装）
   */
  async getChatHistory(sessionId: string): Promise<any[]> {
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
}