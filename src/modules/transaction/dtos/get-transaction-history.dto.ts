import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BuyEvent } from "src/modules/crawler/models/buy-event.model";

export class GetTransactionsInputDto {
    @ApiProperty({ description: 'The address to get transactions for' })
    @IsString()
    @IsNotEmpty()
    address: string;
}


export class GetTransactionsOutputDto {
    @ApiProperty({ description: 'ID' })
    @IsString()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ description: 'Transaction type (Buy/Sell)' })
    name: string;

    @ApiProperty({ description: 'Transaction hash' })
    txHash: string;

    @ApiProperty({ description: 'Sender address' })
    from: string;

    @ApiProperty({ description: 'Recipient address' })
    to: string;

    @ApiProperty({ description: 'Contract address' })
    contractAddress: string;

    @ApiProperty({ description: 'Chain ID' })
    chainId: string;

    @ApiProperty({ description: 'Transaction timestamp' })
    timestamp: number;

    @ApiProperty({ description: 'Transaction fee' })
    fee: string;

    @ApiProperty({ description: 'Block number' })
    blockNumber: number;

    @ApiProperty({ description: 'Additional transaction data' })
    data: BuyEvent;
}



