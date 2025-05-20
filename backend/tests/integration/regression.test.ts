import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
// import { UnifiedConfigService } from '../../config/unified-config.service';
import { ConfigModule } from '@nestjs/config';
// import { Profile } from '../../entities/profile.entity';
// import { UserRole } from '../../entities/user.entity';
import { AppModule } from '../../src/app.module';

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

describe('認証基盤変更後の回帰テスト', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // let configService: UnifiedConfigService;
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
      }),
      find: jest.fn().mockResolvedValue([
        { id: mockExhibitorId, role: UserRole.EXHIBITOR, fullName: 'テスト出展者' },
        { id: mockAdminId, role: UserRole.ADMIN, fullName: '管理者ユーザー' },
        { id: mockClientId, role: UserRole.CLIENT, fullName: 'クライアントユーザー', companyName: 'テスト企業株式会社' }
      ])
    };

    // JWTサービスとConfigサービスのモック
    jwtService = new JwtService();
    // configService = {
    //   supabaseJwtSecret: 'mock_jwt_secret',
    //   corsOrigins: ['http://localhost:3000'],
    //   port: 3000
    // } as any;

    // モジュール設定
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtService)
      // .overrideProvider(UnifiedConfigService)
      // .useValue(configService)
      .overrideProvider(getRepositoryToken(Profile))
      .useValue(profileRepository)
      .compile();

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

  describe('ユーザー管理機能', () => {
    it('認証済みユーザーがプロフィール情報を取得できる', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
    });

    it('ユーザー一覧が管理者に表示される', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('クライアント管理機能', () => {
    it('クライアント一覧が管理者に表示される', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('クライアントが管理者専用エンドポイントにアクセスできない', async () => {
      await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });
  });

  describe('展示会管理機能', () => {
    it('展示会一覧が表示される', async () => {
      const response = await request(app.getHttpServer())
        .get('/exhibitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('商談管理機能', () => {
    it('出展者が自分の商談を取得できる', async () => {
      const response = await request(app.getHttpServer())
        .get('/meetings/my')
        .set('Authorization', `Bearer ${exhibitorToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('クライアントが自分の商談を取得できる', async () => {
      const response = await request(app.getHttpServer())
        .get('/meetings/my')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});