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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../user/guards/auth.guard");
const ai_request_dto_1 = require("./dto/ai-request.dto");
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.limit = 10;
        this.timeWindow = 60 * 1000;
    }
    check(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId);
        if (!userRequests) {
            this.requests.set(userId, { count: 1, timestamp: now });
            return true;
        }
        if (now - userRequests.timestamp > this.timeWindow) {
            this.requests.set(userId, { count: 1, timestamp: now });
            return true;
        }
        if (userRequests.count >= this.limit) {
            return false;
        }
        this.requests.set(userId, { count: userRequests.count + 1, timestamp: userRequests.timestamp });
        return true;
    }
}
const rateLimiter = new RateLimiter();
let AIController = class AIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateSuggestion(request) {
        const userId = 'user-id';
        if (!rateLimiter.check(userId)) {
            throw new common_1.HttpException('リクエスト回数制限を超えました。しばらく時間を置いてお試しください', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const maxPromptLength = 1000;
        if (request.prompt.length > maxPromptLength) {
            throw new common_1.HttpException(`プロンプトが長すぎます。${maxPromptLength}文字以内で入力してください`, common_1.HttpStatus.BAD_REQUEST);
        }
        const { prompt, context } = request;
        const result = await this.aiService.generateSuggestion(prompt, context);
        return { result };
    }
    async generateMeetingPurpose(request) {
        const userId = 'user-id';
        if (!rateLimiter.check(userId)) {
            throw new common_1.HttpException('リクエスト回数制限を超えました。しばらく時間を置いてお試しください', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const { clientInfo, exhibitionInfo, keywords } = request;
        if (keywords && keywords.length > 10) {
            throw new common_1.HttpException('キーワードは10個以内で指定してください', common_1.HttpStatus.BAD_REQUEST);
        }
        const suggestions = await this.aiService.generateMeetingPurpose(clientInfo, exhibitionInfo, keywords);
        return { suggestions };
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'AIによる提案生成' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI生成結果を返却' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_request_dto_1.SuggestionRequestDto]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateSuggestion", null);
__decorate([
    (0, common_1.Post)('meeting-purpose'),
    (0, swagger_1.ApiOperation)({ summary: '商談目的文の生成支援' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '商談目的文の候補を返却' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_request_dto_1.MeetingPurposeRequestDto]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateMeetingPurpose", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AIController);
//# sourceMappingURL=ai.controller.js.map