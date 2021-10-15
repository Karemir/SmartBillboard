import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { InternalServerErrorException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { sha256 } from "ethers/lib/utils";
import { ContractService } from "../../contract.service";
import { BuyAdCommand } from "./buy-ad.command";
import { BuyAdCommandResult } from "./buy-ad.command-result";

@CommandHandler(BuyAdCommand)
export class BuyAdCommandHandler implements ICommandHandler<BuyAdCommand> {
    private readonly s3Client: S3Client;

    constructor(private readonly contractService: ContractService) {
        this.s3Client = new S3Client({ region: process.env.AWS_BUCKET_REGION });
    }

    async execute(command: BuyAdCommand): Promise<BuyAdCommandResult> {
        let image = Buffer.from(command.image, 'base64');
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

        const newAdId = await this.contractService.buyAd(imageHash, command.durationSeconds);

        return new BuyAdCommandResult(newAdId, null);
    }
}