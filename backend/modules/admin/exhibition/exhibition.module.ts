import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { Exhibition } from '../entities/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibition])],
  controllers: [ExhibitionController],
  providers: [ExhibitionService],
  exports: [ExhibitionService], // Export if other modules need to use ExhibitionService
})
export class ExhibitionModule {}