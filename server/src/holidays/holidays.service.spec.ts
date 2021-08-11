import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { Holiday } from '../model/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

describe('HolidaysService', () => {
  let service: HolidaysService;

  const constantHolidays = [
    {
      id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
      date: '2022-01-01',
      movable: false,
      comment: "New Year's Day",
    },
    {
      id: 'a0deff5b-463c-490f-a271-862d7fee8334',
      date: '2022-03-03',
      movable: false,
      comment: 'Liberation Day',
    },
    {
      id: 'e30ba39f-7a12-49e1-bb9c-33c56086f816',
      date: '2022-05-01',
      movable: false,
      comment: 'Labour Day',
    },
    {
      id: 'ddfda220-1db2-4617-9654-36a211879ad5',
      date: '2022-05-06',
      movable: false,
      comment: "St. George's day",
    },
    {
      id: 'd10556cf-319c-4b39-97e4-28a5524e9abe',
      date: '2022-05-24',
      movable: false,
      comment: 'Culture And Literacy Day',
    },
    {
      id: '1567781d-93fc-4247-bb97-8c35fd47c02f',
      date: '2022-09-06',
      movable: false,
      comment: 'Unification Day',
    },
    {
      id: '17963a7e-35f0-4659-9e0e-46edb905afb8',
      date: '2022-09-22',
      movable: false,
      comment: 'Independence Day',
    },
    {
      id: '55c3951f-19cc-4c91-a5d0-bd75225d8233',
      date: '2022-12-24',
      movable: false,
      comment: 'Christmas Eve',
    },
    {
      id: 'ef828915-707c-439d-a50f-7e5b52b3b8eb',
      date: '2022-12-25',
      movable: false,
      comment: 'Christmas',
    },
    {
      id: '52e3bf5f-265f-4208-a4c4-289916260241',
      date: '2022-12-26',
      movable: false,
      comment: 'Second Day of Christmas',
    },
  ];

  const movableHolidays = [
    {
      id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
      date: '2022-04-22',
      movable: true,
      comment: 'Ortodox Good Friday',
    },
    {
      id: 'a0deff5b-463c-490f-a271-862d7fee8334',
      date: '2022-04-23',
      movable: true,
      comment: 'Ortodox Holy Saturday',
    },
    {
      id: 'e30ba39f-7a12-49e1-bb9c-33c56086f816',
      date: '2022-04-24',
      movable: true,
      comment: 'Ortodox Easter Day',
    },
    {
      id: 'ddfda220-1db2-4617-9654-36a211879ad5',
      date: '2022-04-25',
      movable: true,
      comment: 'Ortodox Easter Monday',
    },
  ];

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

  const mockSavedHoliday = {
    from_date: '2021-08-05',
    to_date: '2021-08-05',
    comment: 'PTO',
    status: 'requested',
    employee: {
      id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
    approvers: [
      {
        id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
        googleId: '106956791077954804246',
        email: 'kristiyan.peev@atscale.com',
        firstName: 'Kristiyan',
        lastName: 'Peev',
        picture:
          'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
      },
    ],
    id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
  };

  const mockEmployeeHolidays = [
    {
      id: '8389e44d-d807-4580-a9bf-ac59c07f1c4f',
      from_date: '2021-08-04',
      to_date: '2021-08-04',
      comment: 'PTO',
      status: 'requested',
    },
    {
      id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
      from_date: '2021-08-05',
      to_date: '2021-08-05',
      comment: 'PTO',
      status: 'requested',
    },
  ];

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

  const mockApprovers = [
    {
      id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
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
  };

  const mockReturnedPeriod = [
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
      status: 'weekend',
    },
  ];

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

    service = module.get<HolidaysService>(HolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDatesBetweenDates', () => {
    it('should return dates in a period', () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-14',
      };
      const spy = jest.spyOn(service, 'getDatesBetweenDates');

      //act
      const result = service.getDatesBetweenDates(dto);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(['2021-08-12', '2021-08-13', '2021-08-14']);
    });
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
  describe('validateHolidayPeriod', () => {
    it('should throw an error when starting date is before ending date', async () => {
      //arrange
      const dto = {
        startingDate: '2021-08-12',
        endingDate: '2021-08-11',
        comment: 'PTO',
        approvers: ['kristiyan.peev@atscale.com'],
      };
      const spy = jest.spyOn(service, 'validateHolidayPeriod');

      //act
      const result = service.validateHolidayPeriod(dto, mockedUser);

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
      const spy = jest.spyOn(service, 'validateHolidayPeriod');

      //act
      const result = service.validateHolidayPeriod(dto, mockedUser);

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
      const spy = jest.spyOn(service, 'validateHolidayPeriod');

      //act
      const result = await service.validateHolidayPeriod(dto, mockedUser);

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
});
