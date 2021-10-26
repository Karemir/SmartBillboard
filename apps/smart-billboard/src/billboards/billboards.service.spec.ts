import { Test, TestingModule } from '@nestjs/testing';
import { BillboardsService } from './billboards.service';

describe('BillboardsService', () => {
  let service: BillboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillboardsService],
    }).compile();

    service = module.get<BillboardsService>(BillboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
