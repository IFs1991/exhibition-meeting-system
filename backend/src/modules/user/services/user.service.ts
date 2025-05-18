import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { BaseCrudService } from '../../../shared/services/base-crud.service';
import { CreateUserDto, UpdateUserDto, UserPaginationDto } from '../dto/user.dto';

@Injectable()
export class UserService extends BaseCrudService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
    this.entityName = 'User'; // エラーメッセージ用のエンティティ名設定
  }

  /**
   * ユーザーを作成します
   * @param createUserDto ユーザー作成DTOオブジェクト
   * @returns 作成されたユーザーオブジェクト（パスワードを除く）
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // メールアドレスが既に使われていないか確認
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('このメールアドレスは既に登録されています');
    }

    // パスワードをハッシュ化
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // ユーザーオブジェクトを作成して保存
    const newUser = await this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: createUserDto.role || UserRole.USER,
      isActive: true,
    });

    // パスワードハッシュを削除してから返却
    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  /**
   * ユーザー情報を更新します
   * @param id 更新するユーザーのID
   * @param updateUserDto ユーザー更新DTOオブジェクト
   * @returns 更新されたユーザーオブジェクト（パスワードを除く）
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.update(id, updateUserDto, 'User');

    // パスワードハッシュを削除してから返却
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  /**
   * パスワードを変更します
   * @param id ユーザーID
   * @param currentPassword 現在のパスワード
   * @param newPassword 新しいパスワード
   * @returns 成功時はtrue
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOneByIdOrFail(id, 'User');

    // 現在のパスワードを検証
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('現在のパスワードが正しくありません');
    }

    // 新しいパスワードをハッシュ化して保存
    const hashedPassword = await this.hashPassword(newPassword);
    await this.userRepository.update(id, { passwordHash: hashedPassword }, 'User');

    return true;
  }

  /**
   * メールアドレスでユーザーを検索します
   * @param email 検索するメールアドレス
   * @returns 検索されたユーザー、見つからない場合はnull
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * 複数の条件でユーザーリストを取得します（ページネーション付き）
   * @param queryParams ページネーションとフィルタリングパラメータ
   * @returns ページネーション情報付きのユーザーリスト
   */
  async findAllWithPagination(queryParams: UserPaginationDto) {
    const { page = 1, limit = 10, role } = queryParams;
    const conditions = role ? { role } : undefined;

    return this.findWithPagination(page, limit, conditions, []);
  }

  /**
   * ユーザーの最終ログイン日時を更新します
   * @param id ユーザーID
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.updateLastLogin(id);
  }

  /**
   * パスワードをハッシュ化します
   * @param password ハッシュ化するパスワード
   * @returns ハッシュ化されたパスワード
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}