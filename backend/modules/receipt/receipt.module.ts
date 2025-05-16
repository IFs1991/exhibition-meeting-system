import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { TagService } from './tag/tag.service';
import { Receipt } from './entities/receipt.entity';
import { Tag } from './entities/tag.entity';
import { VectorSearchService } from '../../services/vector/vector-search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, Tag]),
  ],
  controllers: [ReceiptController],
  providers: [
    ReceiptService,
    TagService,
    VectorSearchService,
    {
      provide: 'VECTOR_INDEX_CONFIG',
      useValue: {
        dimensions: 1536,
        metric: 'cosine',
        indexType: 'hnsw',
      }
    }
  ],
  exports: [ReceiptService, TagService]
})
export class ReceiptModule {}