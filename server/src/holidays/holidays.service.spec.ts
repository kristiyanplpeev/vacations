import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Holidaydb } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { AbsencesService } from './absence.service';
import {
  mockSavedHoliday,
  mockEmployeeHolidays,
  mockAbsenceInfo,
  constantHolidays,
  movableHolidays,
  mockReturnedPeriod,
  constantHolidaysDb,
  constantHolidaysResult,
} from '../common/holidaysMockedData';
import { AbsenceFactory } from './absenceTypes/absenceTypes';

describe('HolidaysService', () => {
  let service: HolidaysService;

  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidaysDb)),
  };
  const mockAbsenceRepository = {
    save: jest.fn(() => Promise.resolve(mockSavedHoliday)),
    create: jest.fn(() => Promise.resolve(undefined)),
    find: jest.fn(() => Promise.resolve(mockEmployeeHolidays)),
    findOne: jest.fn(() => Promise.resolve(mockAbsenceInfo)),
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
      const dto = {
        startingDate: new Date('2022-08-12'),
        endingDate: new Date('2022-08-14'),
      };
      const spy = jest.spyOn(service, 'getConstantHolidays');

      //act
      const result = await service.getConstantHolidays(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(constantHolidaysResult);
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
      const spy = jest.spyOn(service, 'getDatesWithAllHolidaysAndWeekends');

      //act
      const result = service.getDatesWithAllHolidaysAndWeekends(
        datesInPeriod,
        movableHolidays,
        constantHolidays,
      );

      //assert
      expect(spy).toHaveBeenCalled();
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
      const spy = jest.spyOn(service, 'calculateDays');

      //act
      const result = await service.calculateDays(
        dto.startingDate,
        dto.endingDate,
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedPeriod);
    });
  });
});
