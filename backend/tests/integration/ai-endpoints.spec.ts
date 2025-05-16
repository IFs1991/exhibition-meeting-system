import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { JwtAuthGuard } from '../../modules/user/guards/auth.guard';
import { RolesGuard } from '../../modules/user/guards/roles.guard';

describe('AI Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // テスト用のアプリケーションインスタンスを作成
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard) // 認証をバイパス
    .useValue({
      canActivate: () => true,
    })
    .overrideGuard(RolesGuard) // 権限チェックをバイパス
    .useValue({
      canActivate: () => true,
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // テスト用の認証トークンを取得（モック）
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