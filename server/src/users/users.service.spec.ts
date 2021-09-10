import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Teams } from '../model/teams.entity';
import { Positions } from '../model/positions.entity';
import { mockedUser } from '../common/holidaysMockedData';
import { PositionsEnum, TeamsEnum } from '../common/constants';

describe('UsersService', () => {
  let service: UsersService;

  const getMockedUser = (team, position) => {
    return { ...mockedUser, team, position };
  };

  const mockTeam = {
    id: '20149997-736d-4e71-bd1c-4392cb5d4b76',
    team: TeamsEnum.orchestrator,
    user: [],
  };

  const mockPosition = {
    id: 'cd2debe5-fdae-4bc8-9991-6cce9f6ca40e',
    team: PositionsEnum.regular,
    user: [],
  };

  const mockTeamsRepository = {
    findOne: jest.fn(() => Promise.resolve(mockTeam)),
  };
  const mockUserRepository = {
    findOne: jest.fn(() => Promise.resolve(mockedUser)),
    save: jest.fn(() => Promise.resolve(getMockedUser(mockTeam, undefined))),
  };
  const mockPositionsRepository = {
    findOne: jest.fn(() => Promise.resolve(mockPosition)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Teams),
          useValue: mockTeamsRepository,
        },
        {
          provide: getRepositoryToken(Positions),
          useValue: mockPositionsRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('setUsersTeamsAndPositions', () => {
    it('should return user team and position as string', async () => {
      //arrange
      const spy = jest.spyOn(service, 'setUsersTeamsAndPositions');

      //act
      const result = service.setUsersTeamsAndPositions([mockedUser]);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([
        getMockedUser(TeamsEnum.noTeam, PositionsEnum.noPosition),
      ]);
    });
  });

  describe('updateTeams', () => {
    it('should return user with updated team', async () => {
      //arrange
      const spy = jest.spyOn(service, 'updateTeams');

      //act
      const result = await service.updateTeams(
        [mockedUser.id],
        '20149997-736d-4e71-bd1c-4392cb5d4b76',
      );

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([getMockedUser(mockTeam, undefined)]);
    });
  });

  describe('getTeamById', () => {
    it('should return null when input is no team', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getTeamById');

      //act
      const result = await service.getTeamById(TeamsEnum.noTeam);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
    it('should return team when input is valid id', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getTeamById');

      //act
      const result = await service.getTeamById(mockTeam.id);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockTeam);
    });
  });

  describe('getPositionById', () => {
    it('should return null when input is no position', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getPositionById');

      //act
      const result = await service.getPositionById(PositionsEnum.noPosition);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
    it('should return position when input is valid id', async () => {
      //arrange
      const spy = jest.spyOn(service, 'getPositionById');

      //act
      const result = await service.getPositionById(mockPosition.id);

      //assert
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockPosition);
    });
  });
});
