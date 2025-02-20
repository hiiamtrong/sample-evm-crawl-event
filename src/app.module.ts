import { Module } from '@nestjs/common';
import { BlockchainModule } from 'src/modules/blockchain/blockchain.module';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, TransactionModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }
