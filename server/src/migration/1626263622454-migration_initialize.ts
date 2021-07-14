import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrationInitialize1626263622454 implements MigrationInterface {
  name = 'migrationInitialize1626263622454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(300) NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`INSERT INTO "message" (name) VALUES ('ok')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
