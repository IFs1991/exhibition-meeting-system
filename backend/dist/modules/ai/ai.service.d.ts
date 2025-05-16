interface GenerateReasonLetterDto {
    patientInfo: any;
    injuryDetails: any;
    treatmentDetails: any;
    sessionId: string;
}
export declare class AiService {
    private readonly logger;
    private readonly vertexAiService;
    private readonly promptTemplatesService;
    private readonly receiptService;
    private readonly interactionRepository;
    constructor();
    generateSuggestion(prompt: string, context?: any): Promise<string>;
    generateMeetingPurpose(clientInfo?: any, exhibitionInfo?: any, keywords?: string[]): Promise<string[]>;
    private extractSuggestionsFromResponse;
    generateReasonLetter(generateReasonLetterDto: GenerateReasonLetterDto): Promise<string>;
    handleChatMessage(sessionId: string, message: string): Promise<string>;
    getChatHistory(sessionId: string): Promise<any[]>;
}
export {};
