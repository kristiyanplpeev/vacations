import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Userdb } from '../model/user.entity';
import { Teamsdb } from '../model/teams.entity';
import { Positionsdb } from '../model/positions.entity';
import { mockedUser, userDb } from '../common/holidaysMockedData';
import { PositionsEnum, TeamsEnum } from '../common/constants';
import { User } from 'src/google/utils/interfaces';

describe('UsersService', () => {
  let service: UsersService;

  const getMockedUser = (team, position) => {
    return { ...mockedUser, team, position };
  };

  const getTeamDb = (team) => ({
    id: 'cd2debe5-fdae-4bc8-9991-6cce9f6ca40e',
    team,
    user: [],
  });

  const getPositionDb = (position) => ({
    id: 'cd2debe5-fdae-4bc8-9991-6cce9f6ca40e',
    position,
    user: [],
  });

  const mockTeamsRepository = {
    findOne: jest.fn(() => Promise.resolve(getTeamDb(TeamsEnum.orchestrator))),
  };
  const mockUserRepository = {
    find: jest.fn(() => Promise.resolve([mockedUser])),
    save: jest.fn(() =>
      Promise.resolve([userDb(getMockedUser(getTeamDb(TeamsEnum.orchestrator), undefined))]),
    ),
  };
  const mockPositionsRepository = {
    findOne: jest.fn(() => Promise.resolve(getPositionDb(PositionsEnum.regular))),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Userdb),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Teamsdb),
          useValue: mockTeamsRepository,
        },
        {
          provide: getRepositoryToken(Positionsdb),
          useValue: mockPositionsRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('setUsersTeamsAndPositions', () => {
    it('should return user team and position as string', async () => {
      //arrange

      //act
      const result = service.setUsersTeamsAndPositions([mockedUser]);

      //assert
      expect(result).toEqual([
        getMockedUser(TeamsEnum.noTeam, PositionsEnum.noPosition),
      ]);
    });
  });

  describe('updateTeams', () => {
    it('should return user with updated team', async () => {
      //arrange

      //act
      const result = await service.updateTeams(
        [mockedUser.id],
        '20149997-736d-4e71-bd1c-4392cb5d4b76',
      );

      //assert
      expect(result).toEqual([getMockedUser(getTeamDb(TeamsEnum.orchestrator), undefined)]);
    });
  });

  describe('getTeamById', () => {
    it('should return null when input is no team', async () => {
      //arrange

      //act
      const result = await service.getTeamById(TeamsEnum.noTeam);

      //assert
      expect(result).toEqual(null);
    });
    it('should return team when input is valid id', async () => {
      //arrange

      //act
      const result = await service.getTeamById(getTeamDb(TeamsEnum.orchestrator).id);

      //assert
      expect(result).toEqual(getTeamDb(TeamsEnum.orchestrator));
    });
  });

  describe('getPositionById', () => {
    it('should return null when input is no position', async () => {
      //arrange

      //act
      const result = await service.getPositionById(PositionsEnum.noPosition);

      //assert
      expect(result).toEqual(null);
    });
    it('should return position when input is valid id', async () => {
      //arrange

      //act
      const result = await service.getPositionById(getPositionDb(PositionsEnum.regular).id);

      //assert
      expect(result).toEqual(getPositionDb(PositionsEnum.regular));
    });
  });
});
