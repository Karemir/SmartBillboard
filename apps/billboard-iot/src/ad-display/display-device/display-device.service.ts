import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from 'eventemitter2';
import { ContractService } from '../contract.service';
import { AdDisplayedEvent, AdDisplayedEventName } from '../event/ad-displayed.event';
import { NewAdEvent, NewAdEventName } from '../event/new-ad.event';
import * as Fs from 'fs';
import { spawn } from 'child_process';
import displayDeviceConfig from '../configs/display-device.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class DisplayDeviceService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly httpService: HttpService,
        private readonly contractService: ContractService,
        @Inject(displayDeviceConfig.KEY)
        private readonly deviceConfig: ConfigType<typeof displayDeviceConfig>,
    ) {
        // TODO: init the display device.
        // TODO: add configuration for python paths and script name and also if to use PI or other platform
    }

    displayAdOnRaspberry(filepath: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => {
            let python = spawn(this.deviceConfig.displayScriptRunner, [
                this.deviceConfig.displayScriptPath,
                filepath,
            ]);
            python.stdout.on('data', (data) => { console.log('python stdout'); console.log(data.toString()); });
            python.stderr.on('data', (data) => { console.log('python stderr'); console.log(data.toString()); });
            python.on('close', (code) => {
                console.log(`Python script closed with status: ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject('Ad failed to display');
                }
            });
        });
        return promise;
    }

    displayAd(id: number, filePath: string, forMinDuration: number) {
        console.log(`i am now displaying the ad #${id} at: ${filePath} for ${forMinDuration} seconds`);
        this.displayAdOnRaspberry(filePath);
        setTimeout(() => {
            console.log(`done with the ad ${filePath}`);

            this.eventEmitter.emit(AdDisplayedEventName, new AdDisplayedEvent(id, forMinDuration));
        }, forMinDuration * 1000);
    }

    @OnEvent(NewAdEventName)
    async handleAd(newAd: NewAdEvent) {
        console.log(`GOT AN AD TO DISPLAY, will now display for ${JSON.stringify(newAd)}`);
        console.log(newAd);

        const adInfo = await this.contractService.getAdInfo(newAd.id);
        let pathToFile: string;
        try {
            pathToFile = await this.downloadFile(adInfo.path);
        } catch (err) {
            console.log("File not downloaded, not displaying the ad");
            return;
        }

        this.displayAd(adInfo.id, pathToFile, adInfo.duration);
    }

    downloadFile(url: string): Promise<string> {
        const filepath = url.split('/').pop(); // get file path.

        let promise = new Promise<string>((resolve, reject) => {
            console.log(`-- Downloading file from path: ${url}`);
            this.httpService.get(url, { responseType: 'arraybuffer' }).subscribe((resp) => {
                Fs.writeFile(filepath, resp.data, { encoding: null }, (err) => {
                    if (err) {
                        console.log("FAILED TO DOWNLOAD IMAGE");
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(filepath);
                    }
                });
            });
        });
        return promise;
    }
}
