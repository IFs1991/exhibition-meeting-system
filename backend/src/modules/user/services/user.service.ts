import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../../entities/profile.entity';
import { UserRole } from '../../../entities/user.entity';
import { CreateProfileDto, UpdateProfileDto, ProfilePaginationDto } from '../dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  /**
   * Supabase Authで作成されたユーザーのプロファイルを作成します
   * @param createProfileDto プロファイル作成DTOオブジェクト
   * @returns 作成されたプロファイルオブジェクト
   */
  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    // IDが既に存在するか確認
    const existingProfile = await this.profileRepository.findOne({
      where: { id: createProfileDto.id }
    });

    if (existingProfile) {
      throw new BadRequestException('このユーザーIDのプロファイルは既に存在します');
    }

    // プロファイルを作成して保存
    const newProfile = this.profileRepository.create({
      ...createProfileDto,
      role: createProfileDto.role || UserRole.USER,
      isActive: true,
    });

    return this.profileRepository.save(newProfile);
  }

  /**
   * プロファイル情報を更新します
   * @param id 更新するプロファイルのID (Supabase Auth user.id)
   * @param updateProfileDto プロファイル更新DTOオブジェクト
   * @returns 更新されたプロファイルオブジェクト
   */
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findProfileById(id);

    // 更新前にプロファイルが存在することを確認
    if (!profile) {
      throw new NotFoundException(`ID: ${id} のプロファイルが見つかりません`);
    }

    // プロファイルを更新
    this.profileRepository.merge(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  /**
   * メールアドレスでプロファイルを検索します
   * @param email 検索するメールアドレス
   * @returns 検索されたプロファイル、見つからない場合はnull
   */
  async findByEmail(email: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { email } });
  }

  /**
   * IDでプロファイルを検索します
   * @param id 検索するプロファイルID
   * @returns 検索されたプロファイル、見つからない場合はnull
   */
  async findProfileById(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id } });
  }

  /**
   * 複数の条件でプロファイルリストを取得します（ページネーション付き）
   * @param queryParams ページネーションとフィルタリングパラメータ
   * @returns ページネーション情報付きのプロファイルリスト
   */
  async findAllWithPagination(queryParams: ProfilePaginationDto) {
    const { page = 1, limit = 10, role } = queryParams;
    const skip = (page - 1) * limit;

    const whereCondition = role ? { role } : {};

    const [profiles, total] = await this.profileRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: profiles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * プロファイルの最終ログイン日時を更新します
   * @param id プロファイルID
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.profileRepository.update(id, { lastLoginAt: new Date() });
  }
}