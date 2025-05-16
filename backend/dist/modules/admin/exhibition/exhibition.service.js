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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExhibitionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exhibition_entity_1 = require("../entities/exhibition.entity");
let ExhibitionService = class ExhibitionService {
    constructor(exhibitionRepository) {
        this.exhibitionRepository = exhibitionRepository;
    }
    async create(createExhibitionDto) {
        const exhibition = this.exhibitionRepository.create(createExhibitionDto);
        return this.exhibitionRepository.save(exhibition);
    }
    async findAll(page = 1, limit = 10) {
        const [data, count] = await this.exhibitionRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { startDate: 'DESC' }
        });
        return { data, count };
    }
    async findOne(id) {
        const exhibition = await this.exhibitionRepository.findOne({ where: { id } });
        if (!exhibition) {
            throw new common_1.NotFoundException(`Exhibition with ID "${id}" not found`);
        }
        return exhibition;
    }
    async update(id, updateExhibitionDto) {
        const exhibition = await this.findOne(id);
        this.exhibitionRepository.merge(exhibition, updateExhibitionDto);
        return this.exhibitionRepository.save(exhibition);
    }
    async remove(id) {
        const exhibition = await this.findOne(id);
        await this.exhibitionRepository.remove(exhibition);
    }
};
exports.ExhibitionService = ExhibitionService;
exports.ExhibitionService = ExhibitionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exhibition_entity_1.Exhibition)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ExhibitionService);
//# sourceMappingURL=exhibition.service.js.map