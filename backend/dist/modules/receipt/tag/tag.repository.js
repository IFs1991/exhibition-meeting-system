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
exports.TagRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_config_1 = require("../../config/database-config");
const tag_entity_1 = require("../entities/tag.entity");
const receipt_tag_entity_1 = require("../entities/receipt-tag.entity");
let TagRepository = class TagRepository {
    constructor(tagRepository, receiptTagRepository, dbConfig) {
        this.tagRepository = tagRepository;
        this.receiptTagRepository = receiptTagRepository;
        this.dbConfig = dbConfig;
    }
    async createTag(tagData) {
        const tag = this.tagRepository.create(tagData);
        return await this.tagRepository.save(tag);
    }
    async findTagById(id) {
        return await this.tagRepository.findOneOrFail({ where: { id } });
    }
    async findTagsByIds(ids) {
        return await this.tagRepository.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async findTagsByCategory(category) {
        return await this.tagRepository.find({ where: { category } });
    }
    async updateTag(id, tagData) {
        await this.tagRepository.update(id, tagData);
        return await this.findTagById(id);
    }
    async deleteTag(id) {
        await this.tagRepository.delete(id);
    }
    async findTagsByReceiptId(receiptId) {
        const receiptTags = await this.receiptTagRepository.find({
            where: { receiptId },
            relations: ['tag'],
        });
        return receiptTags.map(rt => rt.tag);
    }
    async addTagToReceipt(receiptId, tagId) {
        const receiptTag = this.receiptTagRepository.create({
            receiptId,
            tagId,
        });
        await this.receiptTagRepository.save(receiptTag);
    }
    async removeTagFromReceipt(receiptId, tagId) {
        await this.receiptTagRepository.delete({
            receiptId,
            tagId,
        });
    }
    async searchTags(query) {
        return await this.tagRepository
            .createQueryBuilder('tag')
            .where('tag.name ILIKE :query', { query: `%${query}%` })
            .orWhere('tag.description ILIKE :query', { query: `%${query}%` })
            .getMany();
    }
    async getTagUsageCount(tagId) {
        return await this.receiptTagRepository.count({
            where: { tagId },
        });
    }
    async getPopularTags(limit = 10) {
        const results = await this.receiptTagRepository
            .createQueryBuilder('receipt_tag')
            .select('tag')
            .addSelect('COUNT(*)', 'count')
            .innerJoin('receipt_tag.tag', 'tag')
            .groupBy('tag.id')
            .orderBy('count', 'DESC')
            .limit(limit)
            .getRawMany();
        return results.map(result => ({
            tag: result.tag,
            count: parseInt(result.count),
        }));
    }
    async getRelatedTags(tagId, limit = 5) {
        const query = this.receiptTagRepository
            .createQueryBuilder('rt1')
            .select('tag.*')
            .innerJoin('receipt_tag', 'rt2', 'rt1.receipt_id = rt2.receipt_id')
            .innerJoin('tag', 'tag', 'rt2.tag_id = tag.id')
            .where('rt1.tag_id = :tagId', { tagId })
            .andWhere('rt2.tag_id != :tagId')
            .groupBy('tag.id')
            .orderBy('COUNT(*)', 'DESC')
            .limit(limit);
        return await query.getRawMany();
    }
};
exports.TagRepository = TagRepository;
exports.TagRepository = TagRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __param(1, (0, typeorm_1.InjectRepository)(receipt_tag_entity_1.ReceiptTag)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof database_config_1.DatabaseConfig !== "undefined" && database_config_1.DatabaseConfig) === "function" ? _c : Object])
], TagRepository);
//# sourceMappingURL=tag.repository.js.map