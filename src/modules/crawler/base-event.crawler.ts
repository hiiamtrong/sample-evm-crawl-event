import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { Redis } from 'ioredis';
import { map } from 'lodash';
import { BlockchainService } from 'src/modules/blockchain/blockchain.service';
import { BaseEvent } from 'src/modules/crawler/models/base-event.model';
import { CrawlerEventConfig } from 'src/modules/crawler/models/crawler-config.model';
import {
  CRAWLER_CURRENT_BLOCK,
  CRAWLER_EVENT,
} from 'src/shared/constants/crawler';

export class BaseEventCrawler {
  crawlerConfig: CrawlerEventConfig;
  logger: Logger;
  abiJson: any;

  constructor(
    private readonly redis: Redis,
    private readonly crawlerMicroservice: ClientProxy,
    private readonly blockchainService: BlockchainService,
    logger: Logger,
    crawlerConfig: CrawlerEventConfig,
  ) {
    this.logger = logger;
    this.crawlerConfig = crawlerConfig;
    const abi = fs.readFileSync(this.crawlerConfig.abiPath);
    this.abiJson = JSON.parse(abi.toString());
  }

  async start() {
    const cachedCurrentBlock = await this.redis.get(
      CRAWLER_CURRENT_BLOCK(
        this.crawlerConfig.chainId,
        this.crawlerConfig.contractAddress,
      ),
    );

    let currentBlock = cachedCurrentBlock
      ? parseInt(cachedCurrentBlock)
      : this.crawlerConfig.startBlock;
    while (true) {
      const provider = await this.blockchainService.getProvider();
      const contract = new ethers.Contract(
        this.crawlerConfig.contractAddress,
        this.abiJson,
        provider,
      );
      try {
        const latestBlock = await provider.getBlockNumber();
        if (currentBlock >= latestBlock) {
          // Sleep 10 seconds
          this.logger.log(
            `[WARN] Current block ${currentBlock} is greater than latest block ${latestBlock}, sleep 10 seconds`,
          );
          await this.sleep(10000);
          continue;
        }

        const nextBlock = Math.min(
          currentBlock + this.crawlerConfig.incrementBlock,
          latestBlock,
        );

        this.logger.log(`Start to crawl block ${currentBlock} to ${nextBlock}`);

        const events = await contract.queryFilter(
          this.crawlerConfig.eventName,
          currentBlock,
          nextBlock,
        );

        if (events.length === 0) {
          this.logger.log(
            `[WARN] No ${this.crawlerConfig.eventName} events found in block ${currentBlock} to ${nextBlock}`,
          );
          currentBlock = nextBlock;
          continue;
        }

        await Promise.all(
          map(events, async (event) => {
            this.logger.log(
              `[INFO] Found ${this.crawlerConfig.eventName} event with tx: ${event.transactionHash}`,
            );
            const parsedLog = contract.interface.decodeEventLog(
              this.crawlerConfig.eventName,
              event.data,
              event.topics,
            );



            const newEvent = new BaseEvent({
              name: this.crawlerConfig.eventName,
              txHash: event.transactionHash,
              contractAddress: this.crawlerConfig.contractAddress,
              chainId: this.crawlerConfig.chainId,
              timestamp: Date.now(),
              blockNumber: event.blockNumber,
              data: parsedLog
            });

            const receipt = await provider.getTransactionReceipt(
              event.transactionHash,
            );

            if (receipt) {
              const fee = receipt.gasPrice * receipt.gasUsed;
              const feeInNativeToken = ethers.formatEther(fee);
              newEvent.fee = feeInNativeToken;
              newEvent.from = receipt.from;
              newEvent.to = receipt.to;
            }

            console.debug({ newEvent });
            this.crawlerMicroservice.emit<BaseEvent>(
              CRAWLER_EVENT,
              {
                key: `${this.crawlerConfig.chainId}-${this.crawlerConfig.contractAddress}`,
                value: JSON.stringify(newEvent),
              },
            );
          }),
        );

        currentBlock = nextBlock;
        await this.redis.set(
          CRAWLER_CURRENT_BLOCK(
            this.crawlerConfig.chainId,
            this.crawlerConfig.contractAddress,
          ),
          currentBlock.toString(),
        );
      } catch (error) {
        console.log(error);
        this.logger.error(`Error: ${error}`, error);
      }
    }
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
