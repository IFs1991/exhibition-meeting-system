import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Receipt } from '../entities/receipt.entity';
import { Tag } from '../entities/tag.entity';
import { VectorSearchParams, SearchResult } from '../types/search.types';

@Injectable()
export class ReceiptRepository {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private dbConfig: DatabaseConfig,
  ) {}

  async create(receipt: Partial<Receipt>): Promise<Receipt> {
    const newReceipt = this.receiptRepository.create(receipt);
    return this.receiptRepository.save(newReceipt);
  }

  async findById(id: string): Promise<Receipt> {
    return this.receiptRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
  }

  async update(id: string, receipt: Partial<Receipt>): Promise<Receipt> {
    await this.receiptRepository.update(id, receipt);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.receiptRepository.delete(id);
  }

  async findByVector(params: VectorSearchParams): Promise<SearchResult[]> {
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

  async findByTags(tagIds: string[]): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: {
        tags: {
          id: In(tagIds)
        }
      },
      relations: ['tags'],
    });
  }

  async findByKeyword(keyword: string): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { content: Like(`%${keyword}%`) }
      ],
      relations: ['tags'],
    });
  }

  async addTags(receiptId: string, tagIds: string[]): Promise<Receipt> {
    const receipt = await this.findById(receiptId);
    const tags = await this.tagRepository.findByIds(tagIds);
    receipt.tags = [...receipt.tags, ...tags];
    return this.receiptRepository.save(receipt);
  }

  async removeTags(receiptId: string, tagIds: string[]): Promise<Receipt> {
    const receipt = await this.findById(receiptId);
    receipt.tags = receipt.tags.filter(tag => !tagIds.includes(tag.id));
    return this.receiptRepository.save(receipt);
  }

  async findSimilarReceipts(receiptId: string, limit = 5): Promise<Receipt[]> {
    const receipt = await this.findById(receiptId);
    
    return this.receiptRepository.query(`
      SELECT r.*
      FROM receipts r
      WHERE r.id != $1
      ORDER BY r.content_vector <=> $2
      LIMIT $3
    `, [receiptId, receipt.contentVector, limit]);
  }
}