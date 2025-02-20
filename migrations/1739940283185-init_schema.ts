import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1739940283185 implements MigrationInterface {
    name = 'InitSchema1739940283185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL NOT NULL,
                "tx_type" character varying NOT NULL,
                "tx_hash" character varying NOT NULL,
                "from" character varying NOT NULL,
                "to" character varying NOT NULL,
                "contract_address" character varying NOT NULL,
                "chain_id" character varying NOT NULL,
                "timestamp" bigint NOT NULL,
                "fee" character varying NOT NULL,
                "block_number" bigint NOT NULL,
                "data" jsonb NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "transactions"
        `);
    }

}
