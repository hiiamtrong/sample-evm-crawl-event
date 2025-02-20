import { Controller, Injectable } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { BaseEvent } from "src/modules/crawler/models/base-event.model";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { CRAWLER_EVENT } from "src/shared/constants/crawler";

@Injectable()
@Controller('consumer')
export class ConsumerController {
    constructor(private readonly transactionService: TransactionService,) { }


    @EventPattern(CRAWLER_EVENT)
    async handleEvent(
        @Payload() message: BaseEvent,
        @Ctx() context: KafkaContext,
    ) {
        await this.transactionService.handleCrawleEvent(context, message);

        const { offset } = context.getMessage();
        const partition = context.getPartition();
        const topic = context.getTopic();
        const consumer = context.getConsumer();
        await consumer.commitOffsets([{ topic, partition, offset }]);
    }
}
