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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptService = void 0;
const common_1 = require("@nestjs/common");
const receipt_repository_1 = require("../repositories/receipt.repository");
const tag_service_1 = require("../tag/tag.service");
const vector_search_service_1 = require("../../services/vector/vector-search.service");
let ReceiptService = class ReceiptService {
    constructor(receiptRepository, tagService, vectorSearchService) {
        this.receiptRepository = receiptRepository;
        this.tagService = tagService;
        this.vectorSearchService = vectorSearchService;
    }
    async createReceipt(dto) {
        const normalizedData = this.normalizeReceiptData(dto);
        const textVector = await this.vectorSearchService.generateVector(`${normalizedData.symptoms} ${normalizedData.treatment} ${normalizedData.diagnosis}`);
        const suggestedTags = await this.tagService.extractTags(normalizedData);
        const receipt = {
            ...normalizedData,
            vector: textVector,
            tags: suggestedTags,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.receiptRepository.create(receipt);
    }
    async updateReceipt(id, dto) {
        const normalizedData = this.normalizeReceiptData(dto);
        const textVector = await this.vectorSearchService.generateVector(`${normalizedData.symptoms} ${normalizedData.treatment} ${normalizedData.diagnosis}`);
        const updatedTags = await this.tagService.extractTags(normalizedData);
        const receipt = {
            ...normalizedData,
            vector: textVector,
            tags: updatedTags,
            updatedAt: new Date(),
        };
        return this.receiptRepository.update(id, receipt);
    }
    async searchReceipts(dto) {
        const { query, tags, page = 1, limit = 10 } = dto;
        if (query) {
            const searchVector = await this.vectorSearchService.generateVector(query);
            const vectorResults = await this.receiptRepository.searchByVector(searchVector, limit, (page - 1) * limit);
            if (tags?.length) {
                return this.filterResultsByTags(vectorResults, tags);
            }
            return vectorResults;
        }
        if (tags?.length) {
            return this.receiptRepository.searchByTags(tags, limit, (page - 1) * limit);
        }
        return this.receiptRepository.findAll(limit, (page - 1) * limit);
    }
    normalizeReceiptData(data) {
        return {
            ...data,
            symptoms: this.sanitizeText(data.symptoms),
            diagnosis: this.sanitizeText(data.diagnosis),
            treatment: this.sanitizeText(data.treatment),
            patientInfo: this.normalizePatientInfo(data.patientInfo),
        };
    }
    sanitizeText(text) {
        return text
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w\s]/g, '');
    }
    normalizePatientInfo(patientInfo) {
        return {
            ...patientInfo,
            age: Number(patientInfo.age),
            gender: patientInfo.gender.toUpperCase(),
        };
    }
    async filterResultsByTags(results, tags) {
        const filteredItems = results.items.filter(item => tags.every(tag => item.tags.includes(tag)));
        return {
            items: filteredItems,
            total: filteredItems.length,
            page: results.page,
            limit: results.limit,
        };
    }
    async getReceiptById(id) {
        return this.receiptRepository.findById(id);
    }
    async deleteReceipt(id) {
        await this.receiptRepository.delete(id);
    }
};
exports.ReceiptService = ReceiptService;
exports.ReceiptService = ReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof receipt_repository_1.ReceiptRepository !== "undefined" && receipt_repository_1.ReceiptRepository) === "function" ? _a : Object, typeof (_b = typeof tag_service_1.TagService !== "undefined" && tag_service_1.TagService) === "function" ? _b : Object, typeof (_c = typeof vector_search_service_1.VectorSearchService !== "undefined" && vector_search_service_1.VectorSearchService) === "function" ? _c : Object])
], ReceiptService);
//# sourceMappingURL=receipt.service.js.map