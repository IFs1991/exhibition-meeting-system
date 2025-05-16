import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatsRequestDto {
  @ApiProperty({ description: '開始日', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: '終了日', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'フィルター条件', required: false })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiProperty({ description: 'グループ化パラメータ', required: false })
  @IsOptional()
  @IsString()
  groupBy?: string;
}

export class TimeSeriesRequestDto {
  @ApiProperty({ description: '開始日', required: true })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '終了日', required: true })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: '測定対象指標', required: true, enum: ['meetings', 'clients', 'conversions'] })
  @IsString()
  @IsIn(['meetings', 'clients', 'conversions'])
  metric: string;

  @ApiProperty({ description: 'グループ化パラメータ', required: false, enum: ['day', 'week', 'month'] })
  @IsOptional()
  @IsString()
  @IsIn(['day', 'week', 'month'])
  groupBy?: string;
}