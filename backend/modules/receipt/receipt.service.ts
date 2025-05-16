import { Injectable } from '@nestjs/common';
import { ReceiptRepository } from '../repositories/receipt.repository';
import { TagService } from '../tag/tag.service';
import { VectorSearchService } from '../../services/vector/vector-search.service';
import { CreateReceiptDto, UpdateReceiptDto, SearchReceiptDto } from '../dto/receipt.dto';
import { Receipt, SearchResult } from '../interfaces/receipt.interface';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly receiptRepository: ReceiptRepository,
    private readonly tagService: TagService,
    private readonly vectorSearchService: VectorSearchService,
  ) {}

  async createReceipt(dto: CreateReceiptDto): Promise<Receipt> {
    const normalizedData = this.normalizeReceiptData(dto);
    const textVector = await this.vectorSearchService.generateVector(
      `${normalizedData.symptoms} ${normalizedData.treatment} ${normalizedData.diagnosis}`
    );
    
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

  async updateReceipt(id: string, dto: UpdateReceiptDto): Promise<Receipt> {
    const normalizedData = this.normalizeReceiptData(dto);
    const textVector = await this.vectorSearchService.generateVector(
      `${normalizedData.symptoms} ${normalizedData.treatment} ${normalizedData.diagnosis}`
    );

    const updatedTags = await this.tagService.extractTags(normalizedData);
    const receipt = {
      ...normalizedData,
      vector: textVector,
      tags: updatedTags,
      updatedAt: new Date(),
    };

    return this.receiptRepository.update(id, receipt);
  }

  async searchReceipts(dto: SearchReceiptDto): Promise<SearchResult> {
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

  private normalizeReceiptData(data: CreateReceiptDto | UpdateReceiptDto) {
    return {
      ...data,
      symptoms: this.sanitizeText(data.symptoms),
      diagnosis: this.sanitizeText(data.diagnosis),
      treatment: this.sanitizeText(data.treatment),
      patientInfo: this.normalizePatientInfo(data.patientInfo),
    };
  }

  private sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w\s]/g, '');
  }

  private normalizePatientInfo(patientInfo: any) {
    return {
      ...patientInfo,
      age: Number(patientInfo.age),
      gender: patientInfo.gender.toUpperCase(),
    };
  }

  private async filterResultsByTags(results: SearchResult, tags: string[]): Promise<SearchResult> {
    const filteredItems = results.items.filter(item =>
      tags.every(tag => item.tags.includes(tag))
    );

    return {
      items: filteredItems,
      total: filteredItems.length,
      page: results.page,
      limit: results.limit,
    };
  }

  async getReceiptById(id: string): Promise<Receipt> {
    return this.receiptRepository.findById(id);
  }

  async deleteReceipt(id: string): Promise<void> {
    await this.receiptRepository.delete(id);
  }
}