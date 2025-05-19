import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Reflector を使用してメタデータからロール情報を取得
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ロールが指定されていない場合は全てのユーザーにアクセスを許可
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // リクエストにユーザー情報がない場合はアクセス拒否
    if (!user || !user.id) {
      throw new ForbiddenException('Access denied: User authentication required');
    }

    // プロファイルテーブルからユーザーのロール情報を取得
    const profile = await this.profileRepository.findOne({ where: { id: user.id } });

    if (!profile) {
      throw new ForbiddenException('Access denied: User profile not found');
    }

    // ユーザーのロールが必要なロールに含まれているかチェック
    const hasRequiredRole = requiredRoles.includes(profile.role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(`Access denied: Required role(s): ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}