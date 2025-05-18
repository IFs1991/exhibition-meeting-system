import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    // リクエストにユーザー情報がないか、ロールがない場合はアクセス拒否
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: User authentication required');
    }

    // ユーザーのロールが必要なロールに含まれているかチェック
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(`Access denied: Required role(s): ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}