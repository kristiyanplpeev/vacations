import { AbsencesService } from './absence.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Holidaydb } from '../model/holiday.entity';
import { AbsencesController } from './absences.controller';
import { HolidaysService } from './holidays.service';
import {
  mockAbsenceDb,
  constantHolidays,
  mockedUser,
  mockEmployeeAbsencesDb,
  toAbsence,
  absenceCalculatedWorkingDays,
} from '../common/holidaysMockedData';
import { UnauthorizedException } from '@nestjs/common';
import { AbsenceFactory } from './absenceTypes/absenceTypes';
import { AbsenceTypesEnum, DayStatus } from '../common/constants';

const absenceDb = (absence: any) => ({
  ...absence,
  toAbsence() {
    return toAbsence(absence);
  },
});

const convertStringsIntoDates = (obj: any) => ({
  ...obj,
  startingDate: new Date(obj.startingDate),
  endingDate: new Date(obj.endingDate),
});

const getUserWithId = (newId: string) => ({
  ...mockedUser,
  id: newId,
});

const mockCalculatedPeriod = [
  {
    date: new Date('2021-08-04'),
    status: DayStatus.workday,
  },
];

const getDayWithStatus = (dayStatus: DayStatus) => ({
  date: new Date(),
  status: dayStatus,
});

describe('absenceService', () => {
  let service: AbsencesService;
  let factory: AbsenceFactory;

  const mockAbsenceRepository = {
    save: jest.fn(() => Promise.resolve(absenceDb(mockAbsenceDb))),
    create: jest.fn(() => Promise.resolve(undefined)),
    find: jest.fn(() => Promise.resolve(mockEmployeeAbsencesDb)),
    findOne: jest.fn(() => Promise.resolve(absenceDb(mockAbsenceDb))),
  };
  const mockUserRepository = {
    create: jest.fn(() => Promise.resolve(undefined)),
  };
  const mockHolidaysRepository = {
    find: jest.fn(() => Promise.resolve(constantHolidays)),
  };

  const mockHolidaysService = {
    calculateDays: jest.fn(() => {
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
      controllers: [AbsencesController],
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
  describe('calculateAbsenceWorkingDays', () => {
    it('should return user absences', async () => {
      //arrange
      jest
        .spyOn(mockHolidaysService, 'calculateDays')
        .mockReturnValue([
          getDayWithStatus(DayStatus.workday),
          getDayWithStatus(DayStatus.weekend),
        ]);

      //act
      const result = await service.calculateAbsenceWorkingDays([
        toAbsence(mockAbsenceDb),
      ]);

      //assert
      expect(result).toEqual([
        absenceCalculatedWorkingDays(toAbsence(mockAbsenceDb), 1, 2),
      ]);
    });
  });

  describe('getAbsenceWithEachDayStatus', () => {
    it('should return absence details with calculated each day status', async () => {
      //arrange
      const eachDayStatus = [
        getDayWithStatus(DayStatus.workday),
        getDayWithStatus(DayStatus.weekend),
      ];
      jest
        .spyOn(mockHolidaysService, 'calculateDays')
        .mockReturnValue(eachDayStatus);

      //act
      const result = await service.getAbsenceWithEachDayStatus(
        mockAbsenceDb.id,
      );

      //assert
      expect(result).toEqual({
        ...convertStringsIntoDates(toAbsence(mockAbsenceDb)),
        eachDayStatus,
      });
    });
  });

  describe('editAbsence', () => {
    it('should return detailed edited absence information', async () => {
      //arrange
      const absenceId = '0505c3d8-2fb5-4952-a0e7-1b49334f578d';
      const absence = factory.create({
        id: absenceId,
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-08-05'),
        endingDate: new Date('2021-08-05'),
        comment: 'Out of office',
      });

      //act
      const result = await service.editAbsence(
        absence,
        getUserWithId('fc799a20-5885-4390-98ce-7c868c3b3338'),
        absenceId,
      );
      //assert
      expect(result).toEqual(toAbsence(mockAbsenceDb));
    });
    it('should throw when user id and absence employee id does not match', async () => {
      //arrange
      const absenceId = '0505c3d8-2fb5-4952-a0e7-1b49334f578d';
      const absence = factory.create({
        id: absenceId,
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-08-05'),
        endingDate: new Date('2021-08-05'),
        comment: 'Out of office',
      });
      expect.hasAssertions();

      try {
        //act
        await service.editAbsence(absence, mockedUser, absenceId);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
