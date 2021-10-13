import { Test, TestingModule } from '@nestjs/testing';
import { AdDisplayService } from './ad-display.service';

describe('AdDisplayService', () => {
  let service: AdDisplayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdDisplayService],
    }).compile();

    service = module.get<AdDisplayService>(AdDisplayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
