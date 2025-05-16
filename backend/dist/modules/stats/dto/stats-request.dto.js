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
exports.TimeSeriesRequestDto = exports.StatsRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StatsRequestDto {
}
exports.StatsRequestDto = StatsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開始日', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StatsRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '終了日', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StatsRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'フィルター条件', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StatsRequestDto.prototype, "filter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'グループ化パラメータ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StatsRequestDto.prototype, "groupBy", void 0);
class TimeSeriesRequestDto {
}
exports.TimeSeriesRequestDto = TimeSeriesRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '開始日', required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TimeSeriesRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '終了日', required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TimeSeriesRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '測定対象指標', required: true, enum: ['meetings', 'clients', 'conversions'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['meetings', 'clients', 'conversions']),
    __metadata("design:type", String)
], TimeSeriesRequestDto.prototype, "metric", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'グループ化パラメータ', required: false, enum: ['day', 'week', 'month'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['day', 'week', 'month']),
    __metadata("design:type", String)
], TimeSeriesRequestDto.prototype, "groupBy", void 0);
//# sourceMappingURL=stats-request.dto.js.map