import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";
import { TransactionController } from "src/modules/transaction/transaction.controller";

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [TransactionService],
    exports: [TransactionService],
    controllers: [TransactionController],
})
export class TransactionModule { }