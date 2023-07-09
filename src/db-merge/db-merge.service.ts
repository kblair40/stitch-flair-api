import { Injectable } from '@nestjs/common';
import { CreateDbMergeDto } from './dto/create-db-merge.dto';
import { UpdateDbMergeDto } from './dto/update-db-merge.dto';

@Injectable()
export class DbMergeService {
  create(createDbMergeDto: CreateDbMergeDto) {
    return 'This action adds a new dbMerge';
  }

  findAll() {
    return `This action returns all dbMerge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dbMerge`;
  }

  update(id: number, updateDbMergeDto: UpdateDbMergeDto) {
    return `This action updates a #${id} dbMerge`;
  }

  remove(id: number) {
    return `This action removes a #${id} dbMerge`;
  }
}
