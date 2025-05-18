import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';

export class AdminUpdateExhibitionDto {
  @ApiProperty({
    description: '展示会名',
    example: 'デジタルイノベーション2025（管理者更新）',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '展示会の説明',
    example: '最新のテクノロジーが集まる展示会です（管理者更新）',
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
    description: '公開ステータス',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({
    description: '追加情報',
    example: '管理者による特別メモ',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @ApiProperty({
    description: '参加クライアントID一覧',
    example: ['uuid1', 'uuid2', 'uuid3'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  clientIds?: string[];
}