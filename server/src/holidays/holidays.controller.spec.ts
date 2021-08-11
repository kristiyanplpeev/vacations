import { Test, TestingModule } from '@nestjs/testing';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';

describe('HolidaysController', () => {
  let controller: HolidaysController;

  const response = {
    send: (body?: any) => body,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status: (code: number) => response,
  };

  const mockHolidayPeriod = [
    {
      date: '2021-08-12',
      status: 'weekday',
    },
    {
      date: '2021-08-13',
      status: 'weekday',
    },
    {
      date: '2021-08-14',
      status: 'weekend',
    },
  ];

  const mockHolidayInfo = {
    startingDate: '2021-08-12',
    endingDate: '2021-08-14',
    comment: 'PTO',
    approvers: ['kristiyan.peev@atscale.com'],
  };
  const mockHolidayInfoInvalid = {
    startingDate: '2021-08-12',
    endingDate: '2021-08-11',
    comment: 'PTO',
    approvers: ['kristiyan.peev@atscale.com'],
  };

  const mockHolidayInfoResponse = {
    from_date: '2021/05/01',
    to_date: '2021/05/09',
    comment: 'PTO',
    status: 'requested',
    employee: 'kristiyan.peev@atscale.com',
    approvers: ['kristiyan.peev@atscale.com'],
  };
  const mockErrorMessage = {
    statusCode: 400,
    message: 'There is an error.',
    error: 'Bad Request',
  };
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
      from_date: '2021-08-04',
      to_date: '2021-08-04',
      comment: 'PTO',
      status: 'requested',
      totalDays: 1,
      PTODays: 1,
    },
    {
      id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
      from_date: '2021-08-05',
      to_date: '2021-08-05',
      comment: 'PTO',
      status: 'requested',
      totalDays: 1,
      PTODays: 1,
    },
  ];

  const mockPTOInfo = {
    id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
    from_date: '2021-07-07',
    to_date: '2021-07-08',
    comment: 'PTO',
    status: 'requested',
    employee: {
      id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
    approvers: [
      {
        id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
        googleId: '106956791077954804246',
        email: 'kristiyan.peev@atscale.com',
        firstName: 'Kristiyan',
        lastName: 'Peev',
        picture:
          'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
      },
    ],
    eachDayStatus: [
      { date: '2021-07-07', status: 'workday' },
      { date: '2021-07-08', status: 'workday' },
    ],
  };

  const mockHolidaysService = {
    calculateDays: jest.fn((body) => {
      if (body.startingDate > body.endingDate) {
        throw new Error('There is an error.');
      } else {
        return mockHolidayPeriod;
      }
    }),
    postHoliday: jest.fn((body) => {
      if (body.startingDate > body.endingDate) {
        throw new Error('There is an error.');
      } else {
        return mockHolidayInfoResponse;
      }
    }),
    getUserPTOs: jest.fn((user) => {
      return mockEmployeeHolidaysCalc;
    }),
    getPTOById: jest.fn(() => mockPTOInfo),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [HolidaysService],
    })
      .overrideProvider(HolidaysService)
      .useValue(mockHolidaysService)
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
    it('should return days and statuses for PTO period', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
      };
      const spy = jest.spyOn(controller, 'calculateHolidayPeriod');

      //act
      const result = await controller.calculateHolidayPeriod(dto, response);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockHolidayPeriod);
    });
    it('should return error message', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-11',
      };
      const spy = jest.spyOn(controller, 'calculateHolidayPeriod');

      //act
      const result = await controller.calculateHolidayPeriod(dto, response);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockErrorMessage);
    });
  });
  describe('postHoliday', () => {
    it('should return posted holiday info', async () => {
      //arrange
      const spy = jest.spyOn(controller, 'postHoliday');

      //act
      const result = await controller.postHoliday(
        mockHolidayInfo,
        { user: 'mock' },
        response,
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockHolidayInfoResponse);
    });
    it('should return error message', async () => {
      //arrange
      const spy = jest.spyOn(controller, 'postHoliday');

      //act
      const result = await controller.postHoliday(
        mockHolidayInfoInvalid,
        { user: 'mock' },
        response,
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockErrorMessage);
    });
  });
  describe('getUserPTOs', () => {
    it('should return posted holiday info', async () => {
      //arrange
      const spy = jest.spyOn(controller, 'getUserPTOs');

      //act
      const result = await controller.getUserPTOs(
        { user: mockedUser },
        response,
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEmployeeHolidaysCalc);
    });

    describe('getPTOById', () => {
      it('should return detailed PTO information', async () => {
        //arrange
        const spy = jest.spyOn(controller, 'getPTOById');

        //act
        const result = await controller.getPTOById(
          '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
          response,
        );

        //assert
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(mockPTOInfo);
      });
    });
  });
});
