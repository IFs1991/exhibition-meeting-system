import { Repository } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Receipt } from '../entities/receipt.entity';
import { Tag } from '../entities/tag.entity';
import { VectorSearchParams, SearchResult } from '../types/search.types';
export declare class ReceiptRepository {
    private receiptRepository;
    private tagRepository;
    private dbConfig;
    constructor(receiptRepository: Repository<Receipt>, tagRepository: Repository<Tag>, dbConfig: DatabaseConfig);
    create(receipt: Partial<Receipt>): Promise<Receipt>;
    findById(id: string): Promise<Receipt>;
    update(id: string, receipt: Partial<Receipt>): Promise<Receipt>;
    delete(id: string): Promise<void>;
    findByVector(params: VectorSearchParams): Promise<SearchResult[]>;
    findByTags(tagIds: string[]): Promise<Receipt[]>;
    findByKeyword(keyword: string): Promise<Receipt[]>;
    addTags(receiptId: string, tagIds: string[]): Promise<Receipt>;
    removeTags(receiptId: string, tagIds: string[]): Promise<Receipt>;
    findSimilarReceipts(receiptId: string, limit?: number): Promise<Receipt[]>;
}
