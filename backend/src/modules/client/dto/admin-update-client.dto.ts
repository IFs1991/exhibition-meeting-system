import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class AdminUpdateClientDto {
  @ApiProperty({
    description: 'クライアント名',
    example: '株式会社サンプルネクスト',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'クライアント担当者名',
    example: '鈴木一郎',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiProperty({
    description: 'クライアントメールアドレス',
    example: 'new-contact@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'クライアント電話番号',
    example: '03-9876-5432',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'クライアントの住所',
    example: '東京都千代田区1-1-1',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'アクティブステータス',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '備考',
    example: '大口顧客',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}