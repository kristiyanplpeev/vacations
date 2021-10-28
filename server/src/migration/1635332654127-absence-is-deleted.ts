import {MigrationInterface, QueryRunner} from "typeorm";

export class absenceIsDeleted1635332654127 implements MigrationInterface {
    name = 'absenceIsDeleted1635332654127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "absence" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "absence" DROP COLUMN "is_deleted"`);
    }

}
