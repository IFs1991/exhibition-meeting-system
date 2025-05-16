import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  // 認証関連のエンドポイント
  @Get('auth/profile')
  getProfile() {
    return { user: { id: 1, name: '開発ユーザー', email: 'dev@example.com', role: 'admin' } };
  }

  @Post('auth/login')
  login(@Body() loginData: { email: string; password: string }) {
    return {
      user: { id: 1, name: '開発ユーザー', email: loginData.email, role: 'admin' },
      token: 'dev-token-12345'
    };
  }
}