import { AiService } from './ai.service';
import { SuggestionRequestDto, MeetingPurposeRequestDto } from './dto/ai-request.dto';
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateSuggestion(request: SuggestionRequestDto): Promise<{
        result: string;
    }>;
    generateMeetingPurpose(request: MeetingPurposeRequestDto): Promise<{
        suggestions: string[];
    }>;
}
