import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateClientDto {
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
}