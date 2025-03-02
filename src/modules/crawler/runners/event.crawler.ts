import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { BlockchainService } from 'src/modules/blockchain/blockchain.service';

import { CrawlerEventConfig } from 'src/modules/crawler/models/crawler-config.model';

import { BLOCKCHAIN_MICROSERVICE } from 'src/shared/constants/crawler';
import { BaseEventCrawler } from 'src/modules/crawler/base-event.crawler';
import { EEvent } from 'src/modules/crawler/models/base-event.model';
import { AppConfigService } from 'src/modules/configs/config.service';

@Injectable()
export class EventCrawler extends BaseEventCrawler {

  constructor(
    @InjectRedis()
    redis: Redis,
    @Inject(BLOCKCHAIN_MICROSERVICE)
    crawlerMicroservice: ClientProxy,
    blockchainService: BlockchainService,

    appConfig: AppConfigService,
  ) {
    const startBlock = appConfig.contract.startBlock;
    const incrementBlock = appConfig.contract.incrementBlock;
    const chainId = appConfig.contract.chainId;
    const contractAddress = appConfig.contract.address;
    const eventNames = [EEvent.REFUND, EEvent.CLAIM, EEvent.BUY];

    const crawlerConfig = new CrawlerEventConfig(
      'src/shared/abis/Dao4BuildPresale.json',
      startBlock,
      contractAddress,
      incrementBlock,
      chainId,
      eventNames,
    );
    const logger = new Logger(EventCrawler.name);

    super(
      redis,
      crawlerMicroservice,
      blockchainService,
      logger,
      crawlerConfig,
    );
  }

  async run() {
    await this.start();
  }
}
