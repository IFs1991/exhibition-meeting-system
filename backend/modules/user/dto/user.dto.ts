import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'ユーザー名は必須です' })
  @IsString()
  @MinLength(2, { message: 'ユーザー名は2文字以上で入力してください' })
  @MaxLength(50, { message: 'ユーザー名は50文字以内で入力してください' })
  username: string;

  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @IsNotEmpty({ message: 'パスワードは必須です' })
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'パスワードは大文字、小文字、数字または記号を含む必要があります',
  })
  password: string;

  @IsString()
  @MaxLength(100)
  clinicName?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @IsNotEmpty({ message: 'パスワードは必須です' })
  password: string;
}

export class UpdateProfileDto {
  @IsString()
  @MinLength(2, { message: 'ユーザー名は2文字以上で入力してください' })
  @MaxLength(50, { message: 'ユーザー名は50文字以内で入力してください' })
  username?: string;

  @IsString()
  @MaxLength(100)
  clinicName?: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email?: string;

  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'パスワードは大文字、小文字、数字または記号を含む必要があります',
  })
  currentPassword?: string;

  @MinLength(8, { message: '新しいパスワードは8文字以上で入力してください' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '新しいパスワードは大文字、小文字、数字または記号を含む必要があります',
  })
  newPassword?: string;
}