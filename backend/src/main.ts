import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UnifiedConfigService } from './config/unified-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(UnifiedConfigService);

  // バリデーションパイプを設定
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS設定
  app.enableCors({
    origin: configService.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // APIプレフィックスを設定
  app.setGlobalPrefix('api');

  // Swagger設定
  const swaggerConfig = new DocumentBuilder()
    .setTitle('展示会商談管理システム API')
    .setDescription('展示会商談管理システムのRESTful API仕様書')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // サーバー起動
  const port = configService.port;
  await app.listen(port);
  console.log(`アプリケーションは http://localhost:${port}/api で起動しています`);
  console.log(`APIドキュメントは http://localhost:${port}/api/docs で確認できます`);
}

bootstrap().catch(err => {
  console.error('アプリケーションの起動に失敗しました:', err);
  process.exit(1);
});