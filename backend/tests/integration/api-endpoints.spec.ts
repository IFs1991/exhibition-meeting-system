import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../../modules/user/user.controller';
import { AIController } from '../../modules/ai/ai.controller';
import { ExhibitionController } from '../../modules/exhibition/exhibition.controller';
import { ClientController } from '../../modules/client/client.controller';
import { MeetingController } from '../../modules/meeting/meeting.controller';
import { StatsController } from '../../modules/stats/stats.controller';

describe('API Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let adminAuthToken: string;
  let clientAuthToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        UserController,
        AIController,
        ExhibitionController,
        ClientController,
        MeetingController,
        StatsController,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('認証フロー', () => {
    it('ユーザー登録 -> ログイン -> トークン取得', async () => {
      // ユーザー登録
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          clinicName: 'テスト整骨院',
        })
        .expect(201);

      // ログイン
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200);

      authToken = loginResponse.body.token;
      expect(authToken).toBeDefined();
    });

    // 展示会システム向けの認証テスト
    it('管理者登録 -> 管理者ログイン -> 管理者トークン取得', async () => {
      // 管理者登録
      const adminRegisterResponse = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
          name: '管理者ユーザー',
          role: 'admin',
        })
        .expect(201);

      // 管理者ログイン
      const adminLoginResponse = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
        })
        .expect(200);

      adminAuthToken = adminLoginResponse.body.token;
      expect(adminAuthToken).toBeDefined();

      // 管理者プロフィール取得
      const adminProfileResponse = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      expect(adminProfileResponse.body.user.role).toBe('admin');
    });

    it('クライアント登録 -> クライアントログイン -> クライアントトークン取得', async () => {
      // クライアント登録
      const clientRegisterResponse = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          email: 'client@example.com',
          password: 'ClientPass123!',
          name: 'クライアントユーザー',
          role: 'client',
          companyName: 'テスト企業株式会社',
          industry: 'IT・通信',
        })
        .expect(201);

      // クライアントログイン
      const clientLoginResponse = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'client@example.com',
          password: 'ClientPass123!',
        })
        .expect(200);

      clientAuthToken = clientLoginResponse.body.token;
      expect(clientAuthToken).toBeDefined();

      // クライアントプロフィール取得
      const clientProfileResponse = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${clientAuthToken}`)
        .expect(200);

      expect(clientProfileResponse.body.user.role).toBe('client');
      expect(clientProfileResponse.body.user.companyName).toBe('テスト企業株式会社');
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

    it('権限制限のあるエンドポイントへのアクセス制御', async () => {
      // クライアントが管理者専用エンドポイントへアクセス
      await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${clientAuthToken}`)
        .expect(403);
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
        .set('Authorization', `Bearer ${authToken}`)
        .send(receiptCase)
        .expect(201);

      const caseId = createResponse.body.id;

      // 事例検索
      const searchResponse = await request(app.getHttpServer())
        .get('/receipts/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ keyword: '腰痛' })
        .expect(200);

      expect(searchResponse.body.results.length).toBeGreaterThan(0);

      // 詳細取得
      await request(app.getHttpServer())
        .get(`/receipts/${caseId}`)
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send(symptoms)
        .expect(202);

      const taskId = generateResponse.body.taskId;

      // 生成結果取得
      await new Promise(resolve => setTimeout(resolve, 1000));

      const resultResponse = await request(app.getHttpServer())
        .get(`/ai/results/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send(feedback)
        .expect(201);

      // フィードバック統計取得
      const statsResponse = await request(app.getHttpServer())
        .get('/feedback/stats')
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send(clientData)
        .expect(201);

      const clientId = createResponse.body.client.id;
      expect(clientId).toBeDefined();

      // クライアント一覧取得
      const listResponse = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      expect(listResponse.body.clients.length).toBeGreaterThan(0);

      // クライアント詳細取得
      const detailResponse = await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      expect(detailResponse.body.client.companyName).toBe('テスト企業株式会社');

      // クライアント更新
      const updateResponse = await request(app.getHttpServer())
        .put(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
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
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      // 削除後の取得確認 (404が期待される)
      await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(404);
    });

    it('権限のないユーザーがクライアント管理機能にアクセスできないこと', async () => {
      // 一般クライアントユーザーが管理者用クライアント一覧APIにアクセス
      await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${clientAuthToken}`)
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
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send(exhibitionData)
        .expect(201);

      const exhibitionId = createResponse.body.exhibition.id;
      expect(exhibitionId).toBeDefined();

      // 展示会一覧取得
      const listResponse = await request(app.getHttpServer())
        .get('/exhibitions')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      expect(listResponse.body.exhibitions.length).toBeGreaterThan(0);

      // 展示会詳細取得
      const detailResponse = await request(app.getHttpServer())
        .get(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      expect(detailResponse.body.exhibition.name).toBe('テスト展示会2025');

      // 展示会更新
      const updateResponse = await request(app.getHttpServer())
        .patch(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
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
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);

      // 削除後の取得確認 (404が期待される)
      await request(app.getHttpServer())
        .get(`/exhibitions/${exhibitionId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(404);
    });
  });
});