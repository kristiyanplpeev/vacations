import { MigrationInterface, QueryRunner } from 'typeorm';

export class positionsSortOrderCoefficient1635769770496
  implements MigrationInterface
{
  name = 'positionsSortOrderCoefficient1635769770496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const junior = {
      position: 'Junior',
      coefficient: 0.35,
      sortOrder: 10,
    };

    const regular = {
      position: 'Regular',
      coefficient: 0.5,
      sortOrder: 7,
    };

    const senior = {
      position: 'Senior',
      coefficient: 0.75,
      sortOrder: 5,
    };

    const teamLead = {
      position: 'Team lead',
      coefficient: 0.5,
      sortOrder: 1,
    };

    await queryRunner.query(
      `ALTER TABLE "positions" ADD "coefficient" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "positions" ADD "sort_order" smallint NOT NULL`,
    );

    const positions = [junior, regular, senior, teamLead];

    Promise.all(
      positions.map(async (user) => {
        return await queryRunner.query(
          `INSERT INTO "positions" (position, coefficient, sort_order) VALUES ('${user.position}', ${user.coefficient}, ${user.sortOrder})`,
        );
      }),
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
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "sort_order"`);
    await queryRunner.query(
      `ALTER TABLE "positions" DROP COLUMN "coefficient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying(300) NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(`DROP INDEX "IDX_101e94d638b1a813a495fe9eed"`);
    await queryRunner.query(`DROP INDEX "IDX_ab23a6d3389698e04dc75b45e0"`);
    await queryRunner.query(`DROP TABLE "pto_approvers_user"`);
    await queryRunner.query(`DROP TABLE "PTO"`);
  }
}
