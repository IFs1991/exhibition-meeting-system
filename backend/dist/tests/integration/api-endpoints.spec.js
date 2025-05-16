"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const user_controller_1 = require("../../modules/user/user.controller");
const ai_controller_1 = require("../../modules/ai/ai.controller");
const exhibition_controller_1 = require("../../modules/exhibition/exhibition.controller");
const client_controller_1 = require("../../modules/client/client.controller");
const meeting_controller_1 = require("../../modules/meeting/meeting.controller");
const stats_controller_1 = require("../../modules/stats/stats.controller");
(0, globals_1.describe)('API Integration Tests', () => {
    let app;
    let authToken;
    let adminAuthToken;
    let clientAuthToken;
    (0, globals_1.beforeEach)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            controllers: [
                user_controller_1.UserController,
                ai_controller_1.AIController,
                exhibition_controller_1.ExhibitionController,
                client_controller_1.ClientController,
                meeting_controller_1.MeetingController,
                stats_controller_1.StatsController,
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    (0, globals_1.afterEach)(async () => {
        await app.close();
    });
    (0, globals_1.describe)('認証フロー', () => {
        (0, globals_1.it)('ユーザー登録 -> ログイン -> トークン取得', async () => {
            const registerResponse = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'Password123!',
                clinicName: 'テスト整骨院',
            })
                .expect(201);
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: 'test@example.com',
                password: 'Password123!',
            })
                .expect(200);
            authToken = loginResponse.body.token;
            (0, globals_1.expect)(authToken).toBeDefined();
        });
        (0, globals_1.it)('管理者登録 -> 管理者ログイン -> 管理者トークン取得', async () => {
            const adminRegisterResponse = await request(app.getHttpServer())
                .post('/users/register')
                .send({
                email: 'admin@example.com',
                password: 'AdminPass123!',
                name: '管理者ユーザー',
                role: 'admin',
            })
                .expect(201);
            const adminLoginResponse = await request(app.getHttpServer())
                .post('/users/login')
                .send({
                email: 'admin@example.com',
                password: 'AdminPass123!',
            })
                .expect(200);
            adminAuthToken = adminLoginResponse.body.token;
            (0, globals_1.expect)(adminAuthToken).toBeDefined();
            const adminProfileResponse = await request(app.getHttpServer())
                .get('/users/profile')
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(adminProfileResponse.body.user.role).toBe('admin');
        });
        (0, globals_1.it)('クライアント登録 -> クライアントログイン -> クライアントトークン取得', async () => {
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
            const clientLoginResponse = await request(app.getHttpServer())
                .post('/users/login')
                .send({
                email: 'client@example.com',
                password: 'ClientPass123!',
            })
                .expect(200);
            clientAuthToken = clientLoginResponse.body.token;
            (0, globals_1.expect)(clientAuthToken).toBeDefined();
            const clientProfileResponse = await request(app.getHttpServer())
                .get('/users/profile')
                .set('Authorization', `Bearer ${clientAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(clientProfileResponse.body.user.role).toBe('client');
            (0, globals_1.expect)(clientProfileResponse.body.user.companyName).toBe('テスト企業株式会社');
        });
        (0, globals_1.it)('未認証アクセス時のエラーハンドリング', async () => {
            await request(app.getHttpServer())
                .get('/users/profile')
                .expect(401);
            await request(app.getHttpServer())
                .get('/users/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
        (0, globals_1.it)('権限制限のあるエンドポイントへのアクセス制御', async () => {
            await request(app.getHttpServer())
                .get('/clients')
                .set('Authorization', `Bearer ${clientAuthToken}`)
                .expect(403);
        });
    });
    (0, globals_1.describe)('事例管理フロー', () => {
        (0, globals_1.it)('事例登録 -> 検索 -> 詳細取得', async () => {
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
            const searchResponse = await request(app.getHttpServer())
                .get('/receipts/search')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ keyword: '腰痛' })
                .expect(200);
            (0, globals_1.expect)(searchResponse.body.results.length).toBeGreaterThan(0);
            await request(app.getHttpServer())
                .get(`/receipts/${caseId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
        });
    });
    (0, globals_1.describe)('理由書生成フロー', () => {
        (0, globals_1.it)('症状入力 -> AI生成 -> 結果取得', async () => {
            const symptoms = {
                patientId: 'P123',
                mainSymptom: '腰痛',
                details: '長時間の座位で増悪、安静時に軽減',
                duration: '2週間',
            };
            const generateResponse = await request(app.getHttpServer())
                .post('/ai/generate')
                .set('Authorization', `Bearer ${authToken}`)
                .send(symptoms)
                .expect(202);
            const taskId = generateResponse.body.taskId;
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await request(app.getHttpServer())
                .get(`/ai/results/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(resultResponse.body.content).toBeDefined();
        });
    });
    (0, globals_1.describe)('フィードバックフロー', () => {
        (0, globals_1.it)('理由書提出 -> 審査結果登録 -> フィードバック分析', async () => {
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
            const statsResponse = await request(app.getHttpServer())
                .get('/feedback/stats')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            (0, globals_1.expect)(statsResponse.body.approvalRate).toBeDefined();
        });
    });
    (0, globals_1.describe)('クライアント管理フロー', () => {
        (0, globals_1.it)('クライアント作成 -> 一覧取得 -> 詳細取得 -> 更新 -> 削除', async () => {
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
            (0, globals_1.expect)(clientId).toBeDefined();
            const listResponse = await request(app.getHttpServer())
                .get('/clients')
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(listResponse.body.clients.length).toBeGreaterThan(0);
            const detailResponse = await request(app.getHttpServer())
                .get(`/clients/${clientId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(detailResponse.body.client.companyName).toBe('テスト企業株式会社');
            const updateResponse = await request(app.getHttpServer())
                .put(`/clients/${clientId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .send({
                companyName: '更新テスト企業株式会社',
                notes: '更新されたメモ',
            })
                .expect(200);
            (0, globals_1.expect)(updateResponse.body.client.companyName).toBe('更新テスト企業株式会社');
            (0, globals_1.expect)(updateResponse.body.client.notes).toBe('更新されたメモ');
            await request(app.getHttpServer())
                .delete(`/clients/${clientId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            await request(app.getHttpServer())
                .get(`/clients/${clientId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(404);
        });
        (0, globals_1.it)('権限のないユーザーがクライアント管理機能にアクセスできないこと', async () => {
            await request(app.getHttpServer())
                .get('/clients')
                .set('Authorization', `Bearer ${clientAuthToken}`)
                .expect(403);
        });
    });
    (0, globals_1.describe)('展示会管理フロー', () => {
        (0, globals_1.it)('展示会作成 -> 一覧取得 -> 詳細取得 -> 更新 -> 削除', async () => {
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
            (0, globals_1.expect)(exhibitionId).toBeDefined();
            const listResponse = await request(app.getHttpServer())
                .get('/exhibitions')
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(listResponse.body.exhibitions.length).toBeGreaterThan(0);
            const detailResponse = await request(app.getHttpServer())
                .get(`/exhibitions/${exhibitionId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            (0, globals_1.expect)(detailResponse.body.exhibition.name).toBe('テスト展示会2025');
            const updateResponse = await request(app.getHttpServer())
                .patch(`/exhibitions/${exhibitionId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .send({
                description: '更新された説明文',
                isPublic: false,
            })
                .expect(200);
            (0, globals_1.expect)(updateResponse.body.exhibition.description).toBe('更新された説明文');
            (0, globals_1.expect)(updateResponse.body.exhibition.isPublic).toBe(false);
            await request(app.getHttpServer())
                .delete(`/exhibitions/${exhibitionId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(200);
            await request(app.getHttpServer())
                .get(`/exhibitions/${exhibitionId}`)
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .expect(404);
        });
    });
});
//# sourceMappingURL=api-endpoints.spec.js.map