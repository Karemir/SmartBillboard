import { ApiProperty } from "@nestjs/swagger";

export class AdStatusDto {
    @ApiProperty({ description: "id of the ad" })
    readonly id: number;

    @ApiProperty({ description: "address of the ad author" })
    readonly author: string;

    @ApiProperty({ description: "time (in seconds) for the ad to display on billboard" })
    readonly duration: number;

    @ApiProperty({ description: "path to ad image that will be displayed" })
    readonly path: string;

    @ApiProperty({ description: "flag indicating if the ad was already displayed" })
    readonly isDisplayed: boolean;
}