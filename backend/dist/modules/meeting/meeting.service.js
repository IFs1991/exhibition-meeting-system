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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meeting_entity_1 = require("./meeting.entity");
const meeting_dto_1 = require("./dto/meeting.dto");
const user_entity_1 = require("../user/entities/user.entity");
const exhibition_entity_1 = require("../admin/exhibition/entities/exhibition.entity");
let MeetingService = class MeetingService {
    constructor(meetingRepository, userRepository, exhibitionRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
        this.exhibitionRepository = exhibitionRepository;
    }
    async create(createMeetingDto, organizerId) {
        const { exhibitionId, clientId, startTime, endTime } = createMeetingDto;
        const exhibition = await this.exhibitionRepository.findOneBy({ id: exhibitionId });
        if (!exhibition) {
            throw new common_1.NotFoundException(`ID "${exhibitionId}" の展示会が見つかりません。`);
        }
        const organizer = await this.userRepository.findOneBy({ id: organizerId });
        if (!organizer) {
            throw new common_1.NotFoundException(`ID "${organizerId}" の主催者が見つかりません。`);
        }
        const client = await this.userRepository.findOneBy({ id: clientId });
        if (!client) {
            throw new common_1.NotFoundException(`ID "${clientId}" のクライアントが見つかりません。`);
        }
        if (new Date(startTime) >= new Date(endTime)) {
            throw new common_1.BadRequestException('開始日時は終了日時より前である必要があります。');
        }
        const meeting = this.meetingRepository.create({
            ...createMeetingDto,
            organizerId,
            status: meeting_dto_1.MeetingStatus.PENDING,
        });
        return this.meetingRepository.save(meeting);
    }
    async findAll(query, userId, userRole) {
        const { page = 1, limit = 10, exhibitionId, organizerId, clientId, status, dateFrom, dateTo, sortBy = 'startTime', sortOrder = 'ASC' } = query;
        const skip = (page - 1) * limit;
        const options = {
            where: {},
            relations: ['exhibition', 'organizer', 'client'],
            skip,
            take: limit,
            order: { [sortBy]: sortOrder },
        };
        if (exhibitionId) {
            options.where = { ...options.where, exhibitionId };
        }
        if (status) {
            options.where = { ...options.where, status };
        }
        if (dateFrom) {
            options.where = { ...options.where, startTime: (0, typeorm_2.MoreThanOrEqual)(new Date(dateFrom)) };
        }
        if (dateTo) {
            options.where = { ...options.where, endTime: (0, typeorm_2.LessThanOrEqual)(new Date(dateTo)) };
        }
        if (userRole === 'admin') {
            if (organizerId) {
                options.where = { ...options.where, organizerId };
            }
            if (clientId) {
                options.where = { ...options.where, clientId };
            }
        }
        else if (userRole === 'exhibitor') {
            options.where = { ...options.where, organizerId: userId };
            if (clientId) {
                options.where = { ...options.where, clientId };
            }
        }
        else if (userRole === 'client') {
            options.where = { ...options.where, clientId: userId };
            if (organizerId) {
                options.where = { ...options.where, organizerId };
            }
        }
        else {
            return { data: [], count: 0 };
        }
        const [data, count] = await this.meetingRepository.findAndCount(options);
        return { data, count };
    }
    async findOne(id, userId, userRole) {
        const meeting = await this.meetingRepository.findOne({
            where: { id },
            relations: ['exhibition', 'organizer', 'client'],
        });
        if (!meeting) {
            throw new common_1.NotFoundException(`ID "${id}" の商談が見つかりません。`);
        }
        if (userRole !== 'admin' && meeting.organizerId !== userId && meeting.clientId !== userId) {
            throw new common_1.ForbiddenException('この商談にアクセスする権限がありません。');
        }
        return meeting;
    }
    async update(id, updateMeetingDto, userId, userRole) {
        const meeting = await this.findOne(id, userId, userRole);
        if (userRole !== 'admin' && meeting.organizerId !== userId) {
            if (updateMeetingDto.status && (updateMeetingDto.status === meeting_dto_1.MeetingStatus.ACCEPTED || updateMeetingDto.status === meeting_dto_1.MeetingStatus.DECLINED)) {
                throw new common_1.ForbiddenException('ステータスの更新は承諾または辞退のエンドポイントを使用してください。');
            }
            if (Object.keys(updateMeetingDto).some(key => key !== 'status')) {
                throw new common_1.ForbiddenException('商談の主催者または管理者のみがこの情報を更新できます。');
            }
        }
        const startTime = updateMeetingDto.startTime ? new Date(updateMeetingDto.startTime) : new Date(meeting.startTime);
        const endTime = updateMeetingDto.endTime ? new Date(updateMeetingDto.endTime) : new Date(meeting.endTime);
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('開始日時は終了日時より前である必要があります。');
        }
        if (meeting.status !== meeting_dto_1.MeetingStatus.PENDING && meeting.organizerId === userId && userRole !== 'admin') {
            if (updateMeetingDto.startTime || updateMeetingDto.endTime || updateMeetingDto.title || updateMeetingDto.description) {
                throw new common_1.ForbiddenException(`ステータスが "${meeting.status}" のため、基本情報の変更はできません。`);
            }
        }
        if (userRole === 'admin' && updateMeetingDto.status) {
            meeting.status = updateMeetingDto.status;
        }
        Object.assign(meeting, {
            ...updateMeetingDto,
            startTime: updateMeetingDto.startTime || meeting.startTime,
            endTime: updateMeetingDto.endTime || meeting.endTime,
        });
        return this.meetingRepository.save(meeting);
    }
    async remove(id, userId, userRole) {
        const meeting = await this.findOne(id, userId, userRole);
        if (userRole !== 'admin' && meeting.organizerId !== userId) {
            throw new common_1.ForbiddenException('商談の主催者または管理者のみがこの商談を削除できます。');
        }
        const result = await this.meetingRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`ID "${id}" の商談が見つかりません。`);
        }
    }
    async acceptMeeting(meetingId, clientId) {
        const meeting = await this.meetingRepository.findOneBy({ id: meetingId });
        if (!meeting) {
            throw new common_1.NotFoundException(`ID "${meetingId}" の商談が見つかりません。`);
        }
        if (meeting.clientId !== clientId) {
            throw new common_1.ForbiddenException('この商談を承諾する権限がありません。招待されたクライアントのみが承諾できます。');
        }
        if (meeting.status !== meeting_dto_1.MeetingStatus.PENDING) {
            throw new common_1.BadRequestException(`この商談は既に "${meeting.status}" の状態のため、承諾できません。`);
        }
        meeting.status = meeting_dto_1.MeetingStatus.ACCEPTED;
        return this.meetingRepository.save(meeting);
    }
    async declineMeeting(meetingId, clientId) {
        const meeting = await this.meetingRepository.findOneBy({ id: meetingId });
        if (!meeting) {
            throw new common_1.NotFoundException(`ID "${meetingId}" の商談が見つかりません。`);
        }
        if (meeting.clientId !== clientId) {
            throw new common_1.ForbiddenException('この商談を辞退する権限がありません。招待されたクライアントのみが辞退できます。');
        }
        if (meeting.status !== meeting_dto_1.MeetingStatus.PENDING && meeting.status !== meeting_dto_1.MeetingStatus.ACCEPTED) {
            throw new common_1.BadRequestException(`この商談は "${meeting.status}" の状態のため、辞退できません。`);
        }
        meeting.status = meeting_dto_1.MeetingStatus.DECLINED;
        return this.meetingRepository.save(meeting);
    }
};
exports.MeetingService = MeetingService;
exports.MeetingService = MeetingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(exhibition_entity_1.Exhibition)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], MeetingService);
//# sourceMappingURL=meeting.service.js.map