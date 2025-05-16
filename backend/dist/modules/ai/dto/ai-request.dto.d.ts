export declare class GenerateReasonRequestDto {
    patientId: string;
    symptoms: string;
    treatmentDetails: string;
    tags?: string[];
    additionalContext?: string;
}
export declare class ChatMessageDto {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}
export declare class ChatSessionDto {
    sessionId: string;
    messages: ChatMessageDto[];
    context?: string;
}
export declare class AISessionManagementDto {
    sessionId: string;
    userId: string;
    lastActive: Date;
    currentSession?: ChatSessionDto;
}
export declare class SuggestionRequestDto {
    prompt: string;
    context?: any;
}
export declare class MeetingPurposeRequestDto {
    clientInfo?: any;
    exhibitionInfo?: any;
    keywords?: string[];
}
