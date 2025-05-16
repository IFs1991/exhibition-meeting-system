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
exports.MeetingController = void 0;
const common_1 = require("@nestjs/common");
const meeting_service_1 = require("./meeting.service");
const meeting_dto_1 = require("./dto/meeting.dto");
const auth_guard_1 = require("../user/guards/auth.guard");
let MeetingController = class MeetingController {
    constructor(meetingService) {
        this.meetingService = meetingService;
    }
    async create(createMeetingDto, req) {
        const userId = req.user?.id;
        return this.meetingService.create(createMeetingDto, userId);
    }
    async findAll(query, req) {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        return this.meetingService.findAll(query, userId, userRole);
    }
    async findOne(id, req) {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        return this.meetingService.findOne(id, userId, userRole);
    }
    async update(id, updateMeetingDto, req) {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        return this.meetingService.update(id, updateMeetingDto, userId, userRole);
    }
    async remove(id, req) {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        return this.meetingService.remove(id, userId, userRole);
    }
    async acceptMeeting(id, req) {
        const clientId = req.user?.id;
        return this.meetingService.acceptMeeting(id, clientId);
    }
    async declineMeeting(id, req) {
        const clientId = req.user?.id;
        return this.meetingService.declineMeeting(id, clientId);
    }
};
exports.MeetingController = MeetingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meeting_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meeting_dto_1.FindMeetingsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meeting_dto_1.UpdateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "acceptMeeting", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "declineMeeting", null);
exports.MeetingController = MeetingController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('meetings'),
    __metadata("design:paramtypes", [meeting_service_1.MeetingService])
], MeetingController);
//# sourceMappingURL=meeting.controller.js.map