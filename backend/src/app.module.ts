import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UnifiedConfigService } from './config/unified-config.service';
import { dataSourceOptions } from './database/data-source';
import { UserModule } from './modules/user/user.module';
import { ClientModule } from './modules/client/client.module';
import { ExhibitionModule } from './modules/exhibition/exhibition.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    // 設定モジュールをグローバルに登録
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // TypeORMモジュールを設定
    TypeOrmModule.forRoot(dataSourceOptions),

    // 機能モジュール
    UserModule,
    ClientModule,
    ExhibitionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UnifiedConfigService,
    // グローバル例外フィルターを登録
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}