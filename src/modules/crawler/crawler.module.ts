import { Module } from '@nestjs/common';
import { BlockchainModule } from 'src/modules/blockchain/blockchain.module';

import { EventCrawler } from 'src/modules/crawler/runners/event.crawler';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    BlockchainModule,
  ],
  providers: [EventCrawler],
  exports: [EventCrawler],
})
export class CrawlerModule { }
