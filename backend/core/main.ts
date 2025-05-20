import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from '../config/app-config';
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = appConfig;

  // グローバルミドルウェアの設定
  app.use(new RateLimiterMiddleware(config).use);

  // バリデーションパイプの設定
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORSの設定
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // APIのプレフィックスを設定
  app.setGlobalPrefix('api');

  // Swaggerドキュメントの設定
  const swaggerConfig = new DocumentBuilder()
    .setTitle('レセプト理由書アシスタントAPI')
    .setDescription('整骨院向けレセプト理由書作成支援システムのAPI仕様書')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // アプリケーションの起動
  const port = config.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Application failed to start:', err);
  process.exit(1);
});