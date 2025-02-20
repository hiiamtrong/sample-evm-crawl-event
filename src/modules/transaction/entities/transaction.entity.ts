import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('transactions')
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'tx_type' })
    txType: string;

    @Column({ name: 'tx_hash' })
    txHash: string;

    @Column({ name: 'from' })
    from: string;

    @Column({ name: 'to' })
    to: string;

    @Column({ name: 'contract_address' })
    contractAddress: string;

    @Column({ name: 'chain_id' })
    chainId: string;

    @Column({ name: 'timestamp', type: 'bigint' })
    timestamp: number;

    @Column({ name: 'fee' })
    fee: string;

    @Column({ name: 'block_number', type: 'bigint' })
    blockNumber: number;

    @Column({ name: 'data', type: 'jsonb' })
    data: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
