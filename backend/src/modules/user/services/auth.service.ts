import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../../entities/profile.entity';
import { UnifiedConfigService } from '../../../config/unified-config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly configService: UnifiedConfigService,
  ) {}

  /**
   * JWTトークンからユーザープロファイル情報を取得します
   * @param token Supabase JWTトークン
   * @returns プロファイル情報
   */
  async getProfileFromToken(token: string): Promise<Profile> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.supabaseJwtSecret,
      });

      const profile = await this.profileRepository.findOne({
        where: { id: payload.sub }
      });

      if (!profile) {
        throw new UnauthorizedException('プロファイルが見つかりません');
      }

      return profile;
    } catch (error) {
      throw new UnauthorizedException('無効なトークンです');
    }
  }
}