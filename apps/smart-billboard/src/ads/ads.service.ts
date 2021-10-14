/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BuyAdDto } from './dto/buy-ad.dto';
import { buyAdResultDto } from './dto/buy-ad-result.dto';
import { ContractService } from './contract.service';
import { sha256 } from '@ethersproject/sha2';

import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { AdStatusDto } from './dto/ad-status.dto';

@Injectable()
export class AdsService {
    private readonly s3Client: S3Client;

    constructor(private readonly contractService: ContractService) {
        this.s3Client = new S3Client({ region: process.env.AWS_BUCKET_REGION });
    }

    async buyAd(buyAdDto: BuyAdDto): Promise<buyAdResultDto> {
        let image = Buffer.from(buyAdDto.image, 'base64');
        let imageHash = sha256(image);

        const s3Result: PutObjectCommandOutput = await this.s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageHash, // The name of the object. For example, 'sample_upload.txt'.
            Body: image, // The content of the object. For example, 'Hello world!".
            ContentType: 'image/png',
        }));

        if (s3Result.$metadata.httpStatusCode != 200) {
            console.log("failed to upload to S3, details: ");
            console.log(s3Result);
            throw new InternalServerErrorException("Failed to upload image");
        }

        const newAdId = await this.contractService.buyAd(imageHash, buyAdDto.durationSeconds);

        return { id: newAdId, etherscanUrl: null };
    }

    async getAdStatus(id: number): Promise<AdStatusDto> {
        return this.contractService.getAdStatus(id);
    }
}
