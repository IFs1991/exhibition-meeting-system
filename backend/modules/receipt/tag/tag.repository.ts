import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Tag } from '../entities/tag.entity';
import { ReceiptTag } from '../entities/receipt-tag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(ReceiptTag)
    private readonly receiptTagRepository: Repository<ReceiptTag>,
    private readonly dbConfig: DatabaseConfig,
  ) {}

  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    const tag = this.tagRepository.create(tagData);
    return await this.tagRepository.save(tag);
  }

  async findTagById(id: number): Promise<Tag> {
    return await this.tagRepository.findOneOrFail({ where: { id } });
  }

  async findTagsByIds(ids: number[]): Promise<Tag[]> {
    return await this.tagRepository.find({ where: { id: In(ids) } });
  }

  async findTagsByCategory(category: string): Promise<Tag[]> {
    return await this.tagRepository.find({ where: { category } });
  }

  async updateTag(id: number, tagData: Partial<Tag>): Promise<Tag> {
    await this.tagRepository.update(id, tagData);
    return await this.findTagById(id);
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }

  async findTagsByReceiptId(receiptId: number): Promise<Tag[]> {
    const receiptTags = await this.receiptTagRepository.find({
      where: { receiptId },
      relations: ['tag'],
    });
    return receiptTags.map(rt => rt.tag);
  }

  async addTagToReceipt(receiptId: number, tagId: number): Promise<void> {
    const receiptTag = this.receiptTagRepository.create({
      receiptId,
      tagId,
    });
    await this.receiptTagRepository.save(receiptTag);
  }

  async removeTagFromReceipt(receiptId: number, tagId: number): Promise<void> {
    await this.receiptTagRepository.delete({
      receiptId,
      tagId,
    });
  }

  async searchTags(query: string): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name ILIKE :query', { query: `%${query}%` })
      .orWhere('tag.description ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getTagUsageCount(tagId: number): Promise<number> {
    return await this.receiptTagRepository.count({
      where: { tagId },
    });
  }

  async getPopularTags(limit: number = 10): Promise<{ tag: Tag; count: number }[]> {
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

  async getRelatedTags(tagId: number, limit: number = 5): Promise<Tag[]> {
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
}