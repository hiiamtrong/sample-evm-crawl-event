export enum EEvent {
    BUY = 'BuyEvent',
    REFUND = 'RefundEvent',
    CLAIM = 'ClaimEvent',
}

export class BaseEvent {
    name: EEvent;

    txHash: string;
    from: string;
    to: string;
    contractAddress: string;
    chainId: string;
    timestamp: number;
    fee: string;
    blockNumber: number;

    data: any;

    constructor({
        name,
        txHash,
        from,
        to,
        contractAddress,
        chainId,
        timestamp,
        blockNumber,
        fee,
        data,
    }: {
        name: EEvent;
        txHash: string;
        from?: string;
        to?: string;
        contractAddress: string;
        chainId: string;
        timestamp: number;
        blockNumber: number;
        fee?: string;
        data: any;
    }) {
        this.name = name;
        this.txHash = txHash;
        this.from = from;
        this.to = to;
        this.contractAddress = contractAddress;
        this.chainId = chainId;
        this.timestamp = timestamp;
        this.blockNumber = blockNumber;
        this.fee = fee;
        this.data = data;
    }
}
