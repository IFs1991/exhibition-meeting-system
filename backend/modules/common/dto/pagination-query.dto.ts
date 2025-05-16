import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ description: 'ページ番号', default: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '1ページあたりの表示件数', default: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ description: 'ソート項目', required: false })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ description: 'ソート順序', enum: ['asc', 'desc'], default: 'asc', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}