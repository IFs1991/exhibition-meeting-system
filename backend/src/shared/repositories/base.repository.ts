import { Repository, FindOptionsWhere, FindOptionsRelations, DeepPartial } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

/**
 * TypeORMのリポジトリを拡張したベースリポジトリクラス
 * 共通のエンティティ操作メソッドを提供
 * @template T エンティティの型
 */
export abstract class BaseRepository<T extends { id: string }> extends Repository<T> {
  /**
   * エンティティ名（エラーメッセージに使用）
   */
  protected abstract readonly entityName: string;

  /**
   * IDによるエンティティ検索（存在しない場合は例外をスロー）
   * @param id エンティティID
   * @param relations 取得時に含めるリレーション
   * @returns 見つかったエンティティ
   * @throws NotFoundException エンティティが見つからない場合
   */
  async findByIdOrFail(id: string, relations: FindOptionsRelations<T> = {}): Promise<T> {
    const entity = await this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return entity;
  }

  /**
   * 条件による単一エンティティ検索（存在しない場合は例外をスロー）
   * @param where 検索条件
   * @param errorMessage 例外時のエラーメッセージ
   * @param relations 取得時に含めるリレーション
   * @returns 見つかったエンティティ
   * @throws NotFoundException エンティティが見つからない場合
   */
  async findOneByOrFail(
    where: FindOptionsWhere<T>,
    errorMessage?: string,
    relations: FindOptionsRelations<T> = {},
  ): Promise<T> {
    const entity = await this.findOne({
      where,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(
        errorMessage || `${this.entityName} not found with provided criteria`,
      );
    }

    return entity;
  }

  /**
   * ページネーション付きエンティティリスト取得
   * @param skip スキップする件数
   * @param take 取得する件数
   * @param where 検索条件
   * @param relations 取得時に含めるリレーション
   * @returns [エンティティの配列, 総件数]
   */
  async findWithPagination(
    skip: number = 0,
    take: number = 10,
    where: FindOptionsWhere<T> = {},
    relations: FindOptionsRelations<T> = {},
  ): Promise<[T[], number]> {
    return this.findAndCount({
      where,
      relations,
      skip,
      take,
      order: { createdAt: 'DESC' } as any,
    });
  }

  /**
   * IDによるエンティティ更新
   * @param id 更新対象のエンティティID
   * @param partialEntity 更新するフィールドと値
   * @param relations 取得時に含めるリレーション（更新後のエンティティ取得用）
   * @returns 更新されたエンティティ
   * @throws NotFoundException エンティティが見つからない場合
   */
  async updateById(
    id: string,
    partialEntity: DeepPartial<T>,
    relations: FindOptionsRelations<T> = {},
  ): Promise<T> {
    const entity = await this.findByIdOrFail(id);
    const updated = this.merge(entity, partialEntity);
    await this.save(updated);
    return this.findByIdOrFail(id, relations);
  }

  /**
   * IDによるエンティティ削除
   * @param id 削除対象のエンティティID
   * @throws NotFoundException エンティティが見つからない場合
   */
  async removeById(id: string): Promise<void> {
    const entity = await this.findByIdOrFail(id);
    await this.remove(entity);
  }

  /**
   * IDによる論理削除（isActiveフィールドがある場合）
   * @param id 論理削除対象のエンティティID
   * @throws NotFoundException エンティティが見つからない場合
   */
  async softRemoveById(id: string): Promise<void> {
    const entity = await this.findByIdOrFail(id);

    // isActiveフィールドが存在する場合のみ
    if ('isActive' in entity) {
      (entity as any).isActive = false;
      await this.save(entity);
    } else {
      throw new Error(`Entity ${this.entityName} does not support soft delete`);
    }
  }
}