import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UnifiedConfigService } from './unified-config.service';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;

  constructor(private configService: UnifiedConfigService) {
    // 通常のクライアント（匿名キー使用、制限されたアクセス権）
    this.supabaseClient = createClient(
      this.configService.supabaseUrl,
      this.configService.supabaseAnonKey,
    );

    // 管理者権限を持つクライアント（サービスロールキー使用、フル権限）
    this.supabaseAdminClient = createClient(
      this.configService.supabaseUrl,
      this.configService.supabaseServiceRoleKey,
    );
  }

  /**
   * 一般的な操作用のSupabaseクライアントを取得
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * 管理者権限が必要な操作用のSupabaseクライアントを取得
   */
  getAdminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }

  /**
   * ユーザー認証情報を検証
   * @param token JWTトークン
   */
  async verifyToken(token: string) {
    const { data, error } = await this.supabaseClient.auth.getUser(token);

    if (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }

    return data;
  }

  /**
   * ユーザーのプロファイル情報を取得
   * @param userId ユーザーID
   */
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }

    return data;
  }

  /**
   * 管理者権限でユーザーを作成
   * @param email メールアドレス
   * @param password パスワード
   * @param userData 追加のユーザーデータ
   */
  async createUser(email: string, password: string, userData?: any) {
    // ユーザーの作成
    const { data: authData, error: authError } = await this.supabaseAdminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // メール確認済みとしてマーク
    });

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    // プロファイル情報の追加
    if (authData.user && userData) {
      const { error: profileError } = await this.supabaseAdminClient
        .from('profiles')
        .upsert({
          id: authData.user.id,
          ...userData,
          created_at: new Date(),
          updated_at: new Date(),
        });

      if (profileError) {
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
    }

    return authData;
  }
}