import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsUUID, MinLength, MaxLength } from 'class-validator';

export enum FeedbackType {
  APPROVAL = '承認',
  REJECTION = '返戻',
  SUGGESTION = '提案',
  OTHER = 'その他'
}

export enum FeedbackStatus {
  PENDING = '処理待ち',
  PROCESSED = '処理済み',
  ARCHIVED = 'アーカイブ済み'
}

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  receiptId: string;

  @IsEnum(FeedbackType)
  @IsNotEmpty()
  type: FeedbackType;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  additionalNotes?: string;
}

export class ReportResultDto {
  @IsUUID()
  @IsNotEmpty()
  feedbackId: string;

  @IsEnum(FeedbackStatus)
  @IsNotEmpty()
  status: FeedbackStatus;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  processingResult: string;

  @IsDate()
  @IsNotEmpty()
  processedAt: Date;
}

export class SearchFeedbackDto {
  @IsOptional()
  @IsEnum(FeedbackType)
  type?: FeedbackType;

  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  keyword?: string;

  @IsOptional()
  @IsUUID()
  receiptId?: string;
}