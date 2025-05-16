import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../modules/app.module';
import { AppConfig } from '../config/app-config';
import { LoggingMiddleware } from '../middlewares/logging.middleware';
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  // グローバルミドルウェアの設定
  app.use(new LoggingMiddleware().use);
  app.use(new RateLimiterMiddleware(config).use);

  // バリデーションパイプの設定
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // グローバルフィルターとインターセプターの登録
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORSの設定
  app.enableCors({
    origin: config.corsOrigins,
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
  const port = config.port || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Application failed to start:', err);
  process.exit(1);
});