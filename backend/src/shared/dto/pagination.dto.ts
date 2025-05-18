import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsValidPaginationParameter } from '../validators/validation.decorators';

/**
 * ページネーションパラメータのベースDTO
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'ページ番号（1から開始）',
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsValidPaginationParameter()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '1ページあたりの件数',
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsValidPaginationParameter()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit?: number = 10;
}

/**
 * ページネーション結果のレスポンスDTO
 * @template T レスポンスアイテムの型
 */
export class PaginatedResponseDto<T> {
  /**
   * 結果アイテムの配列
   */
  items: T[];

  /**
   * 総件数
   */
  total: number;

  /**
   * 現在のページ番号
   */
  page: number;

  /**
   * 1ページあたりの件数
   */
  limit: number;

  /**
   * 総ページ数
   */
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  /**
   * 次のページがあるかどうか
   */
  get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  /**
   * 前のページがあるかどうか
   */
  get hasPreviousPage(): boolean {
    return this.page > 1;
  }

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}