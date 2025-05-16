import { ReceiptRepository } from '../repositories/receipt.repository';
import { TagService } from '../tag/tag.service';
import { VectorSearchService } from '../../services/vector/vector-search.service';
import { CreateReceiptDto, UpdateReceiptDto, SearchReceiptDto } from '../dto/receipt.dto';
import { Receipt, SearchResult } from '../interfaces/receipt.interface';
export declare class ReceiptService {
    private readonly receiptRepository;
    private readonly tagService;
    private readonly vectorSearchService;
    constructor(receiptRepository: ReceiptRepository, tagService: TagService, vectorSearchService: VectorSearchService);
    createReceipt(dto: CreateReceiptDto): Promise<Receipt>;
    updateReceipt(id: string, dto: UpdateReceiptDto): Promise<Receipt>;
    searchReceipts(dto: SearchReceiptDto): Promise<SearchResult>;
    private normalizeReceiptData;
    private sanitizeText;
    private normalizePatientInfo;
    private filterResultsByTags;
    getReceiptById(id: string): Promise<Receipt>;
    deleteReceipt(id: string): Promise<void>;
}
