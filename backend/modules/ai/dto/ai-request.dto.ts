import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReasonRequestDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  symptoms: string;

  @IsNotEmpty()
  @IsString()
  treatmentDetails: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  additionalContext?: string;
}

export class ChatMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  role: 'user' | 'assistant';

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}

export class ChatSessionDto {
  @IsUUID()
  sessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsString()
  @IsOptional()
  context?: string;
}

export class AISessionManagementDto {
  @IsUUID()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsDate()
  @Type(() => Date)
  lastActive: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatSessionDto)
  currentSession?: ChatSessionDto;
}

export class SuggestionRequestDto {
  @ApiProperty({ description: '生成プロンプト', example: '商談の目的について提案してください' })
  @IsString()
  prompt: string;

  @ApiProperty({ description: '追加コンテキスト情報', required: false })
  @IsOptional()
  context?: any;
}

export class MeetingPurposeRequestDto {
  @ApiProperty({ description: 'クライアント情報', required: false })
  @IsOptional()
  clientInfo?: any;

  @ApiProperty({ description: '展示会情報', required: false })
  @IsOptional()
  exhibitionInfo?: any;

  @ApiProperty({ description: 'キーワード', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}