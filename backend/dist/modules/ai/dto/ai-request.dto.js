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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingPurposeRequestDto = exports.SuggestionRequestDto = exports.AISessionManagementDto = exports.ChatSessionDto = exports.ChatMessageDto = exports.GenerateReasonRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GenerateReasonRequestDto {
}
exports.GenerateReasonRequestDto = GenerateReasonRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReasonRequestDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReasonRequestDto.prototype, "symptoms", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReasonRequestDto.prototype, "treatmentDetails", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateReasonRequestDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateReasonRequestDto.prototype, "additionalContext", void 0);
class ChatMessageDto {
}
exports.ChatMessageDto = ChatMessageDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ChatMessageDto.prototype, "timestamp", void 0);
class ChatSessionDto {
}
exports.ChatSessionDto = ChatSessionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatSessionDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChatMessageDto),
    __metadata("design:type", Array)
], ChatSessionDto.prototype, "messages", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatSessionDto.prototype, "context", void 0);
class AISessionManagementDto {
}
exports.AISessionManagementDto = AISessionManagementDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AISessionManagementDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AISessionManagementDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AISessionManagementDto.prototype, "lastActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ChatSessionDto),
    __metadata("design:type", ChatSessionDto)
], AISessionManagementDto.prototype, "currentSession", void 0);
class SuggestionRequestDto {
}
exports.SuggestionRequestDto = SuggestionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '生成プロンプト', example: '商談の目的について提案してください' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SuggestionRequestDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '追加コンテキスト情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SuggestionRequestDto.prototype, "context", void 0);
class MeetingPurposeRequestDto {
}
exports.MeetingPurposeRequestDto = MeetingPurposeRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアント情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MeetingPurposeRequestDto.prototype, "clientInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '展示会情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MeetingPurposeRequestDto.prototype, "exhibitionInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'キーワード', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MeetingPurposeRequestDto.prototype, "keywords", void 0);
//# sourceMappingURL=ai-request.dto.js.map