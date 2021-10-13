import { Module } from '@nestjs/common';
import { RemoteControlController } from './remote-control.controller';
import { RemoteControlService } from './remote-control.service';

@Module({
  controllers: [RemoteControlController],
  providers: [RemoteControlService]
})
export class RemoteControlModule {}
