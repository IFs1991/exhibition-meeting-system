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
exports.ExhibitionController = void 0;
const common_1 = require("@nestjs/common");
const exhibition_service_1 = require("./exhibition.service");
const exhibition_dto_1 = require("./dto/exhibition.dto");
const auth_guard_1 = require("../user/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
let ExhibitionController = class ExhibitionController {
    constructor(exhibitionService) {
        this.exhibitionService = exhibitionService;
    }
    create(createExhibitionDto) {
        return this.exhibitionService.create(createExhibitionDto);
    }
    findAll(query) {
        return this.exhibitionService.findAll(query);
    }
    findOne(id) {
        return this.exhibitionService.findOne(id);
    }
    update(id, updateExhibitionDto) {
        return this.exhibitionService.update(id, updateExhibitionDto);
    }
    remove(id) {
        return this.exhibitionService.remove(id);
    }
    getRelatedClients(id, query) {
        return this.exhibitionService.getRelatedClients(id, query);
    }
    getScheduledMeetings(id, query) {
        return this.exhibitionService.getScheduledMeetings(id, query);
    }
    addClient(exhibitionId, clientId, data) {
        return this.exhibitionService.addClient(exhibitionId, clientId, data);
    }
    removeClient(exhibitionId, clientId) {
        return this.exhibitionService.removeClient(exhibitionId, clientId);
    }
};
exports.ExhibitionController = ExhibitionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '新しい展示会を作成' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '展示会が正常に作成されました' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exhibition_dto_1.CreateExhibitionDto]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '全ての展示会を取得' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '展示会の一覧を返却' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '指定IDの展示会を取得' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '展示会ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '展示会の詳細情報を返却' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '展示会情報を更新' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '展示会ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '展示会が正常に更新されました' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exhibition_dto_1.UpdateExhibitionDto]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '展示会を削除' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '展示会ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '展示会が正常に削除されました' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/clients'),
    (0, swagger_1.ApiOperation)({ summary: '展示会に関連するクライアント一覧を取得' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '展示会ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'クライアント一覧を返却' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "getRelatedClients", null);
__decorate([
    (0, common_1.Get)(':id/meetings'),
    (0, swagger_1.ApiOperation)({ summary: '展示会に関連する商談予約一覧を取得' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '展示会ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '商談予約一覧を返却' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "getScheduledMeetings", null);
__decorate([
    (0, common_1.Post)(':exhibitionId/clients/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'クライアントを展示会に登録' }),
    (0, swagger_1.ApiParam)({ name: 'exhibitionId', description: '展示会ID' }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'クライアントID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'クライアントが正常に登録されました' }),
    __param(0, (0, common_1.Param)('exhibitionId')),
    __param(1, (0, common_1.Param)('clientId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "addClient", null);
__decorate([
    (0, common_1.Delete)(':exhibitionId/clients/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'クライアントの展示会登録を解除' }),
    (0, swagger_1.ApiParam)({ name: 'exhibitionId', description: '展示会ID' }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'クライアントID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'クライアントの登録が正常に解除されました' }),
    __param(0, (0, common_1.Param)('exhibitionId')),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExhibitionController.prototype, "removeClient", null);
exports.ExhibitionController = ExhibitionController = __decorate([
    (0, swagger_1.ApiTags)('exhibitions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('exhibitions'),
    __metadata("design:paramtypes", [exhibition_service_1.ExhibitionService])
], ExhibitionController);
//# sourceMappingURL=exhibition.controller.js.map