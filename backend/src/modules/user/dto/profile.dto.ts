import { IsString, IsEmail, IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class CreateProfileDto {
  @IsUUID()
  @ApiProperty({ description: 'Supabase Auth user.id (UUID)' })
  id: string;

  @IsEmail()
  @ApiProperty({ description: 'メールアドレス' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'フルネーム' })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '会社名' })
  companyName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'クリニック名' })
  clinicName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '電話番号' })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '住所' })
  address?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ユーザーロール',
    enum: UserRole,
    default: UserRole.USER
  })
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'アクティブ状態',
    default: true
  })
  isActive?: boolean;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'フルネーム' })
  fullName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '会社名' })
  companyName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'クリニック名' })
  clinicName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '電話番号' })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '住所' })
  address?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ユーザーロール',
    enum: UserRole
  })
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'アクティブ状態' })
  isActive?: boolean;
}

export class ProfilePaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ページ番号',
    default: 1,
    minimum: 1,
  })
  page?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: '1ページあたりの件数',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ユーザーロールでフィルタ',
    enum: UserRole,
  })
  role?: UserRole;
}