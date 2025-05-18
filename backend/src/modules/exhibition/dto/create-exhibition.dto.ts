import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateExhibitionDto {
  @ApiProperty({
    description: '展示会名',
    example: 'デジタルイノベーション2025',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '展示会の説明',
    example: '最新のテクノロジーが集まる展示会です',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '開始日時（ISO形式）',
    example: '2025-08-01T10:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: '終了日時（ISO形式）',
    example: '2025-08-05T18:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: '開催場所',
    example: '東京ビッグサイト',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: '公開ステータス',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({
    description: '追加情報',
    example: '参加企業向けの特別セッションあり',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}