import { ReceiptService } from './receipt.service';
import { CreateReceiptDto, UpdateReceiptDto, SearchReceiptDto, TagManagementDto } from './dto/receipt.dto';
export declare class ReceiptController {
    private readonly receiptService;
    constructor(receiptService: ReceiptService);
    createReceipt(createReceiptDto: CreateReceiptDto): Promise<Receipt>;
    searchReceipts(searchDto: SearchReceiptDto): Promise<SearchResult>;
    getReceipt(id: string): Promise<Receipt>;
    updateReceipt(id: string, updateReceiptDto: UpdateReceiptDto): Promise<Receipt>;
    deleteReceipt(id: string): Promise<void>;
    manageTags(tagDto: TagManagementDto): Promise<any>;
    getTagSuggestions(keyword: string): Promise<any>;
}
