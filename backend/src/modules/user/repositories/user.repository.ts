import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../../entities/user.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly entityName: string = 'User';

  constructor(
    @InjectRepository(User)
    private readonly userRepositoryInstance: Repository<User>,
  ) {
    super(userRepositoryInstance.target, userRepositoryInstance.manager, userRepositoryInstance.queryRunner);
  }

  /**
   * メールアドレスでユーザーを検索します
   * @param email 検索するメールアドレス
   * @returns 見つかったユーザー、存在しない場合はnull
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepositoryInstance.findOne({ where: { email } });
  }

  /**
   * 指定されたロールのユーザーを全て取得します
   * @param role ユーザーロール
   * @returns ユーザーの配列
   */
  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepositoryInstance.find({ where: { role } });
  }

  /**
   * ユーザーの最終ログイン日時を更新します
   * @param id ユーザーID
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepositoryInstance.update(id, {
      lastLoginAt: new Date(),
    });
  }
}