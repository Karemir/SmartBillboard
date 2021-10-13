import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BuyAdDto {
    @ApiProperty({description: 'Ad image (in base64) to be displayed on a billboard'})
    @IsString()
    readonly image: string;

    @ApiProperty({description: 'Amount of seconds to display this ad after the billboard picks it up'})
    @IsNumber()
    readonly durationSeconds: number;
}