import { config } from 'dotenv';
import { IsString, IsNumber, IsEnum, validateSync } from 'class-validator';
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

export class AppConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  API_BASE_URL: string;

  @IsEnum(LogLevel)
  LOG_LEVEL: LogLevel;

  @IsNumber()
  RATE_LIMIT_WINDOW_MS: number;

  @IsNumber()
  RATE_LIMIT_MAX_REQUESTS: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRES_IN: number;

  constructor() {
    config();
    Object.assign(this, {
      NODE_ENV: process.env.NODE_ENV || Environment.Development,
      PORT: parseInt(process.env.PORT || '3000', 10),
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
      LOG_LEVEL: process.env.LOG_LEVEL || LogLevel.Info,
      RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
      JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10),
    });
  }

  public validate(): void {
    const validatedConfig = plainToClass(AppConfig, this);
    const errors = validateSync(validatedConfig);

    if (errors.length > 0) {
      throw new Error(`Configuration validation error: ${errors.toString()}`);
    }
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === Environment.Development;
  }

  public isStaging(): boolean {
    return this.NODE_ENV === Environment.Staging;
  }

  public isProduction(): boolean {
    return this.NODE_ENV === Environment.Production;
  }
}

export const appConfig = new AppConfig();
appConfig.validate();