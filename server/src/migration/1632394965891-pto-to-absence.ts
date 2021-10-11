import {MigrationInterface, QueryRunner} from "typeorm";

export class ptoToAbsence1632394965891 implements MigrationInterface {
    name = 'ptoToAbsence1632394965891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "absence" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(300) NOT NULL, "from_date" date NOT NULL, "to_date" date NOT NULL, "comment" text, "employeeId" uuid, CONSTRAINT "PK_30089b15c0f880f026581218c16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "absence" ADD CONSTRAINT "FK_39431bb74386ce056df206a1b44" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "PTO"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pto_approvers_user" DROP CONSTRAINT "FK_101e94d638b1a813a495fe9eed5"`);
        await queryRunner.query(`ALTER TABLE "pto_approvers_user" DROP CONSTRAINT "FK_ab23a6d3389698e04dc75b45e06"`);
        await queryRunner.query(`ALTER TABLE "absence" DROP CONSTRAINT "FK_39431bb74386ce056df206a1b44"`);
        await queryRunner.query(`ALTER TABLE "PTO" DROP COLUMN "status"`);
        await queryRunner.query(`DROP INDEX "IDX_101e94d638b1a813a495fe9eed"`);
        await queryRunner.query(`DROP INDEX "IDX_ab23a6d3389698e04dc75b45e0"`);
        await queryRunner.query(`DROP TABLE "pto_approvers_user"`);
        await queryRunner.query(`DROP TABLE "absence"`);
    }

}
