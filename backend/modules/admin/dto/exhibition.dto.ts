import { IsString, IsDateString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateExhibitionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string; // ISO 8601 date string

  @IsDateString()
  endDate: string; // ISO 8601 date string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // @IsOptional()
  // @IsString()
  // clientId?: string; // If linking to a client during creation
}

export class UpdateExhibitionDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // @IsOptional()
  // @IsString()
  // clientId?: string; // If linking to a client can be updated
}