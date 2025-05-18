import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'クライアント名',
    example: '株式会社サンプル',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'クライアント担当者名',
    example: '山田太郎',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiProperty({
    description: 'クライアントメールアドレス',
    example: 'contact@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'クライアント電話番号',
    example: '03-1234-5678',
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
}