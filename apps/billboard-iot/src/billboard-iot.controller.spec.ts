import { Test, TestingModule } from '@nestjs/testing';
import { BillboardIotController } from './billboard-iot.controller';
import { BillboardIotService } from './billboard-iot.service';

describe('BillboardIotController', () => {
  let billboardIotController: BillboardIotController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BillboardIotController],
      providers: [BillboardIotService],
    }).compile();

    billboardIotController = app.get<BillboardIotController>(BillboardIotController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(billboardIotController.getHello()).toBe('Hello World!');
    });
  });
});
