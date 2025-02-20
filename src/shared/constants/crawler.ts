export const BLOCKCHAIN_GROUP_ID = 'blockchain-microservice';

export const BLOCKCHAIN_MICROSERVICE = 'blockchain-microservice';

export const CRAWLER_CURRENT_BLOCK = (chain: string, tokenAddress: string) => {
  return `crawler:current_block:${chain}:${tokenAddress}`;
};

export const CRAWLER_EVENT = 'crawler.event';

export const CRAWLER_DEAD_LETTER_EVENT =
  'crawler.event.dead_letter';
