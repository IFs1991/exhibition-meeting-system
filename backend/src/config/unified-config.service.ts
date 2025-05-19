import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production'
}

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

@Injectable()
export class UnifiedConfigService {
  // アプリケーション全般の設定
  @IsEnum(Environment)
  nodeEnv: Environment;

  @IsNumber()
  port: number;

  @IsString()
  apiBaseUrl: string;

  @IsEnum(LogLevel)
  logLevel: LogLevel;

  // データベース接続設定
  @IsString()
  dbHost: string;

  @IsNumber()
  dbPort: number;

  @IsString()
  dbUsername: string;

  @IsString()
  dbPassword: string;

  @IsString()
  dbName: string;

  @IsBoolean()
  dbSynchronize: boolean;

  @IsBoolean()
  dbLogging: boolean;

  // 認証関連の設定
  @IsString()
  jwtSecret: string;

  @IsNumber()
  jwtExpiresIn: number;

  // Supabase関連の設定
  @IsString()
  supabaseUrl: string;

  @IsString()
  supabaseAnonKey: string;

  @IsString()
  supabaseServiceRoleKey: string;

  @IsString()
  supabaseJwtSecret: string;

  // レート制限の設定
  @IsNumber()
  rateLimitWindowMs: number;

  @IsNumber()
  rateLimitMaxRequests: number;

  // CORS設定
  @IsString({ each: true })
  corsOrigins: string[];

  // AI サービス設定
  @IsString()
  @IsOptional()
  googleProjectId?: string;

  @IsString()
  @IsOptional()
  geminiApiKey?: string;

  @IsString()
  @IsOptional()
  geminiModelName?: string;

  constructor() {
    config(); // .envファイルから環境変数を読み込む

    Object.assign(this, {
      // アプリケーション全般の設定
      nodeEnv: process.env.NODE_ENV || Environment.Development,
      port: parseInt(process.env.PORT || '3000', 10),
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
      logLevel: process.env.LOG_LEVEL || LogLevel.Info,

      // データベース接続設定
      dbHost: process.env.DB_HOST || 'localhost',
      dbPort: parseInt(process.env.DB_PORT || '5432', 10),
      dbUsername: process.env.DB_USERNAME || 'postgres',
      dbPassword: process.env.DB_PASSWORD || 'postgres',
      dbName: process.env.DB_NAME || 'exhibition_db',
      dbSynchronize: process.env.DB_SYNCHRONIZE === 'true',
      dbLogging: process.env.DB_LOGGING === 'true' || this.isDevelopment(),

      // 認証関連の設定
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key-for-development-only',
      jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10), // 24時間

      // Supabase関連の設定
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || '',

      // レート制限の設定
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15分
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

      // CORS設定
      corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],

      // AI サービス設定
      googleProjectId: process.env.GOOGLE_PROJECT_ID,
      geminiApiKey: process.env.GEMINI_API_KEY,
      geminiModelName: process.env.GEMINI_MODEL_NAME || 'gemini-pro',
    });

    this.validate();
  }

  private validate(): void {
    const validatedConfig = plainToClass(UnifiedConfigService, this);
    const errors = validateSync(validatedConfig);

    if (errors.length > 0) {
      throw new Error(`Configuration validation error: ${errors.toString()}`);
    }
  }

  // 環境判定ヘルパーメソッド
  public isDevelopment(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  public isStaging(): boolean {
    return this.nodeEnv === Environment.Staging;
  }

  public isProduction(): boolean {
    return this.nodeEnv === Environment.Production;
  }

  // データベース接続設定を取得するヘルパーメソッド
  public getTypeOrmConfig() {
    // Supabaseのデータベース接続情報を優先して使用する
    if (this.supabaseUrl) {
      // supabaseUrlから接続情報を抽出
      // 例: https://xyz.supabase.co -> db.xyz.supabase.co
      const hostMatch = this.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
      const supabaseHost = hostMatch ? `db.${hostMatch[1]}.supabase.co` : this.dbHost;

      return {
        type: 'postgres' as const,
        host: supabaseHost,
        port: 5432, // Supabaseは標準で5432ポートを使用
        username: 'postgres', // Supabaseでは通常 'postgres'
        password: this.supabaseServiceRoleKey, // service_roleキーをパスワードとして使用
        database: 'postgres', // Supabaseのデフォルトデータベース名
        ssl: true, // Supabase接続ではSSLが必要
        synchronize: this.dbSynchronize,
        logging: this.dbLogging,
      };
    }

    // Supabase情報がない場合は従来の接続情報を返す
    return {
      type: 'postgres' as const,
      host: this.dbHost,
      port: this.dbPort,
      username: this.dbUsername,
      password: this.dbPassword,
      database: this.dbName,
      synchronize: this.dbSynchronize,
      logging: this.dbLogging,
    };
  }
}