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
exports.ExhibitionDto = exports.UpdateExhibitionDto = exports.CreateExhibitionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateExhibitionDto {
    constructor() {
        this.isPublic = false;
    }
}
exports.CreateExhibitionDto = CreateExhibitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '展示会名', example: '東京ビジネス展示会2025' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '説明', example: 'ビジネスマッチングを目的とした展示会' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開始日', example: '2025-07-15' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '終了日', example: '2025-07-17' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開催場所', example: '東京国際フォーラム' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '公開フラグ', example: true, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateExhibitionDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '追加情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExhibitionDto.prototype, "additionalInfo", void 0);
class UpdateExhibitionDto {
}
exports.UpdateExhibitionDto = UpdateExhibitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '展示会名', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '説明', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開始日', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '終了日', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開催場所', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '公開フラグ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateExhibitionDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '追加情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExhibitionDto.prototype, "additionalInfo", void 0);
class ExhibitionDto {
}
exports.ExhibitionDto = ExhibitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '展示会ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '展示会名' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '説明' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開始日' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '終了日' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開催場所' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '公開フラグ' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExhibitionDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '追加情報', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "additionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成日時' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新日時' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExhibitionDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=exhibition.dto.js.map