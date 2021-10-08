import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AbsencesService } from '../absence.service';
import { HolidaysService } from '../holidays.service';
import { AbsenceFactory } from '../absenceTypes/absenceTypes';
import { HolidaysController } from '../holidays.controller';
import { Absencedb } from '../../model/absence.entity';
import { Userdb } from '../../model/user.entity';
import { Holidaydb } from '../../model/holiday.entity';
import {
  absenceCalculatedWorkingDays,
  mockEmployeeHolidays,
  toAbsence,
  mockHolidayPeriodDates,
  absenceDto,
} from '../../common/holidaysMockedData';
import { AbsenceTypesEnum } from '../../common/constants';
import { BadRequestException } from '@nestjs/common/exceptions';

const mockCalculatedAbsences = [
  absenceCalculatedWorkingDays(toAbsence(mockEmployeeHolidays[0]), 1, 1),
  absenceCalculatedWorkingDays(toAbsence(mockEmployeeHolidays[1]), 1, 1),
];

describe('absenceService', () => {
  let factory: AbsenceFactory;

  const mockHolidaysService = {
    calculateDays: jest.fn(() => {
      return mockHolidayPeriodDates;
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
      const absence = factory.create(absenceDto);
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockCalculatedAbsences);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if starting date is after ending date', async () => {
      //arrange
      const absence = factory.create({
        ...absenceDto,
        startingDate: new Date('2021-09-09'),
        endingDate: new Date('2021-09-08'),
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockCalculatedAbsences);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if no ending date is passed', async () => {
      //arrange
      const absence = factory.create({
        ...absenceDto,
        endingDate: undefined,
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockCalculatedAbsences);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw an error if no comment is passed', async () => {
      //arrange
      const absence = factory.create({
        ...absenceDto,
        comment: undefined,
      });
      expect.hasAssertions();

      try {
        //act
        await absence.validate(mockCalculatedAbsences);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return valid absence details', async () => {
      //arrange
      const absenceDetails = {
        type: absenceDto.type,
        startingDate: absenceDto.startingDate,
        endingDate: absenceDto.endingDate,
        comment: absenceDto.comment,
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
