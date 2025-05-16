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
exports.ClientDto = exports.UpdateClientDto = exports.CreateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateClientDto {
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント名',
        example: '株式会社サンプル',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント担当者名',
        example: '山田太郎',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアントメールアドレス',
        example: 'contact@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント電話番号',
        example: '03-1234-5678',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phoneNumber", void 0);
class UpdateClientDto {
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント名',
        example: '株式会社サンプルネクスト',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント担当者名',
        example: '鈴木一郎',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアントメールアドレス',
        example: 'new-contact@example.com',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'クライアント電話番号',
        example: '03-9876-5432',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phoneNumber", void 0);
class ClientDto {
}
exports.ClientDto = ClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアントID', example: 'cl_xxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], ClientDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアント名', example: '株式会社サンプル' }),
    __metadata("design:type", String)
], ClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアント担当者名', example: '山田太郎' }),
    __metadata("design:type", String)
], ClientDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアントメールアドレス', example: 'contact@example.com' }),
    __metadata("design:type", String)
], ClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'クライアント電話番号', example: '03-1234-5678' }),
    __metadata("design:type", String)
], ClientDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成日時', example: '2025-05-15T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ClientDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新日時', example: '2025-05-16T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ClientDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=client.dto.js.map