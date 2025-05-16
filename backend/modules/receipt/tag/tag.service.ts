import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';
import { AiService } from '../../services/ai/ai.service';
import { CreateTagDto, UpdateTagDto, TagFilterDto } from '../dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly aiService: AiService,
  ) {}

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async updateTag(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne(id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async findTags(filterDto: TagFilterDto): Promise<Tag[]> {
    const { category, keyword, limit = 10, offset = 0 } = filterDto;
    return this.tagRepository.findTags(category, keyword, limit, offset);
  }

  async suggestTags(text: string): Promise<string[]> {
    const prompt = `以下のテキストから適切なタグを抽出してください:\n${text}`;
    const suggestedTags = await this.aiService.generateTags(prompt);
    return suggestedTags;
  }

  async getTagsByCategory(category: string): Promise<Tag[]> {
    return this.tagRepository.findByCategory(category);
  }

  async assignTagsToReceipt(receiptId: string, text: string): Promise<string[]> {
    const suggestedTags = await this.suggestTags(text);
    const existingTags = await this.tagRepository.findByNames(suggestedTags);
    
    const newTags = suggestedTags.filter(
      tag => !existingTags.find(existing => existing.name === tag)
    );

    for (const tagName of newTags) {
      await this.createTag({ name: tagName, category: 'auto-generated' });
    }

    await this.tagRepository.assignTagsToReceipt(receiptId, [...existingTags, ...newTags]);
    return suggestedTags;
  }

  async getTagStatistics(): Promise<any> {
    return this.tagRepository.getTagUsageStatistics();
  }

  async mergeTags(sourceTagId: string, targetTagId: string): Promise<void> {
    await this.tagRepository.mergeTags(sourceTagId, targetTagId);
  }

  async deleteTag(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }

  async validateTags(tagIds: string[]): Promise<boolean> {
    const existingTags = await this.tagRepository.findByIds(tagIds);
    return existingTags.length === tagIds.length;
  }

  async updateTagCategory(id: string, category: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne(id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    tag.category = category;
    return this.tagRepository.save(tag);
  }
}