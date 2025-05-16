import { aiAPI } from '../lib/api';
import fetchMock from 'jest-fetch-mock';

// モックの設定
beforeAll(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('AI API', () => {
  describe('generateMeetingPurpose', () => {
    it('should return suggestions when called with exhibition info', async () => {
      // モックレスポンスの設定
      const mockResponse = {
        suggestions: [
          '商談目的1',
          '商談目的2',
          '商談目的3',
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const exhibitionInfo = { name: 'テスト展示会', id: '1' };
      const result = await aiAPI.generateMeetingPurpose({ exhibitionInfo });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // 正しいエンドポイントとメソッドでリクエストされたか確認
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toContain('/ai/meeting-purpose');
      expect(options.method).toBe('POST');

      // リクエストボディの確認
      const body = JSON.parse(options.body as string);
      expect(body).toHaveProperty('exhibitionInfo');
      expect(body.exhibitionInfo).toEqual(exhibitionInfo);
    });

    it('should return suggestions when called with keywords', async () => {
      // モックレスポンスの設定
      const mockResponse = {
        suggestions: [
          'キーワードを含む商談目的1',
          'キーワードを含む商談目的2',
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const keywords = ['ビジネスマッチング', '業務提携'];
      const result = await aiAPI.generateMeetingPurpose({ keywords });

      expect(result).toEqual(mockResponse);

      // リクエストボディの確認
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      expect(body).toHaveProperty('keywords');
      expect(body.keywords).toEqual(keywords);
    });

    it('should handle errors gracefully', async () => {
      fetchMock.mockRejectOnce(new Error('API Error'));

      await expect(aiAPI.generateMeetingPurpose({})).rejects.toThrow();
    });
  });

  describe('generateSuggestion', () => {
    it('should return a suggestion when called with prompt', async () => {
      // モックレスポンスの設定
      const mockResponse = {
        result: 'これはAIによる提案です'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const prompt = 'テスト用プロンプト';
      const result = await aiAPI.generateSuggestion(prompt);

      expect(result).toEqual(mockResponse);

      // リクエストボディの確認
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      expect(body).toHaveProperty('prompt');
      expect(body.prompt).toBe(prompt);
    });

    it('should include context when provided', async () => {
      // モックレスポンスの設定
      const mockResponse = {
        result: 'コンテキスト付きの提案'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const prompt = 'テスト用プロンプト';
      const context = { data: 'test context' };
      const result = await aiAPI.generateSuggestion(prompt, context);

      expect(result).toEqual(mockResponse);

      // リクエストボディの確認
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      expect(body).toHaveProperty('prompt');
      expect(body).toHaveProperty('context');
      expect(body.prompt).toBe(prompt);
      expect(body.context).toEqual(context);
    });
  });
});