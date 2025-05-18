import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from '../../../entities/user.entity';
import { LoginDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ユーザー認証とトークン発行を行います
   * @param loginDto ログイン情報
   * @returns アクセストークンとユーザー情報
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }

    // 最終ログイン日時を更新
    await this.userService.updateLastLogin(user.id);

    // JWTペイロード作成
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // トークン生成
    const accessToken = this.jwtService.sign(payload);

    // パスワード関連情報を除外したユーザー情報を返却
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  /**
   * JWTトークンからユーザー情報を取得します
   * @param token JWTトークン
   * @returns ユーザー情報
   */
  async getUserFromToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOneById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('ユーザーが見つかりません');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('無効なトークンです');
    }
  }

  /**
   * ユーザー認証を行います
   * @param email メールアドレス
   * @param password パスワード
   * @returns 認証されたユーザー情報、または null
   */
  private async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.passwordHash) {
      return null;
    }

    // パスワードを検証
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    // アクティブなユーザーか確認
    if (!user.isActive) {
      throw new UnauthorizedException('アカウントが無効化されています');
    }

    return user;
  }
}