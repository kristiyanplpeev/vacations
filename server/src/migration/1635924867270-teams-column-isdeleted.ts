import {MigrationInterface, QueryRunner} from "typeorm";

export class teamsColumnIsdeleted1635924867270 implements MigrationInterface {
    name = 'teamsColumnIsdeleted1635924867270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "absence" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "absence" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying(300) NOT NULL DEFAULT 'user'`);
    }

}
