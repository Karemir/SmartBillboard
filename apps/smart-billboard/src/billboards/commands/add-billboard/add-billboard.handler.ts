import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BillboardContractService } from "../../billboard-contract.service";
import { Billboard } from "../../entities/billboard.entity";
import { AddBillboardResult } from "./add-billboard-result";
import { AddBillboardCommand } from "./add-billboard.command";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@CommandHandler(AddBillboardCommand)
export class AddBillboardCommandHandler implements ICommandHandler<AddBillboardCommand> {
    constructor(
        private readonly billboardContractService: BillboardContractService,
        @InjectRepository(Billboard)
        private readonly billboardRepository: Repository<Billboard>,
    ) { }

    async execute(command: AddBillboardCommand): Promise<AddBillboardResult> {
        const billboard = this.billboardRepository.create({
            address: command.address,
            description: command.description,
            location: command.location,
            type: command.type,
        });

        try {
            const isRegistered = await this.billboardContractService.isBillboardRegistered(command.address);
            if (!isRegistered) {
                return new AddBillboardResult(false, "Billboard did not register on blockchain");
            }
        } catch (error) {
            console.log(`Billboard address is incorrect: ${error}`)
            return new AddBillboardResult(false, "Incorrect address");
        }

        this.billboardRepository.save(billboard);
        return new AddBillboardResult(true, null);
    }
}