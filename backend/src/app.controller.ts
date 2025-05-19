import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseService } from './config/supabase.service';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiResponse({ status: 200, description: 'サービスが正常に動作しています' })
  @ApiResponse({ status: 500, description: 'サービスに問題があります' })
  async healthCheck() {
    try {
      // Supabase接続テスト
      const supabaseClient = this.supabaseService.getClient();
      const { data, error } = await supabaseClient.from('profiles').select('count').limit(1);

      const supabaseStatus = error ? 'error' : 'connected';
      const supabaseMessage = error ? error.message : 'Successfully connected to Supabase';

      return {
        status: 'ok',
        message: 'Service is healthy',
        timestamp: new Date().toISOString(),
        supabaseConnection: supabaseStatus,
        supabaseInfo: supabaseMessage,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Service has issues',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
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