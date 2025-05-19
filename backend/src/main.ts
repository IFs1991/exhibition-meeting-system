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
    .setDescription(`
展示会商談管理システムのRESTful API仕様書

## 認証方法

このAPIはSupabase Authを使用した認証を採用しています。

1. フロントエンドでSupabase Authで認証を行い、JWTを取得します。
2. 取得したJWTを \`Authorization: Bearer {token}\` 形式でリクエストヘッダーに含めてAPIにアクセスします。
3. JWTにはユーザーID (\`sub\` クレーム) が含まれており、これによってユーザーを特定します。
4. ユーザーのロールは、Profileテーブルから取得され、APIのアクセス制御に使用されます。

各エンドポイントには、必要な権限（ロール）が明記されています。
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Supabase JWTを入力してください',
        in: 'header'
      },
      'Supabase-JWT', // この値は @ApiBearerAuth() デコレータで参照します
    )
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