import { Test, TestingModule } from '@nestjs/testing';
import { DbMergeController } from './db-merge.controller';
import { DbMergeService } from './db-merge.service';

describe('DbMergeController', () => {
  let controller: DbMergeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbMergeController],
      providers: [DbMergeService],
    }).compile();

    controller = module.get<DbMergeController>(DbMergeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
