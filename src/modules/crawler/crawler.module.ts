import { Module } from '@nestjs/common';
import { BlockchainModule } from 'src/modules/blockchain/blockchain.module';
import { BuyCrawler } from 'src/modules/crawler/runners/buy.crawler';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    BlockchainModule,
  ],
  providers: [BuyCrawler],
  exports: [BuyCrawler],
})
export class CrawlerModule { }
