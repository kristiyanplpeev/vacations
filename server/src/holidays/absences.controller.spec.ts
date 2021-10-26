import { Test, TestingModule } from '@nestjs/testing';
import { HolidaysService } from './holidays.service';
import { AbsencesController } from './absences.controller';
import { AbsencesService } from './absence.service';
import {
  mockAbsenceDb,
  mockHolidayPeriodDates,
  toAbsence,
  mockedUser,
  absenceDto,
  absenceCalculatedWorkingDays,
  mockEmployeeHolidays,
} from '../common/holidaysMockedData';
import { AbsenceTypesEnum } from '../common/constants';
import { AbsenceFactory } from './absenceTypes/absenceTypes';
import DateUtil from '../utils/DateUtil';

describe('AbsencesController', () => {
  let controller: AbsencesController;

  const convertDatesToString = (obj: any) => ({
    ...obj,
    startingDate: DateUtil.dateToString(obj.startingDate),
    endingDate: DateUtil.dateToString(obj.endingDate),
  });

  const mockHolidayPeriodResponse = mockHolidayPeriodDates.map((el) => ({
    ...el,
    date: DateUtil.dateToString(el.date),
  }));

  const mockAbsenceDetails = toAbsence(mockAbsenceDb);

  const mockEmployeeHolidaysCalc = [
    absenceCalculatedWorkingDays(toAbsence(mockEmployeeHolidays[0]), 1, 1),
    absenceCalculatedWorkingDays(toAbsence(mockEmployeeHolidays[1]), 1, 1),
  ];

  const mockEmployeeHolidaysCalcResponse = mockEmployeeHolidaysCalc.map((el) =>
    convertDatesToString(el),
  );

  const mockAbsenceWithEachDay = {
    ...toAbsence(mockAbsenceDb),
    eachDayStatus: [
      { date: '2021-07-07', status: 'workday' },
      { date: '2021-07-08', status: 'workday' },
    ],
  };

  const mockSavedHolidayResponse = convertDatesToString(
    toAbsence(mockAbsenceDb),
  );

  const mockAbsenceWithEachDayResponse = convertDatesToString(
    mockAbsenceWithEachDay,
  );

  const mockHolidaysService = {
    calculateDays: jest.fn((body) => {
      return mockHolidayPeriodDates;
    }),
  };

  const mockAbsencesService = {
    postAbsence: jest.fn((body) => {
      return mockAbsenceDetails;
    }),
    getUserAbsences: jest.fn(() => {
      return mockEmployeeHolidaysCalc;
    }),
    getAbsenceWithEachDayStatus: jest.fn(() => mockAbsenceWithEachDay),
    editAbsence: jest.fn(() => toAbsence(mockAbsenceDb)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbsencesController],
      providers: [HolidaysService, AbsencesService, AbsenceFactory],
    })
      .overrideProvider(HolidaysService)
      .useValue(mockHolidaysService)
      .overrideProvider(AbsencesService)
      .useValue(mockAbsencesService)
      .compile();

    controller = module.get<AbsencesController>(AbsencesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('calculateHolidayPeriod', () => {
    it('should return days and statuses for absence period', async () => {
      //arrange
      const dto = {
        from: '2021-08-12',
        to: '2021-08-14',
      };

      //act
      const result = await controller.calculateHolidayPeriod(dto);

      //assert
      expect(result).toEqual(mockHolidayPeriodResponse);
    });
  });
  describe('postNewAbsence', () => {
    it('should return posted absence details', async () => {
      //arrange
      const mockAbsence = {
        type: AbsenceTypesEnum.paidLeave,
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
        comment: 'PTO',
      };

      //act
      const result = await controller.postNewAbsence(mockAbsence, {
        user: 'mock',
      });

      //assert
      expect(result).toEqual(convertDatesToString(mockAbsenceDetails));
    });
  });
  describe('getUserAbsences', () => {
    it('should return posted holiday info', async () => {
      //act
      const result = await controller.getUserAbsences({ user: mockedUser });

      //assert
      expect(result).toEqual(mockEmployeeHolidaysCalcResponse);
    });

    describe('getAbsenceDetailsWithEachDayStatus', () => {
      it('should return detailed absence information', async () => {
        //arrange

        //act
        const result = await controller.getAbsenceWithEachDay({
          id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
        });

        //assert
        expect(result).toEqual(mockAbsenceWithEachDayResponse);
      });
    });

    describe('editAbsence', () => {
      it('should return detailed edited absence information', async () => {
        //arrange

        //act
        const result = await controller.editAbsence(
          { id: 'fc799a20-5885-4390-98ce-7c868c3b3338' },
          convertDatesToString(absenceDto),
          {
            user: mockedUser,
          },
        );

        //assert
        expect(result).toEqual(mockSavedHolidayResponse);
      });
    });
  });
});
