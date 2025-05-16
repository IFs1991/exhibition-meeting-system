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
exports.ExhibitionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exhibition_entity_1 = require("./entities/exhibition.entity");
let ExhibitionService = class ExhibitionService {
    constructor(exhibitionRepository, clientRepository, meetingRepository) {
        this.exhibitionRepository = exhibitionRepository;
        this.clientRepository = clientRepository;
        this.meetingRepository = meetingRepository;
    }
    async create(createExhibitionDto) {
        const exhibition = this.exhibitionRepository.create(createExhibitionDto);
        return this.exhibitionRepository.save(exhibition);
    }
    async findAll(query) {
        const { page = 1, limit = 10, sort, order = 'asc' } = query;
        const skip = (page - 1) * limit;
        const orderOptions = sort ? { [sort]: order } : { createdAt: 'DESC' };
        const [exhibitions, total] = await this.exhibitionRepository.findAndCount({
            take: limit,
            skip,
            order: orderOptions,
        });
        const totalPages = Math.ceil(total / limit);
        return {
            exhibitions,
            total,
            page,
            totalPages,
        };
    }
    async findOne(id) {
        const exhibition = await this.exhibitionRepository.findOne({ where: { id } });
        if (!exhibition) {
            throw new common_1.NotFoundException(`展示会 ID:${id} が見つかりません`);
        }
        return exhibition;
    }
    async update(id, updateExhibitionDto) {
        const exhibition = await this.findOne(id);
        Object.assign(exhibition, updateExhibitionDto);
        return this.exhibitionRepository.save(exhibition);
    }
    async remove(id) {
        const exhibition = await this.findOne(id);
        await this.exhibitionRepository.remove(exhibition);
    }
    async getRelatedClients(id, query) {
        const { page = 1, limit = 10, sort, order = 'asc' } = query;
        const skip = (page - 1) * limit;
        await this.findOne(id);
        const [clients, total] = await this.clientRepository
            .createQueryBuilder('client')
            .innerJoin('client.exhibitions', 'exhibition')
            .where('exhibition.id = :id', { id })
            .skip(skip)
            .take(limit)
            .orderBy(sort ? `client.${sort}` : 'client.createdAt', order.toUpperCase())
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            clients,
            total,
            page,
            totalPages,
        };
    }
    async getScheduledMeetings(id, query) {
        const { page = 1, limit = 10, sort, order = 'asc' } = query;
        const skip = (page - 1) * limit;
        await this.findOne(id);
        const [meetings, total] = await this.meetingRepository
            .createQueryBuilder('meeting')
            .where('meeting.exhibitionId = :id', { id })
            .skip(skip)
            .take(limit)
            .orderBy(sort ? `meeting.${sort}` : 'meeting.scheduledAt', order.toUpperCase())
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            meetings,
            total,
            page,
            totalPages,
        };
    }
    async addClient(exhibitionId, clientId, data) {
        const exhibition = await this.findOne(exhibitionId);
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (!client) {
            throw new common_1.NotFoundException(`クライアント ID:${clientId} が見つかりません`);
        }
        await this.exhibitionRepository
            .createQueryBuilder()
            .relation(exhibition_entity_1.Exhibition, 'clients')
            .of(exhibition)
            .add(client);
        if (data) {
        }
    }
    async removeClient(exhibitionId, clientId) {
        const exhibition = await this.findOne(exhibitionId);
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (!client) {
            throw new common_1.NotFoundException(`クライアント ID:${clientId} が見つかりません`);
        }
        await this.exhibitionRepository
            .createQueryBuilder()
            .relation(exhibition_entity_1.Exhibition, 'clients')
            .of(exhibition)
            .remove(client);
    }
};
exports.ExhibitionService = ExhibitionService;
exports.ExhibitionService = ExhibitionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exhibition_entity_1.Exhibition)),
    __param(1, (0, typeorm_1.InjectRepository)('Client')),
    __param(2, (0, typeorm_1.InjectRepository)('Meeting')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], ExhibitionService);
//# sourceMappingURL=exhibition.service.js.map