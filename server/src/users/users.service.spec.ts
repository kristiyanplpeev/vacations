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
    team: 'Orchestrator',
  };

  const mockTeamsRepository = {
    findOne: jest.fn(() =>
      Promise.resolve({ id: 'id', team: TeamsEnum.orchestrator, user: [] }),
    ),
  };
  const mockUserRepository = {
    findOne: jest.fn(() => Promise.resolve(mockedUser)),
    save: jest.fn(() => Promise.resolve(getMockedUser(mockTeam, undefined))),
  };
  const mockPositionsRepository = {};

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
});
