import { MigrationInterface, QueryRunner } from 'typeorm';

export class holiday1626879871764 implements MigrationInterface {
  name = 'holiday1626879871764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const constantHolidays = [
      { date: '2021-01-01', comment: "New Year''s Day" },
      { date: '2021-03-03', comment: 'Liberation Day' },
      { date: '2021-05-01', comment: 'Labour Day' },
      { date: '2021-05-06', comment: "St. George''s day" },
      { date: '2021-05-24', comment: 'Culture And Literacy Day' },
      { date: '2021-09-06', comment: 'Unification Day' },
      { date: '2021-09-22', comment: 'Independence Day' },
      { date: '2021-12-24', comment: 'Christmas Eve' },
      { date: '2021-12-25', comment: 'Christmas' },
      { date: '2021-12-26', comment: 'Second Day of Christmas' },
    ];

    const movableHolidays = [
      { date: '2022-04-22', comment: 'Ortodox Good Friday' },
      { date: '2022-04-23', comment: 'Ortodox Holy Saturday' },
      { date: '2022-04-24', comment: 'Ortodox Easter Day' },
      { date: '2022-04-25', comment: 'Ortodox Easter Monday' },
      { date: '2023-04-14', comment: 'Ortodox Good Friday' },
      { date: '2023-04-15', comment: 'Ortodox Holy Saturday' },
      { date: '2023-04-16', comment: 'Ortodox Easter Day' },
      { date: '2023-04-17', comment: 'Ortodox Easter Monday' },
      { date: '2024-05-03', comment: 'Ortodox Good Friday' },
      { date: '2024-05-04', comment: 'Ortodox Holy Saturday' },
      { date: '2024-05-05', comment: 'Ortodox Easter Day' },
      { date: '2024-05-06', comment: 'Ortodox Easter Monday' },
      { date: '2025-04-18', comment: 'Ortodox Good Friday' },
      { date: '2025-04-19', comment: 'Ortodox Holy Saturday' },
      { date: '2025-04-20', comment: 'Ortodox Easter Day' },
      { date: '2025-04-21', comment: 'Ortodox Easter Monday' },
      { date: '2026-04-10', comment: 'Ortodox Good Friday' },
      { date: '2026-04-11', comment: 'Ortodox Holy Saturday' },
      { date: '2026-04-12', comment: 'Ortodox Easter Day' },
      { date: '2026-04-13', comment: 'Ortodox Easter Monday' },
      { date: '2027-04-30', comment: 'Ortodox Good Friday' },
      { date: '2027-05-01', comment: 'Ortodox Holy Saturday' },
      { date: '2027-05-02', comment: 'Ortodox Easter Day' },
      { date: '2027-05-03', comment: 'Ortodox Easter Monday' },
      { date: '2028-04-14', comment: 'Ortodox Good Friday' },
      { date: '2028-04-15', comment: 'Ortodox Holy Saturday' },
      { date: '2028-04-16', comment: 'Ortodox Easter Day' },
      { date: '2028-04-17', comment: 'Ortodox Easter Monday' },
      { date: '2029-04-06', comment: 'Ortodox Good Friday' },
      { date: '2029-04-07', comment: 'Ortodox Holy Saturday' },
      { date: '2029-04-08', comment: 'Ortodox Easter Day' },
      { date: '2029-04-09', comment: 'Ortodox Easter Monday' },
      { date: '2030-04-26', comment: 'Ortodox Good Friday' },
      { date: '2030-04-27', comment: 'Ortodox Holy Saturday' },
      { date: '2030-04-28', comment: 'Ortodox Easter Day' },
      { date: '2030-04-29', comment: 'Ortodox Easter Monday' },
      { date: '2031-04-11', comment: 'Ortodox Good Friday' },
      { date: '2031-04-12', comment: 'Ortodox Holy Saturday' },
      { date: '2031-04-13', comment: 'Ortodox Easter Day' },
      { date: '2031-04-14', comment: 'Ortodox Easter Monday' },
      { date: '2032-04-30', comment: 'Ortodox Good Friday' },
      { date: '2032-05-01', comment: 'Ortodox Holy Saturday' },
      { date: '2032-05-02', comment: 'Ortodox Easter Day' },
      { date: '2032-05-03', comment: 'Ortodox Easter Monday' },
      { date: '2033-04-22', comment: 'Ortodox Good Friday' },
      { date: '2033-04-23', comment: 'Ortodox Holy Saturday' },
      { date: '2033-04-24', comment: 'Ortodox Easter Day' },
      { date: '2033-04-25', comment: 'Ortodox Easter Monday' },
      { date: '2034-04-07', comment: 'Ortodox Good Friday' },
      { date: '2034-04-08', comment: 'Ortodox Holy Saturday' },
      { date: '2034-04-09', comment: 'Ortodox Easter Day' },
      { date: '2034-04-10', comment: 'Ortodox Easter Monday' },
      { date: '2035-04-27', comment: 'Ortodox Good Friday' },
      { date: '2035-04-28', comment: 'Ortodox Holy Saturday' },
      { date: '2035-04-29', comment: 'Ortodox Easter Day' },
      { date: '2035-04-30', comment: 'Ortodox Easter Monday' },
      { date: '2036-04-18', comment: 'Ortodox Good Friday' },
      { date: '2036-04-19', comment: 'Ortodox Holy Saturday' },
      { date: '2036-04-20', comment: 'Ortodox Easter Day' },
      { date: '2036-04-21', comment: 'Ortodox Easter Monday' },
      { date: '2037-04-03', comment: 'Ortodox Good Friday' },
      { date: '2037-04-04', comment: 'Ortodox Holy Saturday' },
      { date: '2037-04-05', comment: 'Ortodox Easter Day' },
      { date: '2037-04-06', comment: 'Ortodox Easter Monday' },
      { date: '2038-04-23', comment: 'Ortodox Good Friday' },
      { date: '2038-04-24', comment: 'Ortodox Holy Saturday' },
      { date: '2038-04-25', comment: 'Ortodox Easter Day' },
      { date: '2038-04-26', comment: 'Ortodox Easter Monday' },
      { date: '2039-04-15', comment: 'Ortodox Good Friday' },
      { date: '2039-04-16', comment: 'Ortodox Holy Saturday' },
      { date: '2039-04-17', comment: 'Ortodox Easter Day' },
      { date: '2039-04-18', comment: 'Ortodox Easter Monday' },
      { date: '2040-05-04', comment: 'Ortodox Good Friday' },
      { date: '2040-05-05', comment: 'Ortodox Holy Saturday' },
      { date: '2040-05-06', comment: 'Ortodox Easter Day' },
      { date: '2040-05-07', comment: 'Ortodox Easter Monday' },
      { date: '2041-04-19', comment: 'Ortodox Good Friday' },
      { date: '2041-04-20', comment: 'Ortodox Holy Saturday' },
      { date: '2041-04-21', comment: 'Ortodox Easter Day' },
      { date: '2041-04-22', comment: 'Ortodox Easter Monday' },
    ];

    await queryRunner.query(
      `CREATE TABLE "holiday" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "movable" boolean NOT NULL, "comment" character varying(300) NOT NULL, CONSTRAINT "PK_3e7492c25f80418a7aad0aec053" PRIMARY KEY ("id"))`,
    );
    for (let i = 0; i < constantHolidays.length; i++) {
      await queryRunner.query(
        `INSERT INTO "holiday" (date, movable, comment) VALUES ('${constantHolidays[i].date}', 'false', '${constantHolidays[i].comment}')`,
      );
    }

    for (let i = 0; i < movableHolidays.length; i++) {
      await queryRunner.query(
        `INSERT INTO "holiday" (date, movable, comment) VALUES ('${movableHolidays[i].date}', 'true', '${movableHolidays[i].comment}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "holiday"`);
  }
}
