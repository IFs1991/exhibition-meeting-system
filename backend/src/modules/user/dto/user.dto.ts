import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'ユーザーのメールアドレス' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @ApiProperty({ description: 'ユーザーのパスワード' })
  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上必要です' })
  password: string;

  @ApiProperty({ description: 'ユーザーの氏名' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ description: '企業名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName?: string;

  @ApiPropertyOptional({ description: '医院名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  clinicName?: string;

  @ApiPropertyOptional({ description: '電話番号' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: '住所' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'ユーザーロール', enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'ユーザーの氏名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ description: '企業名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName?: string;

  @ApiPropertyOptional({ description: '医院名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  clinicName?: string;

  @ApiPropertyOptional({ description: '電話番号' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: '住所' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'ユーザーロール', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'アクティブ状態', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class LoginDto {
  @ApiProperty({ description: 'ユーザーのメールアドレス' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @ApiProperty({ description: 'ユーザーのパスワード' })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: '現在のパスワード' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: '新しいパスワード' })
  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上必要です' })
  newPassword: string;
}

export class UserPaginationDto {
  @ApiPropertyOptional({ description: 'ページ番号', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '1ページあたりの件数', default: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'ユーザーロールでフィルタリング', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}