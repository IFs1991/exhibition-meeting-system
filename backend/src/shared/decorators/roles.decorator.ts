import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * コントローラーやメソッドにアクセスするために必要なロールを指定するデコレータ
 * @param roles アクセスを許可するロールの配列
 * @example
 * // 管理者のみアクセス可能
 * @Roles(UserRole.ADMIN)
 * // 管理者または出展者のみアクセス可能
 * @Roles(UserRole.ADMIN, UserRole.EXHIBITOR)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);