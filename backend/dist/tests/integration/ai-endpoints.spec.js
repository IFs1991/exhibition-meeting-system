"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../src/app.module");
const auth_guard_1 = require("../../modules/user/guards/auth.guard");
const roles_guard_1 = require("../../modules/user/guards/roles.guard");
describe('AI Endpoints (e2e)', () => {
    let app;
    let authToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideGuard(auth_guard_1.JwtAuthGuard)
            .useValue({
            canActivate: () => true,
        })
            .overrideGuard(roles_guard_1.RolesGuard)
            .useValue({
            canActivate: () => true,
        })
            .compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        authToken = 'test-token';
    });
    afterAll(async () => {
        await app.close();
    });
    describe('/ai/meeting-purpose (POST)', () => {
        it('should return suggestions for meeting purpose', async () => {
            const payload = {
                exhibitionInfo: { name: 'テスト展示会', id: '1' },
                keywords: ['ビジネスマッチング', '連携', '業務提携']
            };
            const response = await request(app.getHttpServer())
                .post('/ai/meeting-purpose')
                .set('Authorization', `Bearer ${authToken}`)
                .send(payload)
                .expect(200);
            expect(response.body).toHaveProperty('suggestions');
            expect(Array.isArray(response.body.suggestions)).toBe(true);
            expect(response.body.suggestions.length).toBeGreaterThan(0);
        });
        it('should work without optional parameters', async () => {
            const response = await request(app.getHttpServer())
                .post('/ai/meeting-purpose')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(200);
            expect(response.body).toHaveProperty('suggestions');
            expect(Array.isArray(response.body.suggestions)).toBe(true);
        });
    });
    describe('/ai/suggest (POST)', () => {
        it('should return suggestion based on prompt', async () => {
            const payload = {
                prompt: 'テスト用プロンプト',
            };
            const response = await request(app.getHttpServer())
                .post('/ai/suggest')
                .set('Authorization', `Bearer ${authToken}`)
                .send(payload)
                .expect(200);
            expect(response.body).toHaveProperty('result');
            expect(typeof response.body.result).toBe('string');
        });
        it('should handle context when provided', async () => {
            const payload = {
                prompt: 'テスト用プロンプト',
                context: { key: 'value' }
            };
            const response = await request(app.getHttpServer())
                .post('/ai/suggest')
                .set('Authorization', `Bearer ${authToken}`)
                .send(payload)
                .expect(200);
            expect(response.body).toHaveProperty('result');
            expect(typeof response.body.result).toBe('string');
        });
    });
});
//# sourceMappingURL=ai-endpoints.spec.js.map