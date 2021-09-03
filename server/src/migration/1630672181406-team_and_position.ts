import { MigrationInterface, QueryRunner } from 'typeorm';

export class teamAndPosition1630672181406 implements MigrationInterface {
  name = 'teamAndPosition1630672181406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const teams = ['Orchestrator', 'Datadash', 'Test team'];
    const positions = ['Junior', 'Regular', 'Senior', 'Team lead'];

    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team" character varying(300) NOT NULL, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "positions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying(300) NOT NULL, CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "teamId" uuid`);
    await queryRunner.query(`ALTER TABLE "user" ADD "positionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    for (let i = 0; i < teams.length; i++) {
      await queryRunner.query(
        `INSERT INTO "teams" (team) VALUES ('${teams[i]}')`,
      );
    }
    for (let i = 0; i < positions.length; i++) {
      await queryRunner.query(
        `INSERT INTO "positions" (position) VALUES ('${positions[i]}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "positionId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "teamId"`);
    await queryRunner.query(`DROP TABLE "positions"`);
    await queryRunner.query(`DROP TABLE "teams"`);
  }
}
