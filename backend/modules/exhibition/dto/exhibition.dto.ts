import { IsString, IsOptional, IsDateString, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExhibitionDto {
  @ApiProperty({ description: '展示会名', example: '東京ビジネス展示会2025' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '説明', example: 'ビジネスマッチングを目的とした展示会' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: '開始日', example: '2025-07-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '終了日', example: '2025-07-17' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: '開催場所', example: '東京国際フォーラム' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: '公開フラグ', example: true, default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @ApiProperty({ description: '追加情報', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

export class UpdateExhibitionDto {
  @ApiProperty({ description: '展示会名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '説明', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '開始日', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: '終了日', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: '開催場所', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: '公開フラグ', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: '追加情報', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

export class ExhibitionDto {
  @ApiProperty({ description: '展示会ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '展示会名' })
  @IsString()
  name: string;

  @ApiProperty({ description: '説明' })
  @IsString()
  description: string;

  @ApiProperty({ description: '開始日' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '終了日' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: '開催場所' })
  @IsString()
  location: string;

  @ApiProperty({ description: '公開フラグ' })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ description: '追加情報', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiProperty({ description: '作成日時' })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ description: '更新日時' })
  @IsDateString()
  updatedAt: string;
}