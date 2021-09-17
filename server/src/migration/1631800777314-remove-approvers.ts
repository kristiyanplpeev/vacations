import {MigrationInterface, QueryRunner} from "typeorm";

export class removeApprovers1631800777314 implements MigrationInterface {
    name = 'removeApprovers1631800777314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PTO" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TABLE pto_approvers_user`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PTO" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "PTO" ADD "status" character varying(30) NOT NULL`);
    }

}
