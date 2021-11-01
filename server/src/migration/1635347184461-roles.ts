import { RolesEnum } from '../common/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class roles1635347184461 implements MigrationInterface {
  name = 'roles1635347184461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const ivelin = {
      googleId: '103940883475219076274',
      email: 'ivelin.stoyanov@atscale.com',
      firstName: 'Ivelin',
      lastName: 'Stoyanov',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gih3GacYmbSKCYhxB14IRajGr2YGx9e6bqk10Zf',
      role: RolesEnum.admin,
    };

    const kristiyan = {
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
      role: RolesEnum.admin,
    };

    const stefan = {
      googleId: '100481584689637835017',
      email: 'stefan.staev@atscale.com',
      firstName: 'Stefan',
      lastName: 'Staev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gg18p957r8xcI4XKQpwsoHc1Cn92KtrVgIs-Fu5',
      role: RolesEnum.admin,
    };

    const todor = {
      googleId: '106643188234018012380',
      email: 'todor.paskalev@atscale.com',
      firstName: 'Todor',
      lastName: 'Paskalev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14GiUB5LK_sXHpfrKRHRNdctXy6yi6iBN3buG72r9',
      role: RolesEnum.admin,
    };

    const valentin = {
      googleId: '106947724738066868900',
      email: 'valentin.ivanov@atscale.com',
      firstName: 'Valentin',
      lastName: 'Ivanov',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Giw7mGwfxVl8MG_jj9X4xkE1NFJ7J5wJK-mjR_0',
      role: RolesEnum.admin,
    };

    const stanislav = {
      googleId: '113860742276970036080',
      email: 'stanislav.trifonov@atscale.com',
      firstName: 'Stanislav',
      lastName: 'Trifonov',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gg_KCLYyq8zwaGiodhezLxgC10I0C2XwFZ3qTsz',
      role: RolesEnum.admin,
    };

    const svetoslav = {
      googleId: '102392070310162075243',
      email: 'svetoslav.petkov@atscale.com',
      firstName: 'Svetoslav',
      lastName: 'Petkov',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14GhXqLVgD2eGAuqKVob1dauytyFlX3dLAehoPvyY',
      role: RolesEnum.admin,
    };

    const milen = {
      googleId: '118306999807603705118',
      email: 'milen.ivanov@atscale.com',
      firstName: 'Milen',
      lastName: 'Ivanov',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14GiCx2TZzDKyUCgx6QBxlKhOIEIHfE4u7m9bfiXV',
      role: RolesEnum.admin,
    };

    const defaultUsers = [
      ivelin,
      kristiyan,
      stefan,
      todor,
      valentin,
      stanislav,
      svetoslav,
      milen,
    ];

    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying(300) NOT NULL DEFAULT 'user'`,
    );

    Promise.all(
      defaultUsers.map(async (user) => {
        return await queryRunner.query(
          `INSERT INTO "user" ("googleId", email, "firstName", "lastName", picture, role) VALUES ('${user.googleId}', '${user.email}', '${user.firstName}', '${user.lastName}', '${user.picture}', '${user.role}')`,
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
    await queryRunner.query(`DROP INDEX "IDX_101e94d638b1a813a495fe9eed"`);
    await queryRunner.query(`DROP INDEX "IDX_ab23a6d3389698e04dc75b45e0"`);
    await queryRunner.query(`DROP TABLE "pto_approvers_user"`);
    await queryRunner.query(`DROP TABLE "PTO"`);
  }
}
