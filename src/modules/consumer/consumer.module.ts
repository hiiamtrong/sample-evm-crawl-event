import { Module } from "@nestjs/common";
import { ConsumerController } from "src/modules/consumer/consumer.controller";
import { TransactionModule } from "src/modules/transaction/transaction.module";
import { SharedModule } from "src/shared/shared.module";

@Module({
    imports: [SharedModule, TransactionModule],
    providers: [],
    controllers: [ConsumerController],
    exports: [],
})
export class ConsumerModule { }