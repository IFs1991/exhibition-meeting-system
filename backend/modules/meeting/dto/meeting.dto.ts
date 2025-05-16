import { IsString, IsOptional, IsDateString, IsEnum, IsNotEmpty, IsUUID, MinLength, MaxLength, IsInt, Min, Max } from 'class-validator';

export enum MeetingStatus {
  PENDING = 'PENDING', // 主催者からの提案、クライアント未承諾
  ACCEPTED = 'ACCEPTED', // クライアント承諾済み
  DECLINED = 'DECLINED', // クライアント辞退
  CANCELED = 'CANCELED', // 主催者またはクライアントによりキャンセル
  COMPLETED = 'COMPLETED', // 商談完了
}

export class CreateMeetingDto {
  @IsNotEmpty({ message: '展示会IDは必須です。' })
  @IsUUID('4', { message: '展示会IDは有効なUUIDである必要があります。' })
  exhibitionId: string;

  // 主催者IDはリクエストユーザーから取得するため、DTOには含めない
  // @IsNotEmpty({ message: '主催者IDは必須です。' })
  // @IsUUID('4', { message: '主催者IDは有効なUUIDである必要があります。' })
  // organizerId: string; // This will be the exhibitor user

  @IsNotEmpty({ message: '招待クライアントIDは必須です。' })
  @IsUUID('4', { message: '招待クライアントIDは有効なUUIDである必要があります。' })
  clientId: string; // This will be the client user invited

  @IsNotEmpty({ message: '開始日時は必須です。' })
  @IsDateString({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' })
  startTime: Date;

  @IsNotEmpty({ message: '終了日時は必須です。' })
  @IsDateString({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' })
  endTime: Date;

  @IsOptional()
  @IsString({ message: 'タイトルは文字列である必要があります。' })
  @MinLength(1, { message: 'タイトルは1文字以上である必要があります。' })
  @MaxLength(255, { message: 'タイトルは255文字以内である必要があります。' })
  title?: string;

  @IsOptional()
  @IsString({ message: '説明は文字列である必要があります。' })
  @MaxLength(1000, { message: '説明は1000文字以内である必要があります。' })
  description?: string;

  // statusは作成時にはPENDING固定とするため、DTOには含めない
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsDateString({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' })
  startTime?: Date;

  @IsOptional()
  @IsDateString({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' })
  endTime?: Date;

  @IsOptional()
  @IsString({ message: 'タイトルは文字列である必要があります。' })
  @MinLength(1, { message: 'タイトルは1文字以上である必要があります。' })
  @MaxLength(255, { message: 'タイトルは255文字以内である必要があります。' })
  title?: string;

  @IsOptional()
  @IsString({ message: '説明は文字列である必要があります。' })
  @MaxLength(1000, { message: '説明は1000文字以内である必要があります。' })
  description?: string;

  @IsOptional()
  @IsEnum(MeetingStatus, { message: 'ステータスが無効です。' })
  status?: MeetingStatus;
}

export class FindMeetingsQueryDto {
  @IsOptional()
  @IsUUID('4', { message: '展示会IDは有効なUUIDである必要があります。' })
  exhibitionId?: string;

  @IsOptional()
  @IsUUID('4', { message: '主催者IDは有効なUUIDである必要があります。' })
  organizerId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'クライアントIDは有効なUUIDである必要があります。' })
  clientId?: string;

  @IsOptional()
  @IsEnum(MeetingStatus, { message: 'ステータスが無効です。' })
  status?: MeetingStatus;

  @IsOptional()
  @IsDateString({}, { message: '開始日時は有効なISO 8601の日付文字列である必要があります。' })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: '終了日時は有効なISO 8601の日付文字列である必要があります。' })
  dateTo?: string;

  @IsOptional()
  @IsInt({ message: 'ページ番号は整数である必要があります。' })
  @Min(1, { message: 'ページ番号は1以上である必要があります。' })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: '1ページあたりの件数は整数である必要があります。' })
  @Min(1, { message: '1ページあたりの件数は1以上である必要があります。' })
  @Max(100, { message: '1ページあたりの件数は100以下である必要があります。' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'startTime';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'ソート順はASCまたはDESCである必要があります。' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}