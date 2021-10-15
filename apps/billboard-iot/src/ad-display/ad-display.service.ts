import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ContractService } from './contract.service';
import { DisplayDeviceService } from './display-device/display-device.service';
import * as Fs from 'fs';
import { OnEvent } from '@nestjs/event-emitter';
import { AdDisplayedEvent, AdDisplayedEventName } from './event/ad-displayed.event';
import { NewAdEvent, NewAdEventName } from './event/new-ad.event';

@Injectable()
export class AdDisplayService {
    constructor() { }

}
