import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from '../../client/dto/client.dto';

export class ExhibitionDto {
  @ApiProperty({
    description: '展示会ID',
    example: 'ex_xxxxxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: '展示会名',
    example: 'デジタルイノベーション2025',
  })
  name: string;

  @ApiProperty({
    description: '展示会の説明',
    example: '最新のテクノロジーが集まる展示会です',
  })
  description: string;

  @ApiProperty({
    description: '開始日時',
    example: '2025-08-01T10:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '終了日時',
    example: '2025-08-05T18:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: '開催場所',
    example: '東京ビッグサイト',
  })
  location: string;

  @ApiProperty({
    description: '公開ステータス',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: '追加情報',
    example: '参加企業向けの特別セッションあり',
  })
  additionalInfo: string;

  @ApiProperty({
    description: '参加クライアント',
    type: [ClientDto],
  })
  clients?: ClientDto[];

  @ApiProperty({
    description: '作成日時',
    example: '2025-05-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新日時',
    example: '2025-05-16T10:00:00.000Z',
  })
  updatedAt: Date;
}