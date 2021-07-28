import { MigrationInterface, QueryRunner } from 'typeorm';

export class PTO1627474537478 implements MigrationInterface {
  name = 'PTO1627474537478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PTO" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_date" date NOT NULL, "to_date" date NOT NULL, "comment" text NOT NULL, "status" character varying(30) NOT NULL, "employeeId" uuid, CONSTRAINT "PK_204b9911515347b0a270c8490ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pto_approvers_user" ("pTOId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_a0b4b0183e3ad10f65def31b315" PRIMARY KEY ("pTOId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab23a6d3389698e04dc75b45e0" ON "pto_approvers_user" ("pTOId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_101e94d638b1a813a495fe9eed" ON "pto_approvers_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "PTO" ADD CONSTRAINT "FK_51df808a4a2b864cd5580bfcde0" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pto_approvers_user" ADD CONSTRAINT "FK_ab23a6d3389698e04dc75b45e06" FOREIGN KEY ("pTOId") REFERENCES "PTO"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pto_approvers_user" ADD CONSTRAINT "FK_101e94d638b1a813a495fe9eed5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pto_approvers_user" DROP CONSTRAINT "FK_101e94d638b1a813a495fe9eed5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pto_approvers_user" DROP CONSTRAINT "FK_ab23a6d3389698e04dc75b45e06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PTO" DROP CONSTRAINT "FK_51df808a4a2b864cd5580bfcde0"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_101e94d638b1a813a495fe9eed"`);
    await queryRunner.query(`DROP INDEX "IDX_ab23a6d3389698e04dc75b45e0"`);
    await queryRunner.query(`DROP TABLE "pto_approvers_user"`);
    await queryRunner.query(`DROP TABLE "PTO"`);
  }
}
