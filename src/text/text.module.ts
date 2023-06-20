import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Text } from './entities/text.entity';
import { TextService } from './text.service';
import { TextController } from './text.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Text])],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
