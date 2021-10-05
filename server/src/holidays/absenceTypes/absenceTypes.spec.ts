import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AbsencesService } from '../absence.service';
import { HolidaysService } from '../holidays.service';
import { AbsenceFactory } from '../absenceTypes/absenceTypes';
import { HolidaysController } from '../holidays.controller';
import { Absencedb } from '../../model/absence.entity';
import { Userdb } from '../../model/user.entity';
import { Holidaydb } from '../../model/holiday.entity';
import { mockEmployeeHolidaysCalculated } from '../../common/holidaysMockedData';
import { AbsenceTypesEnum, DayStatus } from '../../common/constants';
import { BadRequestException } from '@nestjs/common/exceptions';

const mockCalculatedPeriod = [
  {
    date: new Date('2021-10-05'),
    status: DayStatus.workday,
  },
  {
    date: new Date('2021-10-06'),
    status: DayStatus.workday,
  },
  {
    date: new Date('2021-10-07'),
    status: DayStatus.workday,
  },
];

describe('absenceService', () => {
  let factory: AbsenceFactory;

  const mockHolidaysService = {
    calculateDays: jest.fn(() => {
      return mockCalculatedPeriod;
    }),
  };

  const mockAbsenceRepository = {};
  const mockUserRepository = {};
  const mockHolidaysRepository = {};

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
      .compile();

    factory = module.get<AbsenceFactory>(AbsenceFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('Absence factory', () => {
    it('should throw an error when given period is overlapping another absence', async () => {
      //arrange
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-08-04'),
        endingDate: new Date('2021-08-04'),
        comment: 'Out of office',
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockEmployeeHolidaysCalculated);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if starting date is after ending date', async () => {
      //arrange
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-09-09'),
        endingDate: new Date('2021-09-08'),
        comment: 'Out of office',
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockEmployeeHolidaysCalculated);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if no ending date is passed', async () => {
      //arrange
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-10-05'),
        comment: 'Out of office',
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockEmployeeHolidaysCalculated);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if no comment is passed', async () => {
      //arrange
      const absence = factory.create({
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-10-05'),
        endingDate: new Date('2021-10-05'),
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockEmployeeHolidaysCalculated);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return valid absence details', async () => {
      //arrange
      const absenceDetails = {
        type: AbsenceTypesEnum.paidLeave,
        startingDate: new Date('2021-10-05'),
        endingDate: new Date('2021-10-05'),
        comment: 'Out of office',
      };

      //act
      const absence = factory.create(absenceDetails);
      const absenceCalculatedDetails = await absence.getAbsenceDetails();

      //assert
      expect(absenceCalculatedDetails).toEqual(absenceDetails);
    });
    it('should return wedding absence with calculated ending date', async () => {
      //arrange
      const absenceDetails = {
        type: AbsenceTypesEnum.weddingLeave,
        startingDate: new Date('2021-10-05'),
      };
      //act
      const absence = factory.create(absenceDetails);
      const absenceCalculatedDetails = await absence.getAbsenceDetails();

      //assert
      expect(absenceCalculatedDetails).toEqual({
        ...absenceDetails,
        endingDate: new Date('2021-10-07'),
      });
    });
  });
});
