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
exports.FindMeetingsQueryDto = exports.UpdateMeetingDto = exports.CreateMeetingDto = exports.MeetingStatus = void 0;
const class_validator_1 = require("class-validator");
var MeetingStatus;
(function (MeetingStatus) {
    MeetingStatus["PENDING"] = "PENDING";
    MeetingStatus["ACCEPTED"] = "ACCEPTED";
    MeetingStatus["DECLINED"] = "DECLINED";
    MeetingStatus["CANCELED"] = "CANCELED";
    MeetingStatus["COMPLETED"] = "COMPLETED";
})(MeetingStatus || (exports.MeetingStatus = MeetingStatus = {}));
class CreateMeetingDto {
}
exports.CreateMeetingDto = CreateMeetingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '展示会IDは必須です。' }),
    (0, class_validator_1.IsUUID)('4', { message: '展示会IDは有効なUUIDである必要があります。' }),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "exhibitionId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '招待クライアントIDは必須です。' }),
    (0, class_validator_1.IsUUID)('4', { message: '招待クライアントIDは有効なUUIDである必要があります。' }),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '開始日時は必須です。' }),
    (0, class_validator_1.IsDateString)({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", Date)
], CreateMeetingDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '終了日時は必須です。' }),
    (0, class_validator_1.IsDateString)({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", Date)
], CreateMeetingDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'タイトルは文字列である必要があります。' }),
    (0, class_validator_1.MinLength)(1, { message: 'タイトルは1文字以上である必要があります。' }),
    (0, class_validator_1.MaxLength)(255, { message: 'タイトルは255文字以内である必要があります。' }),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '説明は文字列である必要があります。' }),
    (0, class_validator_1.MaxLength)(1000, { message: '説明は1000文字以内である必要があります。' }),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "description", void 0);
class UpdateMeetingDto {
}
exports.UpdateMeetingDto = UpdateMeetingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", Date)
], UpdateMeetingDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", Date)
], UpdateMeetingDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'タイトルは文字列である必要があります。' }),
    (0, class_validator_1.MinLength)(1, { message: 'タイトルは1文字以上である必要があります。' }),
    (0, class_validator_1.MaxLength)(255, { message: 'タイトルは255文字以内である必要があります。' }),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '説明は文字列である必要があります。' }),
    (0, class_validator_1.MaxLength)(1000, { message: '説明は1000文字以内である必要があります。' }),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MeetingStatus, { message: 'ステータスが無効です。' }),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "status", void 0);
class FindMeetingsQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = 'startTime';
        this.sortOrder = 'ASC';
    }
}
exports.FindMeetingsQueryDto = FindMeetingsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: '展示会IDは有効なUUIDである必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "exhibitionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: '主催者IDは有効なUUIDである必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "organizerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'クライアントIDは有効なUUIDである必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MeetingStatus, { message: 'ステータスが無効です。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "dateTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'ページ番号は整数である必要があります。' }),
    (0, class_validator_1.Min)(1, { message: 'ページ番号は1以上である必要があります。' }),
    __metadata("design:type", Number)
], FindMeetingsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: '1ページあたりの件数は整数である必要があります。' }),
    (0, class_validator_1.Min)(1, { message: '1ページあたりの件数は1以上である必要があります。' }),
    (0, class_validator_1.Max)(100, { message: '1ページあたりの件数は100以下である必要があります。' }),
    __metadata("design:type", Number)
], FindMeetingsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: 'ソート順はASCまたはDESCである必要があります。' }),
    __metadata("design:type", String)
], FindMeetingsQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=meeting.dto.js.map