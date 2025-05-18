import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionController } from './exhibition.controller';
import { ExhibitionService } from './exhibition.service';
import { Exhibition } from '../../entities/exhibition.entity';
import { Client } from '../../entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibition, Client])],
  controllers: [ExhibitionController],
  providers: [ExhibitionService],
  exports: [ExhibitionService],
})
export class ExhibitionModule {}