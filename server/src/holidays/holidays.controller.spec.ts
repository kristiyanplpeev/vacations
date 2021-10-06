import { Test, TestingModule } from '@nestjs/testing';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { AbsencesService } from './absence.service';
import {
  mockEditedAbsenceDetails,
  mockSavedHoliday,
  mockHolidayPeriodDates,
} from '../common/holidaysMockedData';
import { AbsenceTypesEnum } from '../common/constants';
import { AbsenceFactory } from './absenceTypes/absenceTypes';
import DateUtil from '../utils/DateUtil';

describe('HolidaysController', () => {
  let controller: HolidaysController;

  const convertDatesToString = (obj: any) => ({
    ...obj,
    from_date: DateUtil.dateToString(obj.from_date),
    to_date: DateUtil.dateToString(obj.to_date),
  });

  const mockHolidayPeriodResponse = mockHolidayPeriodDates.map((el) => ({
    ...el,
    date: DateUtil.dateToString(el.date),
  }));

  const mockHolidayInfo = {
    type: AbsenceTypesEnum.paidLeave,
    startingDate: '2021-08-12',
    endingDate: '2021-08-14',
    comment: 'PTO',
  };

  const mockAbsenceDetails = {
    type: AbsenceTypesEnum.paidLeave,
    from_date: new Date('2021/05/01'),
    to_date: new Date('2021/05/09'),
    comment: 'PTO',
    employee: 'kristiyan.peev@atscale.com',
  };

  const mockAbsenceDetailsResponse = convertDatesToString(mockAbsenceDetails);

  const mockedUser = {
    id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    firstName: 'Kristiyan',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    PTO: [],
  };

  const mockEmployeeHolidaysCalc = [
    {
      id: '8389e44d-d807-4580-a9bf-ac59c07f1c4f',
      type: AbsenceTypesEnum.paidLeave,
      from_date: new Date('2021-08-04'),
      to_date: new Date('2021-08-04'),
      comment: 'PTO',
      totalDays: 1,
      PTODays: 1,
    },
    {
      id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
      type: AbsenceTypesEnum.paidLeave,
      from_date: new Date('2021-08-05'),
      to_date: new Date('2021-08-05'),
      comment: 'PTO',
      totalDays: 1,
      PTODays: 1,
    },
  ];

  const mockEmployeeHolidaysCalcResponse = mockEmployeeHolidaysCalc.map((el) =>
    convertDatesToString(el),
  );

  const mockAbsenceWithEachDay = {
    id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
    type: AbsenceTypesEnum.paidLeave,
    from_date: new Date('2021-07-07'),
    to_date: new Date('2021-07-08'),
    comment: 'PTO',
    employee: {
      id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
    eachDayStatus: [
      { date: '2021-07-07', status: 'workday' },
      { date: '2021-07-08', status: 'workday' },
    ],
  };

  const mockSavedHolidayResponse = convertDatesToString(mockSavedHoliday);

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
    editAbsence: jest.fn(() => mockSavedHoliday),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [HolidaysService, AbsencesService, AbsenceFactory],
    })
      .overrideProvider(HolidaysService)
      .useValue(mockHolidaysService)
      .overrideProvider(AbsencesService)
      .useValue(mockAbsencesService)
      .compile();

    controller = module.get<HolidaysController>(HolidaysController);
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
        start: '2021-08-12',
        end: '2021-08-14',
      };
      const spy = jest.spyOn(controller, 'calculateHolidayPeriod');

      //act
      const result = await controller.calculateHolidayPeriod(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockHolidayPeriodResponse);
    });
  });
  describe('postNewAbsence', () => {
    it('should return posted absence details', async () => {
      //arrange
      const spy = jest.spyOn(controller, 'postNewAbsence');

      //act
      const result = await controller.postNewAbsence(mockHolidayInfo, {
        user: 'mock',
      });

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockAbsenceDetailsResponse);
    });
  });
  describe('getUserAbsences', () => {
    it('should return posted holiday info', async () => {
      //arrange
      const spy = jest.spyOn(controller, 'getUserAbsences');

      //act
      const result = await controller.getUserAbsences({ user: mockedUser });

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEmployeeHolidaysCalcResponse);
    });

    describe('getAbsenceDetailsWithEachDayStatus', () => {
      it('should return detailed absence information', async () => {
        //arrange
        const spy = jest.spyOn(
          controller,
          'getAbsenceDetailsWithEachDayStatus',
        );

        //act
        const result = await controller.getAbsenceDetailsWithEachDayStatus({
          id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
        });

        //assert
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockAbsenceWithEachDayResponse);
      });
    });

    describe('editAbsence', () => {
      it('should return detailed edited absence information', async () => {
        //arrange
        const spy = jest.spyOn(controller, 'editAbsence');

        //act
        const result = await controller.editAbsence(mockEditedAbsenceDetails, {
          user: mockedUser,
        });

        //assert
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockSavedHolidayResponse);
      });
    });
  });
});
