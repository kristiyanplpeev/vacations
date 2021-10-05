import { AbsencesService } from './absence.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Holidaydb } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import {
  mockSavedHoliday,
  mockAbsenceInfo,
  constantHolidays,
  mockedUser,
  absenceDb,
  mockEmployeeAbsencesDb,
  mockEmployeeHolidaysCalculated,
} from '../common/holidaysMockedData';
import { UnauthorizedException } from '@nestjs/common';
import { AbsenceFactory } from './absenceTypes/absenceTypes';
import { AbsenceTypesEnum } from '../common/constants';

const convertStringsIntoDates = (obj: any) => ({
  ...obj,
  from_date: new Date(obj.from_date),
  to_date: new Date(obj.to_date),
});

const mockUserWIthIdMatchingAbsenceEmployeeId = {
  ...mockedUser,
  id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
};

const mockCalculatedPeriod = [
  {
    date: new Date('2021-08-04'),
    status: 'weekday',
  },
];

describe('absenceService', () => {
  let service: AbsencesService;
  let factory: AbsenceFactory;

  const mockAbsenceRepository = {
    save: jest.fn(() => Promise.resolve(absenceDb(mockSavedHoliday))),
    create: jest.fn(() => Promise.resolve(undefined)),
    find: jest.fn(() => Promise.resolve(mockEmployeeAbsencesDb)),
    findOne: jest.fn(() => Promise.resolve(absenceDb(mockAbsenceInfo))),
  };
  const mockUserRepository = {
    create: jest.fn(() => Promise.resolve(undefined)),
  };
  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidays)),
  };

  const mockHolidaysService = {
    calculateDays: jest.fn((body) => {
      return mockCalculatedPeriod;
    }),
  };

  const mockAbsenceFactory = {
    create: jest.fn(() => ({
      validate: () => undefined,
      getAbsenceDetails: async () => ({
        type: 'Paid',
        startingDate: new Date('2021-08-05'),
        endingDate: new Date('2021-08-05'),
        comment: 'Out of office',
      }),
    })),
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
    })
      .overrideProvider(HolidaysService)
      .useValue(mockHolidaysService)
      .overrideProvider(AbsenceFactory)
      .useValue(mockAbsenceFactory)
      .compile();

    service = module.get<AbsencesService>(AbsencesService);
    factory = module.get<AbsenceFactory>(AbsenceFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserAbsences', () => {
    it('should return user absences', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getUserAbsences');

      //act
      const result = await service.getUserAbsences(mockedUser);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEmployeeHolidaysCalculated);
    });
  });

  describe('getAbsenceWithEachDayStatus', () => {
    it('should return absence details with calculated each day status', async () => {
      //arrange
      const eachDayStatus = [
        { date: new Date('2021-08-04'), status: 'weekday' },
      ];
      const spy = jest.spyOn(service, 'getAbsenceWithEachDayStatus');

      //act
      const result = await service.getAbsenceWithEachDayStatus(
        '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual({
        ...convertStringsIntoDates(mockAbsenceInfo),
        eachDayStatus,
      });
    });
  });

  describe('editAbsence', () => {
    it('should return detailed edited absence information', async () => {
      //arrange
      const spy = jest.spyOn(service, 'editAbsence');
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-08-05'),
        endingDate: new Date('2021-08-05'),
        comment: 'Out of office',
      });

      //act
      const result = await service.editAbsence(
        absence,
        mockUserWIthIdMatchingAbsenceEmployeeId,
        mockSavedHoliday.id,
      );
      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockSavedHoliday);
    });
    it('should throw when user id and absence employee id does not match', async () => {
      //arrange
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-08-05'),
        endingDate: new Date('2021-08-05'),
        comment: 'Out of office',
      });
      expect.hasAssertions();
      
      try {
        //act
        await service.editAbsence(absence, mockedUser, mockSavedHoliday.id);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
