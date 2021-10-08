import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Holidaydb } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { AbsencesService } from './absence.service';
import {
  mockEmployeeHolidays,
  mockAbsenceDb,
  constantHolidays,
  movableHolidays,
  mockReturnedPeriod,
  constantHolidaysDb,
} from '../common/holidaysMockedData';
import { AbsenceFactory } from './absenceTypes/absenceTypes';


const constantHolidaysForCurrentAndNextYear = (holidays, currentYear) => [
  { ...holidays, date: new Date(`${currentYear}-01-01`) },
  { ...holidays, date: new Date(`${currentYear + 1}-01-01`) },
];

describe('HolidaysService', () => {
  let service: HolidaysService;

  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidaysDb)),
  };
  const mockAbsenceRepository = {
    save: jest.fn(() => Promise.resolve(mockAbsenceDb)),
    create: jest.fn(() => Promise.resolve(undefined)),
    find: jest.fn(() => Promise.resolve(mockEmployeeHolidays)),
    findOne: jest.fn(() => Promise.resolve(mockAbsenceDb)),
  };
  const mockUserRepository = {
    create: jest.fn(() => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [
        HolidaysService,
        AbsencesService,
        {
          provide: getRepositoryToken(Holidaydb),
          useValue: mockHolidaysRepository,
        },
        {
          provide: getRepositoryToken(Absencedb),
          useValue: mockAbsenceRepository,
        },
        {
          provide: getRepositoryToken(Userdb),
          useValue: mockUserRepository,
        },
        AbsenceFactory,
      ],
    }).compile();

    service = module.get<HolidaysService>(HolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConstantHolidays', () => {
    it('should return dates of constant holidays in the year of the starting date and next year', async () => {
      //arrange
      const startingDateYear = 2022;

      //act
      const result = await service.getConstantHolidaysByYear(startingDateYear);

      //asserts
      expect(result).toEqual(
        constantHolidaysForCurrentAndNextYear(
          constantHolidays[0],
          startingDateYear,
        ),
      );
    });
  });
  describe('getDatesWithAllHolidaysAndWeekends', () => {
    it('should return holiday days with status', () => {
      //arrange
      const datesInPeriod = [
        {
          date: new Date('2021-08-12'),
          status: 'workday',
        },
        {
          date: new Date('2021-08-13'),
          status: 'workday',
        },
        {
          date: new Date('2021-08-14'),
          status: 'workday',
        },
      ];

      //act
      const result = service.getDatesWithAllHolidaysAndWeekends(
        datesInPeriod,
        movableHolidays,
        constantHolidays,
      );

      //assert
      expect(result).toEqual(mockReturnedPeriod);
    });
  });
  describe('calculateDays', () => {
    it('should return holiday days with status', async () => {
      //arrange
      const dto = {
        startingDate: new Date('2021-08-12'),
        endingDate: new Date('2021-08-14'),
      };

      //act
      const result = await service.calculateDays(
        dto.startingDate,
        dto.endingDate,
      );

      //assert
      expect(result).toEqual(mockReturnedPeriod);
    });
  });
});
