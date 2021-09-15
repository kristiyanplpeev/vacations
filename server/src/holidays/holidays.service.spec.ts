import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PTOdb } from '../model/pto.entity';
import { Userdb } from '../model/user.entity';
import { Holidaydb } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { PTOsService } from './pto.service';
import {
  mockSavedHoliday,
  mockEmployeeHolidays,
  mockPTOInfo,
  mockApprovers,
  constantHolidays,
  movableHolidays,
  mockReturnedPeriod,
} from '../common/holidaysMockedData';

describe('HolidaysService', () => {
  let service: HolidaysService;

  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidays)),
  };
  const mockPTORepository = {
    save: jest.fn(() => Promise.resolve(mockSavedHoliday)),
    create: jest.fn(() => Promise.resolve(undefined)),
    find: jest.fn(() => Promise.resolve(mockEmployeeHolidays)),
    findOne: jest.fn(() => Promise.resolve(mockPTOInfo)),
  };
  const mockUserRepository = {
    findOne: jest.fn(() => Promise.resolve(mockApprovers)),
    create: jest.fn(() => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [
        HolidaysService,
        PTOsService,
        {
          provide: getRepositoryToken(Holidaydb),
          useValue: mockHolidaysRepository,
        },
        {
          provide: getRepositoryToken(PTOdb),
          useValue: mockPTORepository,
        },
        {
          provide: getRepositoryToken(Userdb),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<HolidaysService>(HolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConstantHolidaysForTheCurrentYear', () => {
    it('should return dates of constant holidays in the current year', async () => {
      //arrange
      const dto = {
        startingDate: '2022-08-12',
        endingDate: '2022-08-14',
      };
      const spy = jest.spyOn(service, 'getConstantHolidaysForTheCurrentYear');

      //act
      const result = await service.getConstantHolidaysForTheCurrentYear(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(constantHolidays);
    });
  });
  describe('getMovableHolidaysForTheCurrentYear', () => {
    it('should return dates of movable holidays in the current year', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
      };
      const spy = jest.spyOn(service, 'getMovableHolidaysForTheCurrentYear');

      //act
      const result = await service.getMovableHolidaysForTheCurrentYear(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(constantHolidays);
    });
  });
  describe('getDatesWithAllHolidaysAndWeekends', () => {
    it('should return holiday days with status', () => {
      //arrange
      const datesBetweenDates = [
        {
          date: '2021-08-12',
          status: 'workday',
        },
        {
          date: '2021-08-13',
          status: 'workday',
        },
        {
          date: '2021-08-14',
          status: 'workday',
        },
      ];
      const spy = jest.spyOn(service, 'getDatesWithAllHolidaysAndWeekends');

      //act
      const result = service.getDatesWithAllHolidaysAndWeekends(
        datesBetweenDates,
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
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
      };
      const spy = jest.spyOn(service, 'calculateDays');

      //act
      const result = await service.calculateDays(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedPeriod);
    });
  });
});
