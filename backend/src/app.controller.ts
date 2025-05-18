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
    // メールアドレスに基づいて適切なロールを返す
    const isAdmin = loginData.email.includes('admin');
    const userName = isAdmin ? '管理者ユーザー' : 'クライアントユーザー';
    const userRole = isAdmin ? 'admin' : 'client';

    console.log(`[Auth] ログイン処理: email=${loginData.email}, role=${userRole}`);

    return {
      user: {
        id: isAdmin ? 1 : 2,
        name: userName,
        email: loginData.email,
        role: userRole
      },
      token: `${userRole}-token-${Date.now()}`
    };
  }
}