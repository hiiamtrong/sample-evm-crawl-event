import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { GetTransactionsInputDto } from "src/modules/transaction/dtos/get-transaction-history.dto";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { PaginationParamsDto } from "src/shared/dtos/pagination-params.dto";

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @ApiOperation({ summary: 'Get transaction history' })
    @Get('history')
    async getTransactions(@Query() query: GetTransactionsInputDto, @Query() pagination: PaginationParamsDto) {
        return this.transactionService.getTransactions(query, pagination);
    }
}