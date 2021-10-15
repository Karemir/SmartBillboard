import { Test, TestingModule } from '@nestjs/testing';
import { DisplayDeviceService } from './display-device.service';

describe('DisplayDeviceService', () => {
  let service: DisplayDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisplayDeviceService],
    }).compile();

    service = module.get<DisplayDeviceService>(DisplayDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
