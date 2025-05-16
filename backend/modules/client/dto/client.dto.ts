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
}

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

export class ClientDto {
  @ApiProperty({ description: 'クライアントID', example: 'cl_xxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'クライアント名', example: '株式会社サンプル' })
  name: string;

  @ApiProperty({ description: 'クライアント担当者名', example: '山田太郎' })
  contactPerson: string;

  @ApiProperty({ description: 'クライアントメールアドレス', example: 'contact@example.com' })
  email: string;

  @ApiProperty({ description: 'クライアント電話番号', example: '03-1234-5678' })
  phoneNumber: string;

  @ApiProperty({ description: '作成日時', example: '2025-05-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-05-16T10:00:00.000Z' })
  updatedAt: Date;
}