import { Test, TestingModule } from '@nestjs/testing';
// import { AiService } from '../modules/ai/ai.service';
import { ConfigService } from '@nestjs/config';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSuggestion', () => {
    it('should return a suggestion string', async () => {
      const result = await service.generateSuggestion('テスト用プロンプト');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle context', async () => {
      const result = await service.generateSuggestion('テスト用プロンプト', { key: 'value' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateMeetingPurpose', () => {
    it('should return an array of suggestions', async () => {
      const result = await service.generateMeetingPurpose();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include exhibition name in suggestions when provided', async () => {
      const exhibitionInfo = { name: 'テスト展示会', id: '1' };
      const result = await service.generateMeetingPurpose(null, exhibitionInfo);

      // 少なくとも1つの提案に展示会名が含まれているか確認
      const hasSuggestionWithExhibitionName = result.some(suggestion =>
        suggestion.includes(exhibitionInfo.name)
      );
      expect(hasSuggestionWithExhibitionName).toBe(true);
    });

    it('should include industry-specific suggestions when client info is provided', async () => {
      const clientInfo = { industry: 'IT・通信' };
      const result = await service.generateMeetingPurpose(clientInfo);

      // IT・通信業界向けの提案が含まれているか確認
      const hasITSuggestion = result.some(suggestion =>
        suggestion.includes('IT技術') || suggestion.includes('デジタル')
      );
      expect(hasITSuggestion).toBe(true);
    });

    it('should include keywords in suggestions when provided', async () => {
      const keywords = ['業務提携', 'イノベーション'];
      const result = await service.generateMeetingPurpose(null, null, keywords);

      // キーワードを含む提案があるか確認
      const hasSuggestionWithKeywords = result.some(suggestion =>
        keywords.some(keyword => suggestion.includes(keyword))
      );
      expect(hasSuggestionWithKeywords).toBe(true);
    });
  });

  describe('getChatHistory', () => {
    it('should return an array of chat history items', async () => {
      const sessionId = 'test-session';
      const result = await service.getChatHistory(sessionId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // 各履歴アイテムに必要なプロパティがあることを確認
      result.forEach(item => {
        expect(item).toHaveProperty('sessionId');
        expect(item).toHaveProperty('request');
        expect(item).toHaveProperty('response');
        expect(item).toHaveProperty('createdAt');
      });
    });
  });
});