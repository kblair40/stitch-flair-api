import { Injectable } from '@nestjs/common';

@Injectable()
export class DbMergeService {
  mergeTable(table: string) {
    return 'This action adds a new dbMerge';
  }

  // findAll() {
  //   return `This action returns all dbMerge`;
  // }
}
