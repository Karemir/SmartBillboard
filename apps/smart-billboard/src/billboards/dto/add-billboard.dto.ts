import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddBillboardDto {
    @ApiProperty({ description: "Ethereum address of device wallet" })
    @IsString()
    readonly address: string;

    @ApiProperty({ description: "Physical location of the billboard" })
    @IsString()
    readonly location: string;

    @ApiProperty({ description: "General description" })
    @IsString()
    readonly description: string;

    @ApiProperty({ description: "Type of the billboard" })
    @IsString()
    readonly type: string;
}