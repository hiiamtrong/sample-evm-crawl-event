import { Injectable, Logger } from "@nestjs/common";
import { KafkaContext } from "@nestjs/microservices";
import { BaseEvent, EEvent } from "src/modules/crawler/models/base-event.model";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "./entities/transaction.entity";
import { GetTransactionsInputDto, GetTransactionsOutputDto } from "src/modules/transaction/dtos/get-transaction-history.dto";
import { PaginationParamsDto } from "src/shared/dtos/pagination-params.dto";
import { BuyEvent } from "src/modules/crawler/models/buy-event.model";
import { RefundEvent } from "src/modules/crawler/models/refund-event.model";
@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
    ) { }

    async handleCrawleEvent(context: KafkaContext, message: BaseEvent) {
        this.logger.log(`Handling crawle event: ${message.name}, txHash: ${message.txHash}`);
        const { name, txHash, from, to, contractAddress, chainId, timestamp, fee, blockNumber, data } = message;
        const transaction = await this.transactionRepository.findOne({
            where: {
                txType: name,
                txHash,
            },
        });
        if (transaction) {
            this.logger.log(`Transaction already exists: event: ${name}, txHash: ${txHash}`);
            return;
        }
        const newTransaction = new TransactionEntity();
        newTransaction.txType = name;
        newTransaction.txHash = txHash;
        newTransaction.from = from;
        newTransaction.to = to;
        newTransaction.contractAddress = contractAddress;
        newTransaction.chainId = chainId;
        newTransaction.timestamp = timestamp;
        newTransaction.fee = fee;
        newTransaction.blockNumber = blockNumber;
        newTransaction.data = data;
        await this.transactionRepository.save(newTransaction);
        this.logger.log(`Saved transaction: event: ${name}, txHash: ${txHash}`);
    }

    async getTransactions(query: GetTransactionsInputDto, pagination: PaginationParamsDto) {
        const { page, limit } = pagination;
        let cond = {}
        if (query.address) {
            cond = {
                from: query.address,
            }
        }
        const transactions = await this.transactionRepository.find({
            where: cond,
            skip: page * limit,
            take: limit,
            order: {
                timestamp: 'DESC',
            },
        });

        const total = await this.transactionRepository.count({
            where: cond,
        });
        const transactionsOutput: GetTransactionsOutputDto[] = transactions.map((transaction) => {
            let data: BuyEvent | RefundEvent;
            switch (transaction.txType) {
                case EEvent.BUY:
                    data = {
                        from: transaction.data[0],
                        amount: transaction.data[1],
                    }
                    break;
                case EEvent.REFUND:
                    data = {
                        user: transaction.data[0],
                        amount: transaction.data[1],
                    }
                    break;
                case EEvent.CLAIM:
                    data = {
                        user: transaction.data[0],
                        amount: transaction.data[1],
                    }
                    break;
            }
            return {
                id: transaction.id,
                txType: transaction.txType,
                txHash: transaction.txHash,
                from: transaction.from,
                to: transaction.to,
                contractAddress: transaction.contractAddress,
                chainId: transaction.chainId,
                timestamp: transaction.timestamp,
                fee: transaction.fee,
                blockNumber: transaction.blockNumber,
                data: data,
            }
        });
        return {
            data: transactionsOutput,
            total,
            page,
            limit,
        }
    }
}