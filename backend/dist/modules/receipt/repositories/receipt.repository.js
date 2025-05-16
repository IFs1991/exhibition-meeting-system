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
exports.ReceiptRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_config_1 = require("../../config/database-config");
const receipt_entity_1 = require("../entities/receipt.entity");
const tag_entity_1 = require("../entities/tag.entity");
let ReceiptRepository = class ReceiptRepository {
    constructor(receiptRepository, tagRepository, dbConfig) {
        this.receiptRepository = receiptRepository;
        this.tagRepository = tagRepository;
        this.dbConfig = dbConfig;
    }
    async create(receipt) {
        const newReceipt = this.receiptRepository.create(receipt);
        return this.receiptRepository.save(newReceipt);
    }
    async findById(id) {
        return this.receiptRepository.findOne({
            where: { id },
            relations: ['tags'],
        });
    }
    async update(id, receipt) {
        await this.receiptRepository.update(id, receipt);
        return this.findById(id);
    }
    async delete(id) {
        await this.receiptRepository.delete(id);
    }
    async findByVector(params) {
        const { vector, limit = 10, threshold = 0.7 } = params;
        return this.receiptRepository.query(`
      SELECT r.*, 
        (r.content_vector <=> $1) as similarity
      FROM receipts r
      WHERE (r.content_vector <=> $1) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `, [vector, threshold, limit]);
    }
    async findByTags(tagIds) {
        return this.receiptRepository.find({
            where: {
                tags: {
                    id: (0, typeorm_2.In)(tagIds)
                }
            },
            relations: ['tags'],
        });
    }
    async findByKeyword(keyword) {
        return this.receiptRepository.find({
            where: [
                { title: (0, typeorm_2.Like)(`%${keyword}%`) },
                { content: (0, typeorm_2.Like)(`%${keyword}%`) }
            ],
            relations: ['tags'],
        });
    }
    async addTags(receiptId, tagIds) {
        const receipt = await this.findById(receiptId);
        const tags = await this.tagRepository.findByIds(tagIds);
        receipt.tags = [...receipt.tags, ...tags];
        return this.receiptRepository.save(receipt);
    }
    async removeTags(receiptId, tagIds) {
        const receipt = await this.findById(receiptId);
        receipt.tags = receipt.tags.filter(tag => !tagIds.includes(tag.id));
        return this.receiptRepository.save(receipt);
    }
    async findSimilarReceipts(receiptId, limit = 5) {
        const receipt = await this.findById(receiptId);
        return this.receiptRepository.query(`
      SELECT r.*
      FROM receipts r
      WHERE r.id != $1
      ORDER BY r.content_vector <=> $2
      LIMIT $3
    `, [receiptId, receipt.contentVector, limit]);
    }
};
exports.ReceiptRepository = ReceiptRepository;
exports.ReceiptRepository = ReceiptRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(receipt_entity_1.Receipt)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof database_config_1.DatabaseConfig !== "undefined" && database_config_1.DatabaseConfig) === "function" ? _c : Object])
], ReceiptRepository);
//# sourceMappingURL=receipt.repository.js.map