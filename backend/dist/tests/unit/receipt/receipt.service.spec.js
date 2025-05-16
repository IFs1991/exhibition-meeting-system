"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const receipt_service_1 = require("../../backend/modules/receipt/receipt.service");
const receipt_repository_1 = require("../../backend/modules/receipt/repositories/receipt.repository");
const tag_service_1 = require("../../backend/modules/receipt/tag/tag.service");
const vector_search_service_1 = require("../../backend/services/vector/vector-search.service");
describe('ReceiptService', () => {
    let service;
    let repository;
    let tagService;
    let vectorSearchService;
    const mockRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        search: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockTagService = {
        extractTags: jest.fn(),
        addTags: jest.fn(),
        removeTags: jest.fn(),
    };
    const mockVectorSearchService = {
        searchSimilar: jest.fn(),
        generateEmbedding: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                receipt_service_1.ReceiptService,
                {
                    provide: receipt_repository_1.ReceiptRepository,
                    useValue: mockRepository,
                },
                {
                    provide: tag_service_1.TagService,
                    useValue: mockTagService,
                },
                {
                    provide: vector_search_service_1.VectorSearchService,
                    useValue: mockVectorSearchService,
                },
            ],
        }).compile();
        service = module.get(receipt_service_1.ReceiptService);
        repository = module.get(receipt_repository_1.ReceiptRepository);
        tagService = module.get(tag_service_1.TagService);
        vectorSearchService = module.get(vector_search_service_1.VectorSearchService);
    });
    describe('事例登録', () => {
        it('新規事例を正常に登録できること', async () => {
            const createDto = {
                patientId: '12345',
                symptoms: '腰痛',
                treatment: '温熱療法',
                diagnosis: '急性腰痛症',
            };
            const expectedTags = ['腰痛', '温熱療法'];
            const expectedEmbedding = new Float32Array([0.1, 0.2, 0.3]);
            mockTagService.extractTags.mockResolvedValue(expectedTags);
            mockVectorSearchService.generateEmbedding.mockResolvedValue(expectedEmbedding);
            mockRepository.create.mockResolvedValue({ id: '1', ...createDto, tags: expectedTags });
            const result = await service.createReceipt(createDto);
            expect(result).toBeDefined();
            expect(result.id).toBe('1');
            expect(mockTagService.extractTags).toHaveBeenCalledWith(createDto.symptoms);
            expect(mockVectorSearchService.generateEmbedding).toHaveBeenCalled();
            expect(mockRepository.create).toHaveBeenCalled();
        });
    });
    describe('検索機能', () => {
        it('キーワードによる検索が正常に動作すること', async () => {
            const searchDto = {
                keyword: '腰痛',
                tags: ['温熱療法'],
            };
            const expectedResults = [
                { id: '1', patientId: '12345', symptoms: '腰痛', tags: ['腰痛', '温熱療法'] },
            ];
            mockRepository.search.mockResolvedValue(expectedResults);
            const results = await service.searchReceipts(searchDto);
            expect(results).toEqual(expectedResults);
            expect(mockRepository.search).toHaveBeenCalledWith(searchDto);
        });
    });
    describe('ベクトル検索', () => {
        it('類似事例の検索が正常に動作すること', async () => {
            const symptoms = '右肩の痛みと可動域制限';
            const expectedEmbedding = new Float32Array([0.1, 0.2, 0.3]);
            const expectedResults = [
                { id: '2', similarity: 0.95, symptoms: '右肩関節の疼痛' },
            ];
            mockVectorSearchService.generateEmbedding.mockResolvedValue(expectedEmbedding);
            mockVectorSearchService.searchSimilar.mockResolvedValue(expectedResults);
            const results = await service.findSimilarCases(symptoms);
            expect(results).toEqual(expectedResults);
            expect(mockVectorSearchService.generateEmbedding).toHaveBeenCalledWith(symptoms);
            expect(mockVectorSearchService.searchSimilar).toHaveBeenCalledWith(expectedEmbedding);
        });
    });
    describe('タグ管理', () => {
        it('タグの追加が正常に動作すること', async () => {
            const receiptId = '1';
            const newTags = ['運動療法', 'ストレッチ'];
            mockRepository.findById.mockResolvedValue({
                id: receiptId,
                tags: ['温熱療法'],
            });
            mockTagService.addTags.mockResolvedValue([...newTags, '温熱療法']);
            mockRepository.update.mockResolvedValue({
                id: receiptId,
                tags: [...newTags, '温熱療法'],
            });
            const result = await service.addTags(receiptId, newTags);
            expect(result.tags).toContain('運動療法');
            expect(result.tags).toContain('ストレッチ');
            expect(mockTagService.addTags).toHaveBeenCalledWith(receiptId, newTags);
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=receipt.service.spec.js.map