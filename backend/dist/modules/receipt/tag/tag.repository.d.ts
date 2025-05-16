import { Repository } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Tag } from '../entities/tag.entity';
import { ReceiptTag } from '../entities/receipt-tag.entity';
export declare class TagRepository {
    private readonly tagRepository;
    private readonly receiptTagRepository;
    private readonly dbConfig;
    constructor(tagRepository: Repository<Tag>, receiptTagRepository: Repository<ReceiptTag>, dbConfig: DatabaseConfig);
    createTag(tagData: Partial<Tag>): Promise<Tag>;
    findTagById(id: number): Promise<Tag>;
    findTagsByIds(ids: number[]): Promise<Tag[]>;
    findTagsByCategory(category: string): Promise<Tag[]>;
    updateTag(id: number, tagData: Partial<Tag>): Promise<Tag>;
    deleteTag(id: number): Promise<void>;
    findTagsByReceiptId(receiptId: number): Promise<Tag[]>;
    addTagToReceipt(receiptId: number, tagId: number): Promise<void>;
    removeTagFromReceipt(receiptId: number, tagId: number): Promise<void>;
    searchTags(query: string): Promise<Tag[]>;
    getTagUsageCount(tagId: number): Promise<number>;
    getPopularTags(limit?: number): Promise<{
        tag: Tag;
        count: number;
    }[]>;
    getRelatedTags(tagId: number, limit?: number): Promise<Tag[]>;
}
