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
exports.SearchFeedbackDto = exports.ReportResultDto = exports.CreateFeedbackDto = exports.FeedbackStatus = exports.FeedbackType = void 0;
const class_validator_1 = require("class-validator");
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["APPROVAL"] = "\u627F\u8A8D";
    FeedbackType["REJECTION"] = "\u8FD4\u623B";
    FeedbackType["SUGGESTION"] = "\u63D0\u6848";
    FeedbackType["OTHER"] = "\u305D\u306E\u4ED6";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus["PENDING"] = "\u51E6\u7406\u5F85\u3061";
    FeedbackStatus["PROCESSED"] = "\u51E6\u7406\u6E08\u307F";
    FeedbackStatus["ARCHIVED"] = "\u30A2\u30FC\u30AB\u30A4\u30D6\u6E08\u307F";
})(FeedbackStatus || (exports.FeedbackStatus = FeedbackStatus = {}));
class CreateFeedbackDto {
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "receiptId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(FeedbackType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "additionalNotes", void 0);
class ReportResultDto {
}
exports.ReportResultDto = ReportResultDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportResultDto.prototype, "feedbackId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(FeedbackStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportResultDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ReportResultDto.prototype, "processingResult", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], ReportResultDto.prototype, "processedAt", void 0);
class SearchFeedbackDto {
}
exports.SearchFeedbackDto = SearchFeedbackDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FeedbackType),
    __metadata("design:type", String)
], SearchFeedbackDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FeedbackStatus),
    __metadata("design:type", String)
], SearchFeedbackDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SearchFeedbackDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SearchFeedbackDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SearchFeedbackDto.prototype, "keyword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchFeedbackDto.prototype, "receiptId", void 0);
//# sourceMappingURL=feedback.dto.js.map