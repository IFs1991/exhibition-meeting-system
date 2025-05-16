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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const receipt_service_1 = require("./receipt.service");
const receipt_dto_1 = require("./dto/receipt.dto");
const auth_guard_1 = require("../user/guards/auth.guard");
let ReceiptController = class ReceiptController {
    constructor(receiptService) {
        this.receiptService = receiptService;
    }
    async createReceipt(createReceiptDto) {
        return await this.receiptService.createReceipt(createReceiptDto);
    }
    async searchReceipts(searchDto) {
        return await this.receiptService.searchReceipts(searchDto);
    }
    async getReceipt(id) {
        return await this.receiptService.getReceiptById(id);
    }
    async updateReceipt(id, updateReceiptDto) {
        return await this.receiptService.updateReceipt(id, updateReceiptDto);
    }
    async deleteReceipt(id) {
        return await this.receiptService.deleteReceipt(id);
    }
    async manageTags(tagDto) {
        return await this.receiptService.manageTags(tagDto);
    }
    async getTagSuggestions(keyword) {
        return await this.receiptService.getTagSuggestions(keyword);
    }
};
exports.ReceiptController = ReceiptController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '事例登録' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '事例が正常に登録されました' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof receipt_dto_1.CreateReceiptDto !== "undefined" && receipt_dto_1.CreateReceiptDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "createReceipt", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: '事例検索' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '検索結果を返却' }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof receipt_dto_1.SearchReceiptDto !== "undefined" && receipt_dto_1.SearchReceiptDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "searchReceipts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '事例詳細取得' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '事例詳細を返却' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getReceipt", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '事例更新' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '事例が正常に更新されました' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof receipt_dto_1.UpdateReceiptDto !== "undefined" && receipt_dto_1.UpdateReceiptDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "updateReceipt", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '事例削除' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '事例が正常に削除されました' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "deleteReceipt", null);
__decorate([
    (0, common_1.Post)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'タグ管理' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'タグが正常に処理されました' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof receipt_dto_1.TagManagementDto !== "undefined" && receipt_dto_1.TagManagementDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "manageTags", null);
__decorate([
    (0, common_1.Get)('tags/suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'タグ候補取得' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'タグ候補を返却' }),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getTagSuggestions", null);
exports.ReceiptController = ReceiptController = __decorate([
    (0, swagger_1.ApiTags)('receipts'),
    (0, common_1.Controller)('receipts'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [receipt_service_1.ReceiptService])
], ReceiptController);
//# sourceMappingURL=receipt.controller.js.map