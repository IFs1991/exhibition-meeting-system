import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [],
  controllers: [AIController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}