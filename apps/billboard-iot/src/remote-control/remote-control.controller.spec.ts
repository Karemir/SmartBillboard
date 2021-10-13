import { Test, TestingModule } from '@nestjs/testing';
import { RemoteControlController } from './remote-control.controller';

describe('RemoteControlController', () => {
  let controller: RemoteControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteControlController],
    }).compile();

    controller = module.get<RemoteControlController>(RemoteControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
