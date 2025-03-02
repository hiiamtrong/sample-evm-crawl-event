import { EEvent } from "src/modules/crawler/models/base-event.model";

export class CrawlerEventConfig {
  abiPath: string;
  startBlock: number;
  contractAddress: string;
  incrementBlock: number;
  chainId: string;
  eventName: EEvent[];

  constructor(
    abiPath: string,
    startBlock: number,
    contractAddress: string,
    incrementBlock: number,
    chainId: string,
    eventNames: EEvent[],
  ) {
    this.abiPath = abiPath;
    this.startBlock = startBlock;
    this.contractAddress = contractAddress;
    this.incrementBlock = incrementBlock;
    this.chainId = chainId;
    this.eventName = eventNames;
  }
}

export class CrawlerTokenNativeConfig {
  startBlock: number;
  chainId: string;
  decimals: number;

  constructor(startBlock: number, chainId: string, decimals: number) {
    this.startBlock = startBlock;
    this.chainId = chainId;
    this.decimals = decimals;
  }
}
