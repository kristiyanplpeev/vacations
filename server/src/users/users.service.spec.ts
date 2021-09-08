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

  const mockedUserWithTeamAndPositionAsString = [
    {
      id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
      PTO: [],
      team: TeamsEnum.noTeam,
      position: PositionsEnum.noPosition,
    },
  ];

  const userWithUpdatedTeam = {
    id: '2419e734-3445-471c-a940-397a7a279677',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    firstName: 'Kristiyan',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    team: {
      id: '20149997-736d-4e71-bd1c-4392cb5d4b76',
      team: 'Orchestrator',
    },
  };

  const mockTeamsRepository = {
    findOne: jest.fn(() =>
      Promise.resolve({ id: 'id', team: TeamsEnum.orchestrator, user: [] }),
    ),
  };
  const mockUserRepository = {
    findOne: jest.fn(() => Promise.resolve(mockedUser)),
    save: jest.fn(() => Promise.resolve(userWithUpdatedTeam)),
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
      expect(result).toEqual(mockedUserWithTeamAndPositionAsString);
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
      expect(result).toEqual([userWithUpdatedTeam]);
    });
  });
});
