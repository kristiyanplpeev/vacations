import { PTOsService } from './pto.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { Holiday } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import {
  mockSavedHoliday,
  mockEditedHoliday,
  mockEmployeeHolidays,
  mockPTOInfo,
  mockApprovers,
  constantHolidays,
  mockedUser,
  mockEmployeeHolidaysCalc,
} from '../common/holidaysMockedData';

describe('PTOService', () => {
  let service: PTOsService;

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
  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidays)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [
        HolidaysService,
        PTOsService,
        {
          provide: getRepositoryToken(Holiday),
          useValue: mockHolidaysRepository,
        },
        {
          provide: getRepositoryToken(PTO),
          useValue: mockPTORepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PTOsService>(PTOsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('saveHolidayIntoPTO', () => {
    it('should return PTO information', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
        comment: 'PTO',
        approvers: ['kristiyan.peev@atscale.com'],
      };
      const spy = jest.spyOn(service, 'saveHolidayIntoPTO');

      //act
      const result = await service.saveHolidayIntoPTO(dto, mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockSavedHoliday);
    });
  });
  describe('validatePTOPeriod', () => {
    it('should throw an error when starting date is before ending date', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-11',
        comment: 'PTO',
        approvers: ['kristiyan.peev@atscale.com'],
      };
      const spy = jest.spyOn(service, 'validatePTOPeriod');

      //act
      const result = service.validatePTOPeriod(dto, mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      await expect(result).rejects.toThrow();
    });
    it('should throw an error when only non-working days are passed', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-14',
        endingDate: '2021-08-15',
        comment: 'PTO',
        approvers: ['kristiyan.peev@atscale.com'],
      };
      const spy = jest.spyOn(service, 'validatePTOPeriod');

      //act
      const result = service.validatePTOPeriod(dto, mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      await expect(result).rejects.toThrow();
    });
    it('should return nothing when data is valid', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-11',
        endingDate: '2021-08-13',
        comment: 'PTO',
        approvers: ['kristiyan.peev@atscale.com'],
      };
      const spy = jest.spyOn(service, 'validatePTOPeriod');

      //act
      const result = await service.validatePTOPeriod(dto, mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
  describe('getUserPTOs', () => {
    it('should return user PTOs information', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getUserPTOs');

      //act
      const result = await service.getUserPTOs(mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEmployeeHolidaysCalc);
    });
  });

  describe('getPTOById', () => {
    it('should return detailed PTO information', async () => {
      //arrange
      const eachDayStatus = [
        { date: '2021-07-07', status: 'workday' },
        { date: '2021-07-08', status: 'workday' },
      ];
      const spy = jest.spyOn(service, 'getPTOById');

      //act
      const result = await service.getPTOById(
        '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual({ ...mockPTOInfo, eachDayStatus });
    });
  });

  describe('editPTO', () => {
    it('should return detailed edited PTO information', async () => {
      //arrange
      const spy = jest.spyOn(service, 'editPTO');

      //act
      const result = await service.editPTO(mockEditedHoliday, mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockSavedHoliday);
    });
  });
});
