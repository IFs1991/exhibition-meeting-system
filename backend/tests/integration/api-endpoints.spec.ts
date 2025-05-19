import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../../modules/user/user.controller';
import { AIController } from '../../modules/ai/ai.controller';
import { ExhibitionController } from '../../modules/exhibition/exhibition.controller';
import { ClientController } from '../../modules/client/client.controller';
import { MeetingController } from '../../modules/meeting/meeting.controller';
import { StatsController } from '../../modules/stats/stats.controller';
import { JwtService } from '@nestjs/jwt';
import { UnifiedConfigService } from '../../config/unified-config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { UserRole } from '../../entities/user.entity';

// Supabase JWTをモックするための関数
const generateMockSupabaseJwt = (userId: string, email: string, role?: string) => {
  const jwtService = new JwtService();
  const payload = {
    sub: userId,
    email: email,
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1時間後に期限切れ
    iat: Math.floor(Date.now() / 1000),
    role: role
  };
  return jwtService.sign(payload, { secret: 'mock_jwt_secret' });
};

describe('API Integration Tests', () => {
  let app: INestApplication;
  let mockProfile: any;
  let jwtService: JwtService;
  let configService: UnifiedConfigService;
  let profileRepository: any;

  // モックトークン
  let exhibitorToken: string;
  let adminToken: string;
  let clientToken: string;

  // モックユーザーID
  const mockExhibitorId = '123e4567-e89b-12d3-a456-426614174000';
  const mockAdminId = '123e4567-e89b-12d3-a456-426614174001';
  const mockClientId = '123e4567-e89b-12d3-a456-426614174002';

  beforeEach(async () => {
    // プロファイルリポジトリのモック
    profileRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const profiles = {
          [mockExhibitorId]: { id: mockExhibitorId, role: UserRole.EXHIBITOR, fullName: 'テスト出展者' },
          [mockAdminId]: { id: mockAdminId, role: UserRole.ADMIN, fullName: '管理者ユーザー' },
          [mockClientId]: { id: mockClientId, role: UserRole.CLIENT, fullName: 'クライアントユーザー', companyName: 'テスト企業株式会社' }
        };
        return Promise.resolve(profiles[where.id]);
      })
    };

    // JWTサービスとConfigサービスのモック
    jwtService = new JwtService();
    configService = {
      supabaseJwtSecret: 'mock_jwt_secret',
      corsOrigins: ['http://localhost:3000'],
      port: 3000
    } as any;

    // モジュール設定
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        UserController,
        AIController,
        ExhibitionController,
        ClientController,
        MeetingController,
        StatsController,
      ],
      providers: [
        { provide: JwtService, useValue: jwtService },
        { provide: UnifiedConfigService, useValue: configService },
        { provide: getRepositoryToken(Profile), useValue: profileRepository }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // モックトークンの生成
    exhibitorToken = generateMockSupabaseJwt(
      mockExhibitorId,
      'exhibitor@example.com'
    );

    adminToken = generateMockSupabaseJwt(
      mockAdminId,
      'admin@example.com'
    );

    clientToken = generateMockSupabaseJwt(
      mockClientId,
      'client@example.com'
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Supabase認証・認可フロー', () => {
    it('認証済みユーザーがプロフィール情報を取得できる', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);

      expect(response.body.user.id).toBe(mockExhibitorId);
      expect(response.body.user.fullName).toBe('テスト出展者');
    });

    it('管理者ユーザーが管理者専用エンドポイントにアクセスできる', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('クライアントユーザーが管理者専用エンドポイントにアクセスできない', async () => {
      await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });

    it('未認証アクセス時のエラーハンドリング', async () => {
      // 認証が必要なエンドポイントへの未認証アクセス
      await request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);

      // 無効なトークンでのアクセス
      await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('有効期限切れのトークンでアクセスできない', async () => {
      // 有効期限切れのトークンを生成
      const expiredToken = jwtService.sign({
        sub: mockExhibitorId,
        email: 'exhibitor@example.com',
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1時間前に期限切れ
        iat: Math.floor(Date.now() / 1000) - 7200,
      }, { secret: 'mock_jwt_secret' });

      await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('事例管理フロー', () => {
    it('事例登録 -> 検索 -> 詳細取得', async () => {
      // 事例登録
      const receiptCase = {
        patientId: 'P123',
        symptoms: '腰痛、右足のしびれ',
        diagnosis: '腰椎椎間板ヘルニア',
        treatment: '徒手療法、物理療法',
        tags: ['腰痛', '神経症状'],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/receipts')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .send(receiptCase)
        .expect(201);

      const caseId = createResponse.body.id;

      // 事例検索
      const searchResponse = await request(app.getHttpServer())
        .get('/receipts/search')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .query({ keyword: '腰痛' })
        .expect(200);

      expect(searchResponse.body.results.length).toBeGreaterThan(0);

      // 詳細取得
      await request(app.getHttpServer())
        .get(`/receipts/${caseId}`)
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);
    });
  });

  describe('理由書生成フロー', () => {
    it('症状入力 -> AI生成 -> 結果取得', async () => {
      const symptoms = {
        patientId: 'P123',
        mainSymptom: '腰痛',
        details: '長時間の座位で増悪、安静時に軽減',
        duration: '2週間',
      };

      // 理由書生成リクエスト
      const generateResponse = await request(app.getHttpServer())
        .post('/ai/generate')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .send(symptoms)
        .expect(202);

      const taskId = generateResponse.body.taskId;

      // 生成結果取得
      await new Promise(resolve => setTimeout(resolve, 1000));

      const resultResponse = await request(app.getHttpServer())
        .get(`/ai/results/${taskId}`)
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);

      expect(resultResponse.body.content).toBeDefined();
    });
  });

  describe('フィードバックフロー', () => {
    it('理由書提出 -> 審査結果登録 -> フィードバック分析', async () => {
      // フィードバック登録
      const feedback = {
        receiptId: 'R123',
        status: 'APPROVED',
        comments: '適切な理由書記載',
        reviewDate: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/feedback')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .send(feedback)
        .expect(201);

      // フィードバック統計取得
      const statsResponse = await request(app.getHttpServer())
        .get('/feedback/stats')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);

      expect(statsResponse.body.approvalRate).toBeDefined();
    });
  });

  describe('クライアント管理フロー', () => {
    it('クライアント作成 -> 一覧取得 -> 詳細取得 -> 更新 -> 削除', async () => {
      // クライアント作成
      const clientData = {
        companyName: 'テスト企業株式会社',
        industry: 'IT・通信',
        contactPerson: '山田太郎',
        email: 'client-test@example.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区渋谷1-1-1',
        notes: 'テスト用クライアントデータ',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clientData)
        .expect(201);

      const clientId = createResponse.body.client.id;
      expect(clientId).toBeDefined();

      // クライアント一覧取得
      const listResponse = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listResponse.body.clients.length).toBeGreaterThan(0);

      // クライアント詳細取得
      const detailResponse = await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(detailResponse.body.client.companyName).toBe('テスト企業株式会社');

      // クライアント更新
      const updateResponse = await request(app.getHttpServer())
        .put(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyName: '更新テスト企業株式会社',
          notes: '更新されたメモ',
        })
        .expect(200);

      expect(updateResponse.body.client.companyName).toBe('更新テスト企業株式会社');
      expect(updateResponse.body.client.notes).toBe('更新されたメモ');

      // クライアント削除
      await request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // 削除後の取得確認 (404が期待される)
      await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('権限のないユーザーがクライアント管理機能にアクセスできないこと', async () => {
      // 一般クライアントユーザーが管理者用クライアント一覧APIにアクセス
      await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });
  });

  describe('展示会管理フロー', () => {
    it('展示会作成 -> 一覧取得 -> 詳細取得 -> 更新 -> 削除', async () => {
      // 展示会作成
      const exhibitionData = {
        name: 'テスト展示会2025',
        description: 'ビジネスマッチングのための展示会',
        startDate: '2025-07-15',
        endDate: '2025-07-17',
        location: '東京国際フォーラム',
        isPublic: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/exhibitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(exhibitionData)
        .expect(201);

      const exhibitionId = createResponse.body.exhibition.id;
      expect(exhibitionId).toBeDefined();

      // 展示会一覧取得
      const listResponse = await request(app.getHttpServer())
        .get('/exhibitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listResponse.body.exhibitions.length).toBeGreaterThan(0);

      // 展示会詳細取得
      const detailResponse = await request(app.getHttpServer())
        .get(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(detailResponse.body.exhibition.name).toBe('テスト展示会2025');

      // 展示会更新
      const updateResponse = await request(app.getHttpServer())
        .patch(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: '更新された説明文',
          isPublic: false,
        })
        .expect(200);

      expect(updateResponse.body.exhibition.description).toBe('更新された説明文');
      expect(updateResponse.body.exhibition.isPublic).toBe(false);

      // 展示会削除
      await request(app.getHttpServer())
        .delete(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // 削除後の取得確認 (404が期待される)
      await request(app.getHttpServer())
        .get(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});