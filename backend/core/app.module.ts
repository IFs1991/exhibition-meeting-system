import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../modules/user/user.module';
import { ReceiptModule } from '../modules/receipt/receipt.module';
import { AiModule } from '../modules/ai/ai.module';
// import { FeedbackModule } from '../modules/feedback/feedback.module'; // File does not exist
import { StatsModule } from '../modules/stats/stats.module';
import { ClientModule } from '../modules/client/client.module';
import { MeetingModule } from '../modules/meeting/meeting.module';
import { LoggerService } from '../services/common/logger.service';
// import { ErrorHandlerService } from '../services/common/error-handler.service'; // File does not exist

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
    // FeedbackModule, // Commented out as file does not exist
    StatsModule,
    ClientModule,
    MeetingModule
  ],
  providers: [
    LoggerService,
    // ErrorHandlerService, // Commented out as file does not exist
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggerService
    },
    // {
    //   provide: 'APP_FILTER',
    //   useClass: ErrorHandlerService // Commented out
    // }
  ],
  // exports: [LoggerService, ErrorHandlerService] // Commented out ErrorHandlerService
  exports: [LoggerService]
})
export class AppModule {}