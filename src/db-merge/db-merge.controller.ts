import { Controller, Post, Body } from '@nestjs/common';
import { DbMergeService } from './db-merge.service';

@Controller('db-merge')
export class DbMergeController {
  constructor(private readonly dbMergeService: DbMergeService) {}

  @Post(':table')
  create(@Body() table: string) {
    return this.dbMergeService.create(table);
  }

  // @Get()
  // findAll() {
  //   return this.dbMergeService.findAll();
  // }
}
