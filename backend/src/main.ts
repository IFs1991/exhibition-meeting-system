import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORSを有効化
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }));

  // APIプレフィックスを設定
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log(`アプリケーションは http://localhost:3001/api で起動しています`);
}
bootstrap();