import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnifiedConfigService } from '../../config/unified-config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: UnifiedConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('認証トークンが見つかりません');
    }

    try {
      // Supabase JWTを検証
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.supabaseJwtSecret,
      });

      // リクエストオブジェクトにユーザー情報を追加
      // Supabase JWTでは、ユーザーIDは 'sub' クレームに格納されている
      request.user = {
        id: payload.sub,
        email: payload.email,
        ...payload,
      };
    } catch (error) {
      throw new UnauthorizedException('無効な認証トークンです');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}