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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const tag_repository_1 = require("../repositories/tag.repository");
const ai_service_1 = require("../../services/ai/ai.service");
let TagService = class TagService {
    constructor(tagRepository, aiService) {
        this.tagRepository = tagRepository;
        this.aiService = aiService;
    }
    async createTag(createTagDto) {
        const tag = await this.tagRepository.create(createTagDto);
        return this.tagRepository.save(tag);
    }
    async updateTag(id, updateTagDto) {
        const tag = await this.tagRepository.findOne(id);
        if (!tag) {
            throw new Error('Tag not found');
        }
        Object.assign(tag, updateTagDto);
        return this.tagRepository.save(tag);
    }
    async findTags(filterDto) {
        const { category, keyword, limit = 10, offset = 0 } = filterDto;
        return this.tagRepository.findTags(category, keyword, limit, offset);
    }
    async suggestTags(text) {
        const prompt = `以下のテキストから適切なタグを抽出してください:\n${text}`;
        const suggestedTags = await this.aiService.generateTags(prompt);
        return suggestedTags;
    }
    async getTagsByCategory(category) {
        return this.tagRepository.findByCategory(category);
    }
    async assignTagsToReceipt(receiptId, text) {
        const suggestedTags = await this.suggestTags(text);
        const existingTags = await this.tagRepository.findByNames(suggestedTags);
        const newTags = suggestedTags.filter(tag => !existingTags.find(existing => existing.name === tag));
        for (const tagName of newTags) {
            await this.createTag({ name: tagName, category: 'auto-generated' });
        }
        await this.tagRepository.assignTagsToReceipt(receiptId, [...existingTags, ...newTags]);
        return suggestedTags;
    }
    async getTagStatistics() {
        return this.tagRepository.getTagUsageStatistics();
    }
    async mergeTags(sourceTagId, targetTagId) {
        await this.tagRepository.mergeTags(sourceTagId, targetTagId);
    }
    async deleteTag(id) {
        await this.tagRepository.delete(id);
    }
    async validateTags(tagIds) {
        const existingTags = await this.tagRepository.findByIds(tagIds);
        return existingTags.length === tagIds.length;
    }
    async updateTagCategory(id, category) {
        const tag = await this.tagRepository.findOne(id);
        if (!tag) {
            throw new Error('Tag not found');
        }
        tag.category = category;
        return this.tagRepository.save(tag);
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tag_repository_1.TagRepository !== "undefined" && tag_repository_1.TagRepository) === "function" ? _a : Object, typeof (_b = typeof ai_service_1.AiService !== "undefined" && ai_service_1.AiService) === "function" ? _b : Object])
], TagService);
//# sourceMappingURL=tag.service.js.map