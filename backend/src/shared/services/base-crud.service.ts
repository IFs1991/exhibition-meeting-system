import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';

/**
 * 汎用的なCRUD操作を提供する基底サービスクラス
 * @template T エンティティの型
 * @template CreateDto 作成用DTOの型
 * @template UpdateDto 更新用DTOの型
 * @template ResponseDto レスポンス用DTOの型
 */
@Injectable()
export abstract class BaseCrudService<T, CreateDto, UpdateDto, ResponseDto> {
  /**
   * コンストラクタ
   * @param repository 操作対象のリポジトリ
   */
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * エンティティを作成する
   * @param createDto 作成用DTO
   * @returns 作成されたエンティティのDTO
   */
  async create(createDto: CreateDto): Promise<ResponseDto> {
    const entity = this.repository.create(createDto as any);
    const savedResult = await this.repository.save(entity);
    // Ensure savedResult is not an array before passing to mapToDto
    const savedEntity = Array.isArray(savedResult) ? savedResult[0] : savedResult;
    if (!savedEntity) {
        throw new Error('Failed to save entity or saved entity is unexpectedly empty.');
    }
    return this.mapToDto(savedEntity);
  }

  /**
   * 条件に一致するエンティティを全て取得する（ページネーション対応）
   * @param page ページ番号（1から開始）
   * @param limit 1ページあたりの件数
   * @param where 検索条件
   * @returns エンティティのDTOの配列とページネーション情報
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    where: FindOptionsWhere<T> = {},
  ): Promise<{ items: ResponseDto[]; total: number; page: number; limit: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      items: entities.map(entity => this.mapToDto(entity)),
      total,
      page,
      limit,
    };
  }

  /**
   * IDによりエンティティを1件取得する
   * @param id エンティティのID
   * @returns 取得したエンティティのDTO
   * @throws NotFoundException エンティティが見つからない場合
   */
  async findOne(id: string): Promise<ResponseDto> {
    const entity = await this.findEntityById(id);
    return this.mapToDto(entity);
  }

  /**
   * IDによりエンティティを更新する
   * @param id 更新対象のエンティティID
   * @param updateDto 更新用DTO
   * @returns 更新されたエンティティのDTO
   * @throws NotFoundException エンティティが見つからない場合
   */
  async update(id: string, updateDto: UpdateDto): Promise<ResponseDto> {
    const entity = await this.findEntityById(id);
    const updatedEntity = this.repository.merge(entity, updateDto as any);
    const savedEntity = await this.repository.save(updatedEntity);
    return this.mapToDto(savedEntity);
  }

  /**
   * IDによりエンティティを削除する
   * @param id 削除対象のエンティティID
   * @throws NotFoundException エンティティが見つからない場合
   */
  async remove(id: string): Promise<void> {
    const entity = await this.findEntityById(id);
    await this.repository.remove(entity);
  }

  /**
   * エンティティをDTOに変換する抽象メソッド
   * 具象クラスで実装する必要がある
   * @param entity エンティティ
   * @returns 変換されたDTO
   */
  protected abstract mapToDto(entity: T): ResponseDto;

  /**
   * IDによりエンティティを取得する内部メソッド
   * @param id エンティティのID
   * @returns 取得したエンティティ
   * @throws NotFoundException エンティティが見つからない場合
   */
  protected async findEntityById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }
}