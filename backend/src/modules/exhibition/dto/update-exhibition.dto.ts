import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateExhibitionDto {
  @ApiProperty({
    description: '展示会名',
    example: 'デジタルイノベーション2025（更新）',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '展示会の説明',
    example: '最新のテクノロジーが集まる展示会です（詳細追加）',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '開始日時（ISO形式）',
    example: '2025-08-01T09:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: '終了日時（ISO形式）',
    example: '2025-08-05T19:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: '開催場所',
    example: '東京ビッグサイト 東展示棟',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: '追加情報',
    example: '参加企業向けの特別セッションあり（更新情報）',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}