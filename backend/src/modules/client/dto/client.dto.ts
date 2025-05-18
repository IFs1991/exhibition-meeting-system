import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'クライアントの住所', example: '東京都千代田区1-1-1' })
  address: string;

  @ApiProperty({ description: 'アクティブステータス', example: true })
  isActive: boolean;

  @ApiProperty({ description: '作成日時', example: '2025-05-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-05-16T10:00:00.000Z' })
  updatedAt: Date;
}
