import { ApiProperty } from "@nestjs/swagger";

export class buyAdResultDto {
    @ApiProperty({ description: 'id of the new ad' })
    readonly id: number;

    @ApiProperty({ description: 'link to etherscan' })
    readonly etherscanUrl: string;
}