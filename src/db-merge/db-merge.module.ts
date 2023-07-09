import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbMerge } from './entities/db-merge.entity';
import { DbMergeService } from './db-merge.service';
import { DbMergeController } from './db-merge.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DbMerge])],
  controllers: [DbMergeController],
  providers: [DbMergeService],
})
export class DbMergeModule {}
