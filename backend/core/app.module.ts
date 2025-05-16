import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { AiModule } from './modules/ai/ai.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { StatsModule } from './modules/stats/stats.module';
import { ClientModule } from './modules/client/client.module';
import { MeetingModule } from '../modules/meeting/meeting.module'; // Corrected path
import { LoggerService } from './services/common/logger.service';
import { ErrorHandlerService } from './services/common/error-handler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production'
      })
    }),
    UserModule,
    ReceiptModule,
    AiModule,
    FeedbackModule,
    StatsModule,
    ClientModule,
    MeetingModule
  ],
  providers: [
    LoggerService,
    ErrorHandlerService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggerService
    },
    {
      provide: 'APP_FILTER',
      useClass: ErrorHandlerService
    }
  ],
  exports: [LoggerService, ErrorHandlerService]
})
export class AppModule {}