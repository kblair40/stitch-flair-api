import { Test, TestingModule } from '@nestjs/testing';
import { DbMergeService } from './db-merge.service';

describe('DbMergeService', () => {
  let service: DbMergeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbMergeService],
    }).compile();

    service = module.get<DbMergeService>(DbMergeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
