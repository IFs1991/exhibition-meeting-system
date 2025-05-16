import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';
import { AiService } from '../../services/ai/ai.service';
import { CreateTagDto, UpdateTagDto, TagFilterDto } from '../dto/tag.dto';
export declare class TagService {
    private readonly tagRepository;
    private readonly aiService;
    constructor(tagRepository: TagRepository, aiService: AiService);
    createTag(createTagDto: CreateTagDto): Promise<Tag>;
    updateTag(id: string, updateTagDto: UpdateTagDto): Promise<Tag>;
    findTags(filterDto: TagFilterDto): Promise<Tag[]>;
    suggestTags(text: string): Promise<string[]>;
    getTagsByCategory(category: string): Promise<Tag[]>;
    assignTagsToReceipt(receiptId: string, text: string): Promise<string[]>;
    getTagStatistics(): Promise<any>;
    mergeTags(sourceTagId: string, targetTagId: string): Promise<void>;
    deleteTag(id: string): Promise<void>;
    validateTags(tagIds: string[]): Promise<boolean>;
    updateTagCategory(id: string, category: string): Promise<Tag>;
}
